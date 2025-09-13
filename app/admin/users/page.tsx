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
import { formatDate } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import { AdminNav } from '@/components/ui/admin-nav';
import { AppHeader } from '@/components/ui/app-header';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data - in real app this would come from API
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@mwr.com',
    role: 'admin' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-20'),
    createdAt: new Date('2024-01-01'),
    orgId: 'org_cdc',
    approvalLimit: 100000,
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@mwr.com',
    role: 'requester' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-19'),
    createdAt: new Date('2024-01-02'),
    orgId: 'org_cdc',
    approvalLimit: 0,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@mwr.com',
    role: 'cardholder' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-18'),
    createdAt: new Date('2024-01-03'),
    orgId: 'org_cdc',
    approvalLimit: 0,
  },
  {
    id: '4',
    name: 'Alice Johnson',
    email: 'alice.johnson@mwr.com',
    role: 'approver' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-17'),
    createdAt: new Date('2024-01-04'),
    orgId: 'org_cdc',
    approvalLimit: 10000,
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@mwr.com',
    role: 'auditor' as UserRole,
    status: 'inactive',
    lastLogin: new Date('2024-01-10'),
    createdAt: new Date('2024-01-05'),
    orgId: 'org_cdc',
    approvalLimit: 0,
  },
];

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'requester',
    label: 'Requester',
    description: 'Can create and manage requests',
  },
  {
    value: 'approver',
    label: 'Approver',
    description: 'Can approve/deny requests',
  },
  {
    value: 'cardholder',
    label: 'Cardholder',
    description: 'Can purchase and reconcile',
  },
  {
    value: 'auditor',
    label: 'Auditor',
    description: 'Can view audit logs',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full system access',
  },
];

export default function UserManagementPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

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
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access user management.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUserAction = async (
    userId: string,
    action: string,
    data?: any
  ) => {
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
      } else if (action === 'update_role') {
        setUsers(prev =>
          prev.map(u =>
            u.id === userId
              ? { ...u, role: data.role, approvalLimit: data.approvalLimit }
              : u
          )
        );
        toast.success('User role updated');
      } else if (action === 'delete') {
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast.success('User deleted');
      } else if (action === 'add') {
        const newUser = {
          id: Date.now().toString(),
          ...data,
          status: 'active',
          createdAt: new Date(),
          lastLogin: null,
        };
        setUsers(prev => [...prev, newUser]);
        toast.success('User added successfully');
        setShowAddUser(false);
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
      <AppHeader />
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="mt-2 text-gray-600">
                Create and manage user roles and permissions.
              </p>
            </div>
            <Button onClick={() => setShowAddUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.status === 'inactive').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
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
                  {filteredUsers.map(user => (
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
                        {user.approvalLimit > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Limit: ${user.approvalLimit.toLocaleString()}
                          </div>
                        )}
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
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
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
                              setSelectedUser({ ...user, editing: true })
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUserAction(user.id, 'toggle_status')
                            }
                            disabled={isProcessing}
                          >
                            {user.status === 'active' ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
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

        {/* User Detail/Edit Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>
                  {selectedUser.editing ? 'Edit User' : 'User Details'} -{' '}
                  {selectedUser.name}
                </CardTitle>
                <CardDescription>
                  {selectedUser.editing
                    ? 'Update user role and permissions'
                    : 'Complete user information and management options'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedUser.editing ? (
                  <UserEditForm
                    user={selectedUser}
                    onSave={(data: any) =>
                      handleUserAction(selectedUser.id, 'update_role', data)
                    }
                    onCancel={() => setSelectedUser(null)}
                    isProcessing={isProcessing}
                  />
                ) : (
                  <UserDetailsView
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>
                  Create a new user account with role assignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserEditForm
                  user={null}
                  onSave={(data: any) => handleUserAction('', 'add', data)}
                  onCancel={() => setShowAddUser(false)}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// User Edit Form Component
function UserEditForm({ user, onSave, onCancel, isProcessing }: any) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'requester',
    orgId: user?.orgId || 'org_cdc',
    approvalLimit: user?.approvalLimit || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role *
        </label>
        <select
          value={formData.role}
          onChange={e =>
            setFormData({ ...formData, role: e.target.value as UserRole })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {roleOptions.map(role => (
            <option key={role.value} value={role.value}>
              {role.label} - {role.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Organization ID
        </label>
        <input
          type="text"
          value={formData.orgId}
          onChange={e => setFormData({ ...formData, orgId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {formData.role === 'approver' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Approval Limit ($)
          </label>
          <input
            type="number"
            value={formData.approvalLimit}
            onChange={e =>
              setFormData({
                ...formData,
                approvalLimit: Number(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      )}

      <div className="flex space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Saving...' : user ? 'Update User' : 'Add User'}
        </Button>
      </div>
    </form>
  );
}

// User Details View Component
function UserDetailsView({ user, onClose }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Name</label>
          <p className="text-gray-900">{user.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Role</label>
          <p className="text-gray-900">{user.role}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <p className="text-gray-900">{user.status}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Organization
          </label>
          <p className="text-gray-900">{user.orgId}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Approval Limit
          </label>
          <p className="text-gray-900">
            ${user.approvalLimit.toLocaleString()}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Last Login
          </label>
          <p className="text-gray-900">
            {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Created</label>
          <p className="text-gray-900">{formatDate(user.createdAt)}</p>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
        <Button onClick={onClose} className="flex-1">
          Close
        </Button>
      </div>
    </div>
  );
}
