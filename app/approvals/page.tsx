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
import { RequestStatus } from '@/lib/types';
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Clock,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for pending approvals
const mockPendingRequests = [
  {
    id: '1',
    vendor: 'Home Depot',
    justification: 'Office supplies and equipment for Q1 operations',
    needBy: new Date('2024-01-20'),
    accountingCode: '1234-5678-9012',
    status: 'AO Review' as RequestStatus,
    createdAt: new Date('2024-01-15'),
    total: 1250.0,
    requester: {
      name: 'Jane Doe',
      email: 'jane.doe@mwr.com',
    },
    priority: 'high',
    daysPending: 3,
  },
  {
    id: '2',
    vendor: 'Office Depot',
    justification: 'Computer accessories and peripherals',
    needBy: new Date('2024-01-25'),
    accountingCode: '1234-5678-9013',
    status: 'AO Review' as RequestStatus,
    createdAt: new Date('2024-01-16'),
    total: 850.0,
    requester: {
      name: 'Bob Smith',
      email: 'bob.smith@mwr.com',
    },
    priority: 'medium',
    daysPending: 2,
  },
  {
    id: '3',
    vendor: 'Amazon Business',
    justification: 'Software licenses for development team',
    needBy: new Date('2024-02-01'),
    accountingCode: '1234-5678-9014',
    status: 'Submitted' as RequestStatus,
    createdAt: new Date('2024-01-17'),
    total: 2400.0,
    requester: {
      name: 'Alice Johnson',
      email: 'alice.johnson@mwr.com',
    },
    priority: 'low',
    daysPending: 1,
  },
];

export default function ApprovalsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [requests, setRequests] = useState(mockPendingRequests);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
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

  // Check if user has approval permissions
  if (!['approver', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the approvals page.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleApprovalAction = async (
    requestId: string,
    action: 'approve' | 'deny' | 'return',
    comments?: string
  ) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update request status
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? {
                ...req,
                status:
                  action === 'approve'
                    ? 'Approved'
                    : action === 'deny'
                      ? 'Denied'
                      : 'Returned',
              }
            : req
        )
      );

      toast.success(
        `Request ${
          action === 'approve'
            ? 'approved'
            : action === 'deny'
              ? 'denied'
              : 'returned'
        } successfully`
      );

      setSelectedRequest(null);
    } catch (error) {
      toast.error('Failed to process approval');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const pendingRequests = requests.filter(
    req => req.status === 'AO Review' || req.status === 'Submitted'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
          <p className="mt-2 text-gray-600">
            Review and approve pending procurement requests.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Pending Review
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingRequests.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    High Priority
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      pendingRequests.filter(req => req.priority === 'high')
                        .length
                    }
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
                    Processed Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  All caught up!
                </h3>
                <p className="text-gray-500">
                  There are no pending requests requiring your approval.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map(request => (
              <Card
                key={request.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Request #{request.id}
                        </h3>
                        <StatusBadge status={request.status} />
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            request.priority
                          )}`}
                        >
                          {request.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Vendor:</span>{' '}
                          {request.vendor}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>{' '}
                          {formatCurrency(request.total)}
                        </div>
                        <div>
                          <span className="font-medium">Need By:</span>{' '}
                          {formatDate(request.needBy)}
                        </div>
                        <div>
                          <span className="font-medium">Requester:</span>{' '}
                          {request.requester.name}
                        </div>
                        <div>
                          <span className="font-medium">Days Pending:</span>{' '}
                          {request.daysPending}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>{' '}
                          {formatDate(request.createdAt)}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">
                        {request.justification}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Approval Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Review Request #{selectedRequest.id}</CardTitle>
                <CardDescription>
                  Make your approval decision for this procurement request.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Vendor
                    </label>
                    <p className="text-gray-900">{selectedRequest.vendor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Total Amount
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {formatCurrency(selectedRequest.total)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Need By
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedRequest.needBy)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Requester
                    </label>
                    <p className="text-gray-900">
                      {selectedRequest.requester.name}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Justification
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedRequest.justification}
                  </p>
                </div>
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    onClick={() =>
                      handleApprovalAction(selectedRequest.id, 'approve')
                    }
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleApprovalAction(selectedRequest.id, 'return')
                    }
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Return
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleApprovalAction(selectedRequest.id, 'deny')
                    }
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Deny
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
