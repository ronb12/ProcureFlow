'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { UserRole, User } from '@/lib/types';
import { AdminNav } from '@/components/ui/admin-nav';
import { AppHeader } from '@/components/ui/app-header';
import { UserModal } from '@/components/ui/user-modal';
import {
  Users,
  Plus,
  Eye,
  Edit,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Extended user type for display purposes
interface DisplayUser extends User {
  status: 'active' | 'inactive';
  lastLogin: Date | null;
}

// Mock data - in real app this would come from API
const mockUsers: DisplayUser[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@mwr.com',
    role: 'admin' as UserRole,
    status: 'active',
    lastLogin: new Date('2024-01-20'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
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
    updatedAt: new Date('2024-01-02'),
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
    updatedAt: new Date('2024-01-03'),
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
    updatedAt: new Date('2024-01-04'),
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
    updatedAt: new Date('2024-01-05'),
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
  const [users, setUsers] = useState<DisplayUser[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<DisplayUser | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [user] = useState({ role: 'admin' }); // Mock user for testing
  const [loading] = useState(false);

  // Handle Add User
  const handleAddUser = () => {
    console.log('Add User clicked');
    setSelectedUser(null);
    setShowUserModal(true);
  };

  // Handle Edit User
  const handleEditUser = (userId: string) => {
    console.log('Edit User clicked for ID:', userId);
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setShowUserModal(true);
    }
  };

  // Handle View User
  const handleViewUser = (user: DisplayUser) => {
    console.log('View User clicked for:', user.name);
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Handle Close Modal
  const handleCloseModal = () => {
    console.log('Closing modal');
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Handle Save User
  const handleSaveUser = async (userData: User) => {
    console.log('Saving user:', userData);
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (userData.id) {
        // Update existing user
        setUsers(prev =>
          prev.map(u =>
            u.id === userData.id
              ? { ...u, ...userData, updatedAt: new Date() }
              : u
          )
        );
        toast.success('User updated successfully');
      } else {
        // Add new user
        const newUser: DisplayUser = {
          ...userData,
          id: Date.now().toString(),
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: null,
        };
        setUsers(prev => [...prev, newUser]);
        toast.success('User created successfully');
      }

      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle User Actions
  const handleUserAction = async (
    userId: string,
    action: string,
    _data?: Record<string, unknown>
  ) => {
    console.log('User action:', action, 'for user:', userId);
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
    } catch (error) {
      console.error('Error processing user action:', error);
      toast.error('Failed to process user action');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user?.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get role color
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

  // Get status color
  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'text-green-600 bg-green-50'
      : 'text-red-600 bg-red-50';
  };

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
            You don&apos;t have permission to access user management.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
            <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
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
                            user?.role
                          )}`}
                        >
                          {user.role}
                        </span>
                        {(user.approvalLimit ?? 0) > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Limit: ${(user.approvalLimit ?? 0).toLocaleString()}
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
                            onClick={() => handleViewUser(user)}
                            className="hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user.id)}
                            className="hover:bg-green-50"
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
                            className="hover:bg-yellow-50"
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

        {/* User Modal */}
        {showUserModal && (
        <UserModal
          isOpen={showUserModal}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          user={selectedUser}
          isProcessing={isProcessing}
        />
        )}
      </div>
    </div>
  );
}
