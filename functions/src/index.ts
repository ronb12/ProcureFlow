import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';
import { RequestStatus, UserRole, PolicyCheck } from '../types';
import { RequestStateMachine } from '../state-machine';
import { createCSV, createReceiptsZip } from './exports';
import { sendNotification } from './notifications';
import { auditEvent } from './audit';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

// State transition function
export const stateTransition = onCall(async (request) => {
  const { reqId, targetState, payload, comment } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Get user and request data
    const [userDoc, requestDoc] = await Promise.all([
      db.collection('users').doc(uid).get(),
      db.collection('requests').doc(reqId).get(),
    ]);

    if (!userDoc.exists || !requestDoc.exists) {
      throw new HttpsError('not-found', 'User or request not found');
    }

    const user = userDoc.data();
    const requestData = requestDoc.data();
    const currentState = requestData?.status as RequestStatus;

    // Validate transition
    const validation = RequestStateMachine.validateTransition(
      currentState,
      targetState,
      user?.role as UserRole,
      {
        requestId: reqId,
        userId: uid,
        orgId: user?.orgId,
        amount: requestData?.totalEstimate,
        approvalLimit: user?.approvalLimit,
      }
    );

    if (!validation.valid) {
      throw new HttpsError('failed-precondition', validation.reason || 'Invalid transition');
    }

    // Perform policy checks
    const policyChecks = await performPolicyChecks(requestData, user);
    const hasErrors = policyChecks.some(check => check.severity === 'error');
    
    if (hasErrors) {
      throw new HttpsError('failed-precondition', 'Policy checks failed', { policyChecks });
    }

    // Update request status
    await db.collection('requests').doc(reqId).update({
      status: targetState,
      updatedAt: new Date(),
      ...payload,
    });

    // Create audit event
    await auditEvent({
      entity: 'request',
      entityId: reqId,
      actorUid: uid,
      action: `status_changed_to_${targetState}`,
      details: {
        from: currentState,
        to: targetState,
        comment,
        payload,
      },
    });

    // Send notification
    await sendNotification({
      type: 'status_change',
      requestId: reqId,
      newStatus: targetState,
      actorUid: uid,
    });

    return { success: true, policyChecks };
  } catch (error) {
    console.error('State transition error:', error);
    throw error;
  }
});

// Create approval function
export const createApproval = onCall(async (request) => {
  const { reqId, action, comment } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Get user data
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User not found');
    }

    const user = userDoc.data();
    if (!['approver', 'admin'].includes(user?.role)) {
      throw new HttpsError('permission-denied', 'User not authorized to create approvals');
    }

    // Create approval document
    const approvalRef = await db.collection('approvals').add({
      reqId,
      approverId: uid,
      action,
      comment,
      timestamp: new Date(),
    });

    // Create audit event
    await auditEvent({
      entity: 'approval',
      entityId: approvalRef.id,
      actorUid: uid,
      action: 'created',
      details: { reqId, action, comment },
    });

    return { success: true, approvalId: approvalRef.id };
  } catch (error) {
    console.error('Create approval error:', error);
    throw error;
  }
});

