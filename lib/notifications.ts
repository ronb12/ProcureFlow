import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  getDoc,
  setDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Notification, NotificationPreferences } from './types';

// Create a new notification
export async function createNotification(
  notification: Omit<Notification, 'id' | 'createdAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Mark notification as read
export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(
  userId: string
): Promise<void> {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(notificationsQuery);
    const batch = writeBatch(db);

    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: Timestamp.now(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

// Delete a notification
export async function deleteNotification(
  notificationId: string
): Promise<void> {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notificationRef);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

// Get notifications for a user
export async function getNotifications(
  userId: string,
  limitCount: number = 50
): Promise<Notification[]> {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(notificationsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      readAt: doc.data().readAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as Notification[];
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
}

// Get unread notification count
export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(notificationsQuery);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
}

// Subscribe to notifications for real-time updates
export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): () => void {
  const notificationsQuery = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(notificationsQuery, snapshot => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      readAt: doc.data().readAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as Notification[];

    callback(notifications);
  });
}

// Subscribe to unread count for real-time updates
export function subscribeToUnreadCount(
  userId: string,
  callback: (count: number) => void
): () => void {
  const notificationsQuery = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  return onSnapshot(notificationsQuery, snapshot => {
    callback(snapshot.size);
  });
}

// Get notification preferences
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences | null> {
  try {
    const preferencesRef = doc(db, 'notificationPreferences', userId);
    const snapshot = await getDoc(preferencesRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      ...data,
      quietHours: data.quietHours || {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
    } as NotificationPreferences;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return null;
  }
}

// Update notification preferences
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  try {
    const preferencesRef = doc(db, 'notificationPreferences', userId);
    await updateDoc(preferencesRef, {
      ...preferences,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
}

// Create default notification preferences
export async function createDefaultNotificationPreferences(
  userId: string
): Promise<void> {
  try {
    const preferencesRef = doc(db, 'notificationPreferences', userId);
    await setDoc(preferencesRef, {
      userId,
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      types: {
        request_created: true,
        request_updated: true,
        request_approved: true,
        request_rejected: true,
        request_returned: true,
        approval_needed: true,
        purchase_completed: true,
        reconciliation_due: true,
        system_announcement: true,
        role_assigned: true,
        limit_exceeded: true,
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating default notification preferences:', error);
    throw error;
  }
}

// Notification factory functions for common notification types
export const NotificationFactory = {
  // Request created notification
  requestCreated: (
    userId: string,
    requestId: string,
    vendor: string,
    total: number
  ) => ({
    userId,
    type: 'request_created' as const,
    title: 'New Request Created',
    message: `Your request for ${vendor} ($${total.toLocaleString()}) has been created and is pending review.`,
    data: { requestId, vendor, total },
    priority: 'medium' as const,
  }),

  // Request approved notification
  requestApproved: (
    userId: string,
    requestId: string,
    approverName: string
  ) => ({
    userId,
    type: 'request_approved' as const,
    title: 'Request Approved',
    message: `Your request has been approved by ${approverName} and is ready for purchasing.`,
    data: { requestId, approverName },
    priority: 'high' as const,
  }),

  // Request rejected notification
  requestRejected: (
    userId: string,
    requestId: string,
    approverName: string,
    reason?: string
  ) => ({
    userId,
    type: 'request_rejected' as const,
    title: 'Request Rejected',
    message: `Your request has been rejected by ${approverName}${reason ? `: ${reason}` : '.'}`,
    data: { requestId, approverName, reason },
    priority: 'high' as const,
  }),

  // Approval needed notification
  approvalNeeded: (
    userId: string,
    requestId: string,
    requesterName: string,
    total: number
  ) => ({
    userId,
    type: 'approval_needed' as const,
    title: 'Approval Required',
    message: `You have a new request from ${requesterName} ($${total.toLocaleString()}) that requires your approval.`,
    data: { requestId, requesterName, total },
    priority: 'high' as const,
  }),

  // Purchase completed notification
  purchaseCompleted: (userId: string, requestId: string, vendor: string) => ({
    userId,
    type: 'purchase_completed' as const,
    title: 'Purchase Completed',
    message: `Your request for ${vendor} has been purchased and is ready for reconciliation.`,
    data: { requestId, vendor },
    priority: 'medium' as const,
  }),

  // Reconciliation due notification
  reconciliationDue: (
    userId: string,
    requestId: string,
    daysOverdue: number
  ) => ({
    userId,
    type: 'reconciliation_due' as const,
    title: 'Reconciliation Overdue',
    message: `Your request is ${daysOverdue} days overdue for reconciliation. Please submit receipts soon.`,
    data: { requestId, daysOverdue },
    priority: 'urgent' as const,
  }),

  // System announcement
  systemAnnouncement: (userId: string, title: string, message: string) => ({
    userId,
    type: 'system_announcement' as const,
    title,
    message,
    priority: 'medium' as const,
  }),

  // Role assigned notification
  roleAssigned: (userId: string, newRole: string, assignedBy: string) => ({
    userId,
    type: 'role_assigned' as const,
    title: 'Role Updated',
    message: `Your role has been updated to ${newRole} by ${assignedBy}.`,
    data: { newRole, assignedBy },
    priority: 'high' as const,
  }),

  // Limit exceeded notification
  limitExceeded: (
    userId: string,
    requestId: string,
    amount: number,
    limit: number
  ) => ({
    userId,
    type: 'limit_exceeded' as const,
    title: 'Approval Limit Exceeded',
    message: `Your request amount ($${amount.toLocaleString()}) exceeds your approval limit ($${limit.toLocaleString()}). Additional approval required.`,
    data: { requestId, amount, limit },
    priority: 'urgent' as const,
  }),
};
