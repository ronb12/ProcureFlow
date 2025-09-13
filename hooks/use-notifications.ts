'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import {
  subscribeToNotifications,
  subscribeToUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  createDefaultNotificationPreferences,
} from '@/lib/notifications';
import { Notification, NotificationPreferences } from '@/lib/types';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notification preferences
  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        const prefs = await getNotificationPreferences(user.id);
        if (prefs) {
          setPreferences(prefs);
        } else {
          // Create default preferences if none exist
          await createDefaultNotificationPreferences(user.id);
          const defaultPrefs = await getNotificationPreferences(user.id);
          setPreferences(defaultPrefs);
        }
      } catch (err) {
        console.error('Error loading notification preferences:', err);
        setError('Failed to load notification preferences');
      }
    };

    loadPreferences();
  }, [user]);

  // Subscribe to notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribeNotifications = subscribeToNotifications(
      user.id,
      newNotifications => {
        setNotifications(newNotifications);
        setLoading(false);
      }
    );

    const unsubscribeUnreadCount = subscribeToUnreadCount(user.id, count => {
      setUnreadCount(count);
    });

    return () => {
      unsubscribeNotifications();
      unsubscribeUnreadCount();
    };
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await markAllNotificationsAsRead(user.id);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read');
    }
  }, [user]);

  // Delete notification
  const deleteNotificationById = useCallback(async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    }
  }, []);

  // Update notification preferences
  const updatePreferences = useCallback(
    async (newPreferences: Partial<NotificationPreferences>) => {
      if (!user) return;

      try {
        await updateNotificationPreferences(user.id, newPreferences);
        setPreferences(prev => (prev ? { ...prev, ...newPreferences } : null));
      } catch (err) {
        console.error('Error updating notification preferences:', err);
        setError('Failed to update notification preferences');
      }
    },
    [user]
  );

  // Get unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);

  // Get notifications by type
  const getNotificationsByType = useCallback(
    (type: string) => {
      return notifications.filter(n => n.type === type);
    },
    [notifications]
  );

  // Get notifications by priority
  const getNotificationsByPriority = useCallback(
    (priority: string) => {
      return notifications.filter(n => n.priority === priority);
    },
    [notifications]
  );

  // Check if user has notifications enabled for a specific type
  const isNotificationTypeEnabled = useCallback(
    (type: string) => {
      if (!preferences) return true;
      return preferences.types[type] !== false;
    },
    [preferences]
  );

  // Check if it's currently quiet hours
  const isQuietHours = useCallback(() => {
    if (!preferences?.quietHours?.enabled) return false;

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
  }, [preferences]);

  return {
    notifications,
    unreadNotifications,
    unreadCount,
    preferences,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationById,
    updatePreferences,
    getNotificationsByType,
    getNotificationsByPriority,
    isNotificationTypeEnabled,
    isQuietHours,
  };
}
