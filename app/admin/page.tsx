'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { AppHeader } from '@/components/ui/app-header';
import { formatDate } from '@/lib/utils';
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
    role: 'approver' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-18'),
    createdAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@mwr.com',
    role: 'cardholder' as UserRole,
    status: 'inactive',
    lastLogin: new Date('2024-01-15'),
    createdAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@mwr.com',
    role: 'auditor' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-17'),
    createdAt: new Date('2024-01-05'),
  },
];

const mockOrganizations = [
  {
    id: 'org_1',
    name: 'Fort Jackson MWR',
    code: 'FJ-MWR',
    location: 'Columbia, SC',
    userCount: 45,
    status: 'active',
  },
  {
    id: 'org_2',
    name: 'Camp Lejeune MWR',
    code: 'CL-MWR',
    location: 'Jacksonville, NC',
    userCount: 38,
    status: 'active',
  },
  {
    id: 'org_3',
    name: 'Norfolk Naval Station MWR',
    code: 'NN-MWR',
    location: 'Norfolk, VA',
    userCount: 52,
    status: 'active',
  },
];

const mockStats = {
  totalUsers: 135,
  activeUsers: 128,
  totalOrganizations: 12,
  pendingApprovals: 23,
  totalRequests: 456,
  completedRequests: 398,
  totalPurchases: 234,
  reconciledPurchases: 198,
  auditPackages: 45,
  resolvedAudits: 38,
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users] = useState(mockUsers);
  const [organizations] = useState(mockOrganizations);

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

  // Check if user has admin role
  const actualRole = user.role;
  if (!actualRole || !['admin'].includes(actualRole)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access the admin page.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleUserAction = async (
    action: string,
    _userId: string,
    _data?: Record<string, unknown>
  ) => {
    // Suppress unused parameter warnings
    void _userId;
    void _data;
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (action === 'toggle_status') {
        toast.success('User status updated');
      } else if (action === 'delete') {
        toast.success('User deleted');
      }

    return;
  };

  const renderOverviewTab = () => (
          <div className="space-y-6">
      {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
                    <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
                    <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.activeUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
                    <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Organizations</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalOrganizations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
                    <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.pendingApprovals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">New user registered: Jane Doe</span>
                    </div>
              <span className="text-xs text-gray-500">{formatDate(new Date())}</span>
                  </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Purchase request approved</span>
                    </div>
              <span className="text-xs text-gray-500">{formatDate(new Date())}</span>
                  </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Audit package created</span>
                    </div>
              <span className="text-xs text-gray-500">{formatDate(new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
  );

  const renderUsersTab = () => (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
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
                {users.map((user) => (
                  <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                              </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
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
                          onClick={() => handleUserAction('view', user.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                          onClick={() => handleUserAction('edit', user.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                          onClick={() => handleUserAction('delete', user.id)}
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
  );

  const renderOrganizationsTab = () => (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Organization Management</h3>
        <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
                <Card key={org.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{org.name}</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  org.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                          {org.status}
                        </span>
                      </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Code:</strong> {org.code}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {org.location}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Users:</strong> {org.userCount}
                </p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
  );

  const renderSettingsTab = () => (
          <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>

              <Card>
        <CardContent className="p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">General Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                  <div>
                <p className="text-sm font-medium text-gray-900">System Maintenance Mode</p>
                <p className="text-sm text-gray-500">Enable maintenance mode to restrict access</p>
              </div>
              <Button variant="outline" size="sm">
                Toggle
              </Button>
                  </div>
            <div className="flex items-center justify-between">
                  <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Send email notifications for system events</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
                  </div>
            <div className="flex items-center justify-between">
                  <div>
                <p className="text-sm font-medium text-gray-900">Audit Logging</p>
                <p className="text-sm text-gray-500">Enable detailed audit logging</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
        <CardContent className="p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Data Management</h4>
          <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                <p className="text-sm font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-500">Export all system data to CSV</p>
                    </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                <p className="text-sm font-medium text-gray-900">Import Data</p>
                <p className="text-sm text-gray-500">Import data from CSV file</p>
                    </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                <p className="text-sm font-medium text-gray-900">Backup Database</p>
                <p className="text-sm text-gray-500">Create a backup of the database</p>
                    </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage users, organizations, and system settings
                    </p>
                  </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'organizations', name: 'Organizations', icon: Shield },
              { id: 'settings', name: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
                </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'organizations' && renderOrganizationsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
}