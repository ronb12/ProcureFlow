import { createNotification, NotificationFactory } from './notifications';
import { NotificationPreferences } from './types';

class NotificationService {
  private static instance: NotificationService;
  private preferences: Map<string, NotificationPreferences> = new Map();

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Set user preferences for notification filtering
  public setUserPreferences(
    userId: string,
    preferences: NotificationPreferences
  ) {
    this.preferences.set(userId, preferences);
  }

  // Check if user should receive notification based on preferences
  private shouldSendNotification(userId: string, type: string): boolean {
    const userPrefs = this.preferences.get(userId);
    if (!userPrefs) return true; // Default to sending if no preferences set

    // Check if this notification type is enabled
    if (userPrefs.types[type] === false) return false;

    // Check quiet hours
    if (this.isQuietHours(userPrefs)) return false;

    return true;
  }

  // Check if it's currently quiet hours
  private isQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHours?.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = preferences.quietHours.start
      .split(':')
      .map(Number);
    const [endHour, endMin] = preferences.quietHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }

    return currentTime >= startTime && currentTime <= endTime;
  }

  // Send notification if user preferences allow it
  private async sendNotificationIfAllowed(
    notification: Omit<any, 'id' | 'createdAt'>
  ) {
    if (this.shouldSendNotification(notification.userId, notification.type)) {
      try {
        await createNotification(notification);
        console.log(
          `Notification sent to user ${notification.userId}: ${notification.title}`
        );
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    } else {
      console.log(
        `Notification blocked for user ${notification.userId} due to preferences`
      );
    }
  }

  // Request-related notifications
  public async notifyRequestCreated(
    userId: string,
    requestId: string,
    vendor: string,
    total: number
  ) {
    const notification = NotificationFactory.requestCreated(
      userId,
      requestId,
      vendor,
      total
    );
    await this.sendNotificationIfAllowed(notification);
  }

  public async notifyRequestUpdated(
    userId: string,
    requestId: string,
    vendor: string,
    changes: string[]
  ) {
    const notification = {
      userId,
      type: 'request_updated' as const,
      title: 'Request Updated',
      message: `Your request for ${vendor} has been updated: ${changes.join(', ')}.`,
      data: { requestId, vendor, changes },
      priority: 'medium' as const,
    };
    await this.sendNotificationIfAllowed(notification);
  }

  public async notifyRequestApproved(
    userId: string,
    requestId: string,
    approverName: string
  ) {
    const notification = NotificationFactory.requestApproved(
      userId,
      requestId,
      approverName
    );
    await this.sendNotificationIfAllowed(notification);
  }

  public async notifyRequestRejected(
    userId: string,
    requestId: string,
    approverName: string,
    reason?: string
  ) {
    const notification = NotificationFactory.requestRejected(
      userId,
      requestId,
      approverName,
      reason
    );
    await this.sendNotificationIfAllowed(notification);
  }

  public async notifyRequestReturned(
    userId: string,
    requestId: string,
    approverName: string,
    reason?: string
  ) {
    const notification = {
      userId,
      type: 'request_returned' as const,
      title: 'Request Returned',
      message: `Your request has been returned by ${approverName}${reason ? `: ${reason}` : ' for additional information.'}`,
      data: { requestId, approverName, reason },
      priority: 'high' as const,
    };
    await this.sendNotificationIfAllowed(notification);
  }

  // Approval-related notifications
  public async notifyApprovalNeeded(
    userId: string,
    requestId: string,
    requesterName: string,
    total: number
  ) {
    const notification = NotificationFactory.approvalNeeded(
      userId,
      requestId,
      requesterName,
      total
    );
    await this.sendNotificationIfAllowed(notification);
  }

  // Purchase-related notifications
  public async notifyPurchaseCompleted(
    userId: string,
    requestId: string,
    vendor: string
  ) {
    const notification = NotificationFactory.purchaseCompleted(
      userId,
      requestId,
      vendor
    );
    await this.sendNotificationIfAllowed(notification);
  }

  // Reconciliation notifications
  public async notifyReconciliationDue(
    userId: string,
    requestId: string,
    daysOverdue: number
  ) {
    const notification = NotificationFactory.reconciliationDue(
      userId,
      requestId,
      daysOverdue
    );
    await this.sendNotificationIfAllowed(notification);
  }

  // System notifications
  public async notifySystemAnnouncement(
    userId: string,
    title: string,
    message: string
  ) {
    const notification = NotificationFactory.systemAnnouncement(
      userId,
      title,
      message
    );
    await this.sendNotificationIfAllowed(notification);
  }

  // User management notifications
  public async notifyRoleAssigned(
    userId: string,
    newRole: string,
    assignedBy: string
  ) {
    const notification = NotificationFactory.roleAssigned(
      userId,
      newRole,
      assignedBy
    );
    await this.sendNotificationIfAllowed(notification);
  }

  // Policy and limit notifications
  public async notifyLimitExceeded(
    userId: string,
    requestId: string,
    amount: number,
    limit: number
  ) {
    const notification = NotificationFactory.limitExceeded(
      userId,
      requestId,
      amount,
      limit
    );
    await this.sendNotificationIfAllowed(notification);
  }

  // Bulk notifications for multiple users
  public async notifyMultipleUsers(
    userIds: string[],
    notification: Omit<any, 'id' | 'createdAt' | 'userId'>
  ) {
    const promises = userIds.map(userId =>
      this.sendNotificationIfAllowed({ ...notification, userId })
    );
    await Promise.allSettled(promises);
  }

  // Notify all users with a specific role
  public async notifyUsersByRole(
    role: string,
    notification: Omit<any, 'id' | 'createdAt' | 'userId'>
  ) {
    // This would typically query the database for users with the specified role
    // For now, we'll just log it
    console.log(`Would notify all users with role ${role}:`, notification);
  }

  // Emergency/broadcast notifications
  public async broadcastNotification(
    userIds: string[],
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'high'
  ) {
    const notification = {
      type: 'system_announcement' as const,
      title,
      message,
      priority,
    };
    await this.notifyMultipleUsers(userIds, notification);
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
