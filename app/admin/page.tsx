'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AdminNav } from '@/components/ui/admin-nav';
import { AppHeader } from '@/components/ui/app-header';
import { OrganizationModal } from '@/components/ui/organization-modal';
import { formatDate } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import {
  Users,
  Shield,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Eye,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Simple mock data
const mockUsers = [
  { id: '1', name: 'John Smith', email: 'john@mwr.com', role: 'admin' as UserRole, status: 'active', lastLogin: new Date('2024-01-20') },
  { id: '2', name: 'Jane Doe', email: 'jane@mwr.com', role: 'requester' as UserRole, status: 'active', lastLogin: new Date('2024-01-19') },
  { id: '3', name: 'Bob Johnson', email: 'bob@mwr.com', role: 'approver' as UserRole, status: 'inactive', lastLogin: new Date('2024-01-18') },
];

const mockOrgs = [
  { id: '1', name: 'Fort Jackson MWR', code: 'FJ-MWR', users: 45, status: 'active' },
  { id: '2', name: 'Camp Lejeune MWR', code: 'CL-MWR', users: 38, status: 'active' },
  { id: '3', name: 'Norfolk Naval MWR', code: 'NN-MWR', users: 52, status: 'inactive' },
];

const mockStats = {
  totalUsers: 135,
  activeUsers: 128,
  totalOrgs: 12,
  pendingApprovals: 23,
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [organizations, setOrganizations] = useState(mockOrgs);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have admin permissions.</p>
          <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Simple action handler
  const handleAction = (action: string, id?: string) => {
    toast.success(`${action} action completed`);
  };

  // Organization handlers
  const handleAddOrganization = () => {
    setSelectedOrg(null);
    setShowOrgModal(true);
  };

  const handleViewOrganization = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setSelectedOrg(org);
      setShowOrgModal(true);
    }
  };

  const handleEditOrganization = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setSelectedOrg(org);
      setShowOrgModal(true);
    }
  };

  const handleDeleteOrganization = (orgId: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      setOrganizations(prev => prev.filter(o => o.id !== orgId));
      toast.success('Organization deleted successfully');
    }
  };

  const handleCloseOrgModal = () => {
    setShowOrgModal(false);
    setSelectedOrg(null);
  };

  const handleSaveOrganization = async (orgData: any) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (orgData.id && organizations.find(o => o.id === orgData.id)) {
        // Update existing organization
        setOrganizations(prev =>
          prev.map(o =>
            o.id === orgData.id
              ? { ...orgData, updatedAt: new Date() }
              : o
          )
        );
        toast.success('Organization updated successfully');
      } else {
        // Add new organization
        const newOrg = {
          ...orgData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setOrganizations(prev => [...prev, newOrg]);
        toast.success('Organization created successfully');
      }

      setShowOrgModal(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error('Error saving organization:', error);
      toast.error('Failed to save organization');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simple tab content
  const renderOverview = () => (
          <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{mockStats.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{mockStats.activeUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Organizations</p>
                <p className="text-2xl font-bold">{mockStats.totalOrgs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{mockStats.pendingApprovals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

      {/* Quick Actions */}
            <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => router.push('/admin/users')} className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Manage Users
            </Button>
            <Button onClick={() => router.push('/admin/vendors')} variant="outline" className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              Manage Vendors
            </Button>
            <Button onClick={() => router.push('/admin/system-settings')} variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              System Settings
            </Button>
                </div>
              </CardContent>
            </Card>
          </div>
  );

  const renderUsers = () => (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Users</h3>
        <Button onClick={() => router.push('/admin/users')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
            <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
              <tbody className="divide-y divide-gray-200">
                {mockUsers.map((user) => (
                  <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.lastLogin)}
                          </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleAction('view', user.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAction('edit', user.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAction('delete', user.id)}>
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

  const renderOrganizations = () => (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Organizations</h3>
        <Button variant="outline" onClick={handleAddOrganization}>
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map((org) => (
                <Card key={org.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">{org.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                          {org.status}
                        </span>
                      </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600"><strong>Code:</strong> {org.code}</p>
                <p className="text-sm text-gray-600"><strong>Users:</strong> {org.users}</p>
                    </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleViewOrganization(org.id)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEditOrganization(org.id)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteOrganization(org.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
  );


  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage users, organizations, and system settings</p>
                  </div>

        {/* Simple Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'organizations', name: 'Organizations', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
                </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'organizations' && renderOrganizations()}
      </div>

      {/* Organization Modal */}
      <OrganizationModal
        isOpen={showOrgModal}
        onClose={handleCloseOrgModal}
        onSave={handleSaveOrganization}
        organization={selectedOrg}
        isProcessing={isProcessing}
      />
    </div>
  );
}
