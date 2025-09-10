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
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data - in real app this would come from API
const mockRequests = [
  {
    id: '1',
    vendor: 'Home Depot',
    total: 1250.0,
    status: 'AO Review' as const,
    createdAt: new Date('2024-01-15'),
    needBy: new Date('2024-01-20'),
    justification: 'Office supplies for MWR facility',
  },
  {
    id: '2',
    vendor: 'Office Depot',
    total: 450.0,
    status: 'Purchased' as const,
    createdAt: new Date('2024-01-14'),
    needBy: new Date('2024-01-18'),
    justification: 'Computer equipment for new workstations',
  },
  {
    id: '3',
    vendor: "Lowe's",
    total: 2100.0,
    status: 'Draft' as const,
    createdAt: new Date('2024-01-13'),
    needBy: new Date('2024-01-25'),
    justification: 'Maintenance supplies for facility repairs',
  },
  {
    id: '4',
    vendor: 'Amazon Business',
    total: 850.0,
    status: 'Approved' as const,
    createdAt: new Date('2024-01-12'),
    needBy: new Date('2024-01-22'),
    justification: 'Software licenses for productivity tools',
  },
  {
    id: '5',
    vendor: 'Staples',
    total: 320.0,
    status: 'Reconciled' as const,
    createdAt: new Date('2024-01-10'),
    needBy: new Date('2024-01-15'),
    justification: 'Office furniture for conference room',
  },
];

export default function RequestsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [requests, setRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.justification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = requests.reduce(
    (acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
                <p className="mt-2 text-gray-600">
                  Manage your procurement requests
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/requests/new')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft ({statusCounts.Draft || 0})</option>
                <option value="Submitted">
                  Submitted ({statusCounts.Submitted || 0})
                </option>
                <option value="AO Review">
                  AO Review ({statusCounts['AO Review'] || 0})
                </option>
                <option value="Approved">
                  Approved ({statusCounts.Approved || 0})
                </option>
                <option value="Purchased">
                  Purchased ({statusCounts.Purchased || 0})
                </option>
                <option value="Reconciled">
                  Reconciled ({statusCounts.Reconciled || 0})
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">No requests found</p>
                <p className="text-gray-400 mt-2">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first request to get started'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map(request => (
              <Card
                key={request.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.vendor}
                        </h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-gray-600 mb-2">
                        {request.justification}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>Created: {formatDate(request.createdAt)}</span>
                        <span>Need by: {formatDate(request.needBy)}</span>
                        <span className="font-medium text-gray-900">
                          Total: {formatCurrency(request.total)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/requests/${request.id}`)}
                      >
                        View Details
                      </Button>
                      {request.status === 'Draft' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            // TODO: Navigate to edit request
                            toast('Edit request coming soon');
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
