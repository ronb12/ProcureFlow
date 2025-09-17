'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdminNav } from '@/components/ui/admin-nav';
import {
  Settings,
  Database,
  Mail,
  Shield,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SystemSettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // System settings state
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    auditLogging: true,
    autoBackup: false,
    sessionTimeout: 30,
  });

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check if user has admin permissions
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access system settings.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSettingChange = (key: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAction = async (action: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (action) {
        case 'save_settings':
          toast.success('Settings saved successfully');
          break;
        case 'export_data':
          toast.success('Data export started');
          break;
        case 'backup_database':
          toast.success('Database backup initiated');
          break;
        case 'restore_database':
          toast.success('Database restore completed');
          break;
        case 'clear_cache':
          toast.success('Cache cleared successfully');
          break;
        case 'restart_services':
          toast.success('Services restarted');
          break;
        default:
          toast.success(`${action} completed`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to complete ${action}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage system configuration, maintenance, and data operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic system configuration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-sm text-gray-600">
                    Enable to restrict access to the system
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">
                    Send system notifications via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Audit Logging</p>
                  <p className="text-sm text-gray-600">
                    Enable detailed audit logging
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.auditLogging}
                    onChange={(e) => handleSettingChange('auditLogging', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Session Timeout (minutes)</p>
                  <p className="text-sm text-gray-600">
                    Auto-logout after inactivity
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="5"
                  max="480"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
              <CardDescription>
                Database operations and data handling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={() => handleAction('export_data')}
                  disabled={isProcessing}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>

                <Button
                  onClick={() => handleAction('backup_database')}
                  disabled={isProcessing}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>

                <Button
                  onClick={() => handleAction('restore_database')}
                  disabled={isProcessing}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Restore Database
                </Button>

                <Button
                  onClick={() => handleAction('clear_cache')}
                  disabled={isProcessing}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                System Operations
              </CardTitle>
              <CardDescription>
                System maintenance and security operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={() => handleAction('restart_services')}
                  disabled={isProcessing}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restart Services
                </Button>

                <Button
                  onClick={() => handleAction('update_security')}
                  disabled={isProcessing}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Update Security Policies
                </Button>

                <Button
                  onClick={() => handleAction('check_updates')}
                  disabled={isProcessing}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Check for Updates
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                System Status
              </CardTitle>
              <CardDescription>
                Current system health and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Database</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Online
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Authentication</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email Service</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Storage</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Available
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Last Backup</span>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => handleAction('save_settings')}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            {isProcessing ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
