'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/use-notifications';
import {
  Bell,
  CheckCheck,
  Trash2,
  Settings,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/lib/types';

interface NotificationDropdownProps {
  className?: string;
}

export function NotificationDropdown({
  className = '',
}: NotificationDropdownProps) {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllAsRead();
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `h-4 w-4 ${
      priority === 'urgent'
        ? 'text-red-500'
        : priority === 'high'
          ? 'text-orange-500'
          : priority === 'medium'
            ? 'text-blue-500'
            : 'text-gray-500'
    }`;

    switch (type) {
      case 'request_approved':
        return <CheckCircle className={iconClass} />;
      case 'request_rejected':
        return <XCircle className={iconClass} />;
      case 'approval_needed':
        return <AlertCircle className={iconClass} />;
      case 'reconciliation_due':
        return <AlertCircle className={iconClass} />;
      case 'system_announcement':
        return <Info className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center min-w-[12px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({unreadCount} unread)
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={isMarkingAll}
                    className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    {isMarkingAll ? 'Marking...' : 'Mark all read'}
                  </button>
                )}
                <button
                  onClick={() => {
                    router.push('/notifications');
                    setIsOpen(false);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <Settings className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 10).map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                      notification.read
                        ? 'bg-white'
                        : getPriorityColor(notification.priority)
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(
                          notification.type,
                          notification.priority
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                notification.read
                                  ? 'text-gray-900'
                                  : 'text-gray-900'
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(notification.createdAt, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            )}
                            <button
                              onClick={e =>
                                handleDeleteNotification(e, notification.id)
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <button className="text-xs text-blue-600 hover:text-blue-800 w-full text-center">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
