import { getFirestore } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase-admin/auth';

const db = getFirestore();
// const auth = getAuth();

export interface NotificationData {
  type:
    | 'status_change'
    | 'approval_needed'
    | 'purchase_completed'
    | 'reconciliation_due'
    | 'purchase_order_created';
  requestId: string;
  newStatus?: string;
  actorUid: string;
  message?: string;
  purchaseOrderId?: string;
  poNumber?: string;
  targetUserId?: string;
}

export async function sendNotification(data: NotificationData): Promise<void> {
  try {
    // Determine target user ID
    let targetUserId: string;
    let targetEmail: string;

    if (data.type === 'purchase_order_created' && data.targetUserId) {
      // For purchase order notifications, use the specified target user (cardholder)
      targetUserId = data.targetUserId;
    } else {
      // For other notifications, use the requester
      const requestDoc = await db
        .collection('requests')
        .doc(data.requestId)
        .get();
      if (!requestDoc.exists) {
        console.error('Request not found for notification:', data.requestId);
        return;
      }

      const request = requestDoc.data();
      targetUserId = request?.requesterId;

      if (!targetUserId) {
        console.error('No requester ID found for request:', data.requestId);
        return;
      }
    }

    // Get target user data
    const targetUserDoc = await db.collection('users').doc(targetUserId).get();
    if (!targetUserDoc.exists) {
      console.error('Target user not found:', targetUserId);
      return;
    }

    const targetUser = targetUserDoc.data();
    targetEmail = targetUser?.email;

    if (!targetEmail) {
      console.error('No email found for target user:', targetUserId);
      return;
    }

    // Get request data for message generation
    const requestDoc = await db
      .collection('requests')
      .doc(data.requestId)
      .get();
    const request = requestDoc.exists ? requestDoc.data() : {};

    // Get actor user data
    const actorDoc = await db.collection('users').doc(data.actorUid).get();
    const actorName = actorDoc.exists ? actorDoc.data()?.name : 'Unknown User';

    // Generate notification message
    const message = generateNotificationMessage(data, request, actorName);

    // Store notification in database
    await db.collection('notifications').add({
      userId: targetUserId,
      type: data.type,
      requestId: data.requestId,
      purchaseOrderId: data.purchaseOrderId,
      message,
      read: false,
      createdAt: new Date(),
    });

    // Send email notification (if configured)
    if (process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY) {
      await sendEmailNotification(targetEmail, message, data.requestId);
    }

    console.log('Notification sent successfully:', data.requestId);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

function generateNotificationMessage(
  data: NotificationData,
  request: any,
  actorName: string
): string {
  const vendor = request?.vendor || 'Unknown Vendor';
  const total = request?.totalEstimate || 0;

  switch (data.type) {
    case 'status_change':
      return `Your request for ${vendor} ($${total.toFixed(2)}) has been updated to "${data.newStatus}" by ${actorName}.`;

    case 'approval_needed':
      return `Your request for ${vendor} ($${total.toFixed(2)}) is ready for approval.`;

    case 'purchase_completed':
      return `Your request for ${vendor} ($${total.toFixed(2)}) has been purchased by ${actorName}.`;

    case 'reconciliation_due':
      return `Your request for ${vendor} ($${total.toFixed(2)}) is ready for reconciliation.`;

    case 'purchase_order_created':
      return `A purchase order ${data.poNumber} has been created for your request ${data.requestId} (${vendor} - $${total.toFixed(2)}). You can now begin the purchasing process.`;

    default:
      return data.message || `Update for your request ${data.requestId}`;
  }
}

async function sendEmailNotification(
  email: string,
  message: string,
  requestId: string
): Promise<void> {
  // This is a placeholder for email sending
  // In a real implementation, you would use SendGrid, Resend, or another email service

  console.log('Email notification would be sent to:', email);
  console.log('Message:', message);
  console.log('Request ID:', requestId);

  // Example SendGrid implementation:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  //
  // const msg = {
  //   to: email,
  //   from: 'noreply@procureflow.com',
  //   subject: 'ProcureFlow Notification',
  //   text: message,
  //   html: `<p>${message}</p><p><a href="https://your-app.com/requests/${requestId}">View Request</a></p>`,
  // };
  //
  // await sgMail.send(msg);
}