// Record purchase function
export const recordPurchase = onCall(async (request) => {
  const { reqId, orderNumber, finalTotal, tax, purchasedAt, receiptFileName } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Get user data
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User not found');
    }

    const user = userDoc.data();
    if (!['cardholder', 'admin'].includes(user?.role)) {
      throw new HttpsError('permission-denied', 'User not authorized to record purchases');
    }

    // Get request data
    const requestDoc = await db.collection('requests').doc(reqId).get();
    if (!requestDoc.exists) {
      throw new HttpsError('not-found', 'Request not found');
    }

    const requestData = requestDoc.data();
    if (requestData?.status !== 'Cardholder Purchasing') {
      throw new HttpsError('failed-precondition', 'Request must be in Cardholder Purchasing status');
    }

    // Upload receipt if provided
    let receiptUrl = '';
    if (receiptFileName) {
      const bucket = storage.bucket();
      const fileName = `receipts/${user.orgId}/${reqId}/${receiptFileName}`;
      const file = bucket.file(fileName);
      
      // Generate signed URL for upload (this would be done client-side)
      receiptUrl = `gs://${bucket.name}/${fileName}`;
    }

    // Create purchase document
    const purchaseRef = await db.collection('purchases').add({
      reqId,
      cardholderId: uid,
      merchant: requestData.vendor,
      orderNumber,
      finalTotal,
      tax,
      purchasedAt: new Date(purchasedAt),
      receiptUrl,
      receiptFileName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update request status
    await db.collection('requests').doc(reqId).update({
      status: 'Purchased',
      updatedAt: new Date(),
    });

    // Create audit event
    await auditEvent({
      entity: 'purchase',
      entityId: purchaseRef.id,
      actorUid: uid,
      action: 'created',
      details: { reqId, orderNumber, finalTotal, tax },
    });

    return { success: true, purchaseId: purchaseRef.id, receiptUrl };
  } catch (error) {
    console.error('Record purchase error:', error);
    throw error;
  }
});

// Export cycle CSV function
export const exportCycleCsv = onCall(async (request) => {
  const { cycleId } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Check user permissions
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User not found');
    }

    const user = userDoc.data();
    if (!['cardholder', 'admin'].includes(user?.role)) {
      throw new HttpsError('permission-denied', 'User not authorized to export data');
    }

    // Get cycle data
    const cycleDoc = await db.collection('cycles').doc(cycleId).get();
    if (!cycleDoc.exists) {
      throw new HttpsError('not-found', 'Cycle not found');
    }

    const cycleData = cycleDoc.data();
    const startDate = cycleData?.startDate.toDate();
    const endDate = cycleData?.endDate.toDate();

    // Get purchases within cycle dates
    const purchasesSnapshot = await db
      .collection('purchases')
      .where('purchasedAt', '>=', startDate)
      .where('purchasedAt', '<=', endDate)
      .get();

    // Get request data for each purchase
    const exportData = [];
    for (const purchaseDoc of purchasesSnapshot.docs) {
      const purchase = purchaseDoc.data();
      const requestDoc = await db.collection('requests').doc(purchase.reqId).get();
      const requestData = requestDoc.data();

      exportData.push({
        requestId: purchase.reqId,
        vendor: purchase.merchant,
        orderNumber: purchase.orderNumber,
        finalTotal: purchase.finalTotal,
        tax: purchase.tax,
        accountingCode: requestData?.accountingCode || '',
        purchasedAt: purchase.purchasedAt.toDate(),
        receiptUrl: purchase.receiptUrl || '',
      });
    }

    // Create CSV
    const csvContent = await createCSV(exportData);

    // Upload to storage
    const bucket = storage.bucket();
    const fileName = `exports/cycles/${cycleId}/recon.csv`;
    const file = bucket.file(fileName);
    
    await file.save(csvContent, {
      metadata: {
        contentType: 'text/csv',
      },
    });

    // Generate signed URL
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    return { success: true, downloadUrl: signedUrl };
  } catch (error) {
    console.error('Export CSV error:', error);
    throw error;
  }
});

// Export cycle receipts ZIP function
export const exportCycleReceiptsZip = onCall(async (request) => {
  const { cycleId } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Check user permissions
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User not found');
    }

    const user = userDoc.data();
    if (!['cardholder', 'admin'].includes(user?.role)) {
      throw new HttpsError('permission-denied', 'User not authorized to export data');
    }

    // Get cycle data
    const cycleDoc = await db.collection('cycles').doc(cycleId).get();
    if (!cycleDoc.exists) {
      throw new HttpsError('not-found', 'Cycle not found');
    }

    const cycleData = cycleDoc.data();
    const startDate = cycleData?.startDate.toDate();
    const endDate = cycleData?.endDate.toDate();

    // Get purchases with receipts
    const purchasesSnapshot = await db
      .collection('purchases')
      .where('purchasedAt', '>=', startDate)
      .where('purchasedAt', '<=', endDate)
      .where('receiptUrl', '!=', '')
      .get();

    // Create ZIP file
    const zipBuffer = await createReceiptsZip(purchasesSnapshot.docs);

    // Upload to storage
    const bucket = storage.bucket();
    const fileName = `exports/cycles/${cycleId}/receipts.zip`;
    const file = bucket.file(fileName);
    
    await file.save(zipBuffer, {
      metadata: {
        contentType: 'application/zip',
      },
    });

    // Generate signed URL
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    return { success: true, downloadUrl: signedUrl };
  } catch (error) {
    console.error('Export ZIP error:', error);
    throw error;
  }
});

