'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppHeader } from '@/components/ui/app-header';
import {
  ArrowLeft,
  Bell,
  Settings,
  Clock,
  Mail,
  Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationTypes {
  [key: string]: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    preferences,
    loading: notificationsLoading,
    updatePreferences,
  } = useNotifications();

  const [isSaving, setIsSaving] = useState(false);
  const [localPreferences, setLocalPreferences] = useState({
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
  });

  // Load preferences when they're available
  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        emailNotifications: preferences.emailNotifications,
        pushNotifications: preferences.pushNotifications,
        weeklyDigest: preferences.weeklyDigest,
        types: { ...localPreferences.types, ...preferences.types },
        quietHours: preferences.quietHours || {
          enabled: false,
          start: '22:00',
          end: '08:00',
        },
      });
    }
  }, [preferences, localPreferences.types]);

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || notificationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePreferences(localPreferences);
      toast.success('Notification preferences saved successfully');
    } catch {
      toast.error('Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTypeToggle = (type: string) => {
    setLocalPreferences(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !(prev.types as NotificationTypes)[type],
      },
    }));
  };

  const handleQuietHoursToggle = () => {
    setLocalPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled,
      },
    }));
  };

  const notificationTypes = [
    {
      key: 'request_created',
      label: 'Request Created',
      description: 'When you create a new request',
    },
    {
      key: 'request_updated',
      label: 'Request Updated',
      description: 'When your request is modified',
    },
    {
      key: 'request_approved',
      label: 'Request Approved',
      description: 'When your request is approved',
    },
    {
      key: 'request_rejected',
      label: 'Request Rejected',
      description: 'When your request is rejected',
    },
    {
      key: 'request_returned',
      label: 'Request Returned',
      description: 'When your request is returned for changes',
    },
    {
      key: 'approval_needed',
      label: 'Approval Needed',
      description: 'When you need to approve a request',
    },
    {
      key: 'purchase_completed',
      label: 'Purchase Completed',
      description: 'When a purchase is completed',
    },
    {
      key: 'reconciliation_due',
      label: 'Reconciliation Due',
      description: 'When reconciliation is overdue',
    },
    {
      key: 'system_announcement',
      label: 'System Announcements',
      description: 'Important system updates',
    },
    {
      key: 'role_assigned',
      label: 'Role Changes',
      description: 'When your role is updated',
    },
    {
      key: 'limit_exceeded',
      label: 'Limit Exceeded',
      description: 'When approval limits are exceeded',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Notification Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage how you receive notifications about your procurement
            requests.
          </p>
        </div>

        <div className="space-y-6">
          {/* General Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Email Notifications
                      </div>
                      <div className="text-xs text-gray-500">
                        Receive notifications via email
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localPreferences.emailNotifications}
                    onChange={e =>
                      setLocalPreferences(prev => ({
                        ...prev,
                        emailNotifications: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Push Notifications
                      </div>
                      <div className="text-xs text-gray-500">
                        Receive push notifications in your browser
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localPreferences.pushNotifications}
                    onChange={e =>
                      setLocalPreferences(prev => ({
                        ...prev,
                        pushNotifications: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Weekly Digest
                      </div>
                      <div className="text-xs text-gray-500">
                        Receive a weekly summary of your requests
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localPreferences.weeklyDigest}
                    onChange={e =>
                      setLocalPreferences(prev => ({
                        ...prev,
                        weeklyDigest: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Notification Types
              </CardTitle>
              <CardDescription>
                Choose which types of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationTypes.map(type => (
                  <label
                    key={type.key}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {type.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {type.description}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        (localPreferences.types as NotificationTypes)[type.key] || false
                      }
                      onChange={() => handleTypeToggle(type.key)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Quiet Hours
              </CardTitle>
              <CardDescription>
                Set times when you don&apos;t want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Enable Quiet Hours
                  </div>
                  <div className="text-xs text-gray-500">
                    Pause notifications during specified hours
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localPreferences.quietHours.enabled}
                  onChange={handleQuietHoursToggle}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </label>

              {localPreferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={localPreferences.quietHours.start}
                      onChange={e =>
                        setLocalPreferences(prev => ({
                          ...prev,
                          quietHours: {
                            ...prev.quietHours,
                            start: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={localPreferences.quietHours.end}
                      onChange={e =>
                        setLocalPreferences(prev => ({
                          ...prev,
                          quietHours: {
                            ...prev.quietHours,
                            end: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
