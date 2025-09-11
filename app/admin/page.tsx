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
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import {
  Settings,
  Users,
  Shield,
  BarChart3,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock admin data
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@mwr.com',
    role: 'admin' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-20'),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@mwr.com',
    role: 'requester' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-19'),
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@mwr.com',
    role: 'cardholder' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-18'),
    createdAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'Alice Johnson',
    email: 'alice.johnson@mwr.com',
    role: 'approver' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-17'),
    createdAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@mwr.com',
    role: 'auditor' as UserRole,
    status: 'inactive',
    lastLogin: new Date('2024-01-10'),
    createdAt: new Date('2024-01-05'),
  },
];

const mockSystemStats = {
  totalUsers: 5,
  activeUsers: 4,
  totalRequests: 24,
  pendingApprovals: 3,
  totalValue: 15600.0,
  avgProcessingTime: 2.5,
};

const mockOrganizations = [
  {
    id: '1',
    name: 'MWR Headquarters',
    code: 'MWR-HQ',
    status: 'active',
    userCount: 2,
    requestCount: 12,
  },
  {
    id: '2',
    name: 'Base Operations',
    code: 'BASE-OPS',
    status: 'active',
    userCount: 2,
    requestCount: 8,
  },
  {
    id: '3',
    name: 'Support Services',
    code: 'SUPPORT',
    status: 'active',
    userCount: 1,
    requestCount: 4,
  },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState(mockUsers);
  const [organizations, setOrganizations] = useState(mockOrganizations);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check if user has admin permissions
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin page.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleUserAction = async (userId: string, action: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (action === 'toggle_status') {
        setUsers(prev =>
          prev.map(u =>
            u.id === userId
              ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
              : u
          )
        );
        toast.success('User status updated');
      } else if (action === 'delete') {
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast.success('User deleted');
      }

      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to process user action');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-50';
      case 'approver':
        return 'text-blue-600 bg-blue-50';
      case 'cardholder':
        return 'text-green-600 bg-green-50';
      case 'auditor':
        return 'text-purple-600 bg-purple-50';
      case 'requester':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'text-green-600 bg-green-50'
      : 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage users, organizations, and system settings.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'users', name: 'Users', icon: Users },
                { id: 'organizations', name: 'Organizations', icon: Settings },
                { id: 'settings', name: 'System Settings', icon: Shield },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockSystemStats.totalUsers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Active Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockSystemStats.activeUsers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Total Requests
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockSystemStats.totalRequests}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Pending Approvals
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockSystemStats.pendingApprovals}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest system events and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        New user registered: Alice Johnson
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        Request #3 approved by John Smith
                      </p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        System maintenance completed
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                User Management
              </h2>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/users')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                user.status
                              )}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.lastLogin)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUserAction(user.id, 'toggle_status')
                                }
                                disabled={isProcessing}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUserAction(user.id, 'delete')
                                }
                                disabled={isProcessing}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Organizations
              </h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map(org => (
                <Card key={org.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription>Code: {org.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            org.status
                          )}`}
                        >
                          {org.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Users:</span>
                        <span>{org.userCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Requests:</span>
                        <span>{org.requestCount}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              System Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic system configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      System Name
                    </label>
                    <input
                      type="text"
                      defaultValue="ProcureFlow"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max File Upload Size (MB)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Timeout (Days)
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Authentication and security configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Require 2FA
                      </p>
                      <p className="text-xs text-gray-500">
                        Force two-factor authentication for all users
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Session Timeout
                      </p>
                      <p className="text-xs text-gray-500">
                        Auto-logout after inactivity
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Audit Logging
                      </p>
                      <p className="text-xs text-gray-500">
                        Log all user actions
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>User Details - {selectedUser.name}</CardTitle>
                <CardDescription>
                  Complete user information and management options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Role
                    </label>
                    <p className="text-gray-900">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <p className="text-gray-900">{selectedUser.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Login
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedUser.lastLogin)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => setSelectedUser(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