// Monthly cycle close function
export const scheduleMonthlyClose = onSchedule('55 23 L * *', async () => {
  try {
    // Get current month's cycle
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const cycleQuery = await db
      .collection('cycles')
      .where('status', '==', 'open')
      .where('startDate', '<=', now)
      .get();

    if (cycleQuery.empty) {
      console.log('No open cycles to close');
      return;
    }

    // Close current cycle
    const batch = db.batch();
    cycleQuery.docs.forEach(doc => {
      batch.update(doc.ref, {
        status: 'closed',
        endDate: now,
        updatedAt: now,
      });
    });

    // Create next month's cycle
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    const nextMonthEnd = new Date(currentYear, currentMonth + 2, 0);
    
    const nextCycleRef = db.collection('cycles').doc();
    batch.set(nextCycleRef, {
      startDate: nextMonth,
      endDate: nextMonthEnd,
      status: 'open',
      createdAt: now,
      updatedAt: now,
    });

    await batch.commit();
    console.log('Monthly cycle closed and new cycle created');
  } catch (error) {
    console.error('Monthly close error:', error);
  }
});

// Policy checks function
async function performPolicyChecks(requestData: any, user: any): Promise<PolicyCheck[]> {
  const checks: PolicyCheck[] = [];

  // Get global settings
  const settingsDoc = await db.collection('settings').doc('global').get();
  const settings = settingsDoc.data();

  if (!settings) {
    return checks;
  }

  // Micro purchase limit check
  if (requestData.totalEstimate > settings.microPurchaseLimit) {
    checks.push({
      type: 'micro_purchase_limit',
      severity: 'warning',
      message: `Estimated total (${requestData.totalEstimate}) exceeds micro purchase limit (${settings.microPurchaseLimit})`,
      details: {
        estimatedTotal: requestData.totalEstimate,
        limit: settings.microPurchaseLimit,
      },
    });
  }

  // Blocked merchant check
  if (settings.blockedMerchants?.includes(requestData.vendor)) {
    checks.push({
      type: 'blocked_merchant',
      severity: 'error',
      message: `Vendor "${requestData.vendor}" is blocked`,
      details: {
        vendor: requestData.vendor,
      },
    });
  }

  // Split purchase check
  if (settings.splitPurchaseWindowDays > 0) {
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - settings.splitPurchaseWindowDays);

    const recentRequestsSnapshot = await db
      .collection('requests')
      .where('requesterId', '==', user.uid)
      .where('vendor', '==', requestData.vendor)
      .where('createdAt', '>=', windowStart)
      .get();

    if (!recentRequestsSnapshot.empty) {
      const recentTotal = recentRequestsSnapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().totalEstimate || 0);
      }, 0);

      const combinedTotal = recentTotal + requestData.totalEstimate;
      
      if (combinedTotal > settings.microPurchaseLimit) {
        checks.push({
          type: 'split_purchase',
          severity: 'warning',
          message: `Combined total with recent purchases (${combinedTotal}) may indicate split purchasing`,
          details: {
            currentTotal: requestData.totalEstimate,
            recentTotal,
            combinedTotal,
            windowDays: settings.splitPurchaseWindowDays,
          },
        });
      }
    }
  }

  return checks;
}
