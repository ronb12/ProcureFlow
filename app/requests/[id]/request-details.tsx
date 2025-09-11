'use client';

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
import {
  ArrowLeft,
  Edit,
  Download,
  Share,
  CheckCircle,
  XCircle,
  RotateCcw,
  Send,
  ShoppingCart,
  Receipt,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Mock data - in real app this would come from API
const mockRequest = {
  id: '1',
  vendor: 'Home Depot',
  justification: 'Office supplies and equipment for Q1 operations',
  needBy: new Date('2024-01-20'),
  accountingCode: '1234-5678-9012',
  status: 'AO Review' as const,
  createdAt: new Date('2024-01-15'),
  total: 1250.0,
  items: [
    {
      sku: 'HD-001',
      desc: 'Office Chairs (Set of 4)',
      qty: 4,
      estUnitPrice: 150.0,
    },
    {
      sku: 'HD-002',
      desc: 'Desk Lamps',
      qty: 2,
      estUnitPrice: 45.0,
    },
    {
      sku: 'HD-003',
      desc: 'Storage Bins',
      qty: 10,
      estUnitPrice: 12.0,
    },
    {
      sku: 'HD-004',
      desc: 'Whiteboard Markers',
      qty: 20,
      estUnitPrice: 2.0,
    },
    {
      sku: 'HD-005',
      desc: 'Printer Paper (Ream)',
      qty: 10,
      estUnitPrice: 4.0,
    },
  ],
  attachments: [
    {
      id: '1',
      name: 'quote.pdf',
      size: '245 KB',
      uploadedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'specifications.docx',
      size: '1.2 MB',
      uploadedAt: new Date('2024-01-15'),
    },
  ],
  approver: {
    id: 'approver-1',
    name: 'John Smith',
    email: 'john.smith@mwr.com',
    role: 'approver',
  },
  requester: {
    id: 'requester-1',
    name: 'Jane Doe',
    email: 'jane.doe@mwr.com',
    role: 'requester',
  },
  cardholder: {
    id: 'cardholder-1',
    name: 'Bob Johnson',
    email: 'bob.johnson@mwr.com',
    role: 'cardholder',
  },
  comments: [
    {
      id: '1',
      author: 'Jane Doe',
      content: 'These items are needed for the new office setup.',
      timestamp: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      author: 'John Smith',
      content: 'Please provide more details about the storage requirements.',
      timestamp: new Date('2024-01-16T14:20:00'),
    },
  ],
};

interface RequestDetailsProps {
  requestId: string;
}

export function RequestDetails({ requestId }: RequestDetailsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [request, setRequest] = useState<any>(mockRequest);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch the request by ID
    // For demo purposes, we'll use different statuses based on requestId
    const statuses = [
      'Draft',
      'Submitted',
      'AO Review',
      'Approved',
      'Cardholder Purchasing',
      'Purchased',
      'Reconciled',
      'Closed',
      'Returned',
      'Denied',
    ];
    const randomStatus = statuses[parseInt(requestId) % statuses.length] as any;

    setRequest({
      ...mockRequest,
      id: requestId,
      status: randomStatus,
    });
  }, [requestId]);

  const handleStatusTransition = async (newStatus: string, action: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setRequest((prev: any) => ({
        ...prev,
        status: newStatus as any,
      }));

      toast.success(`Request ${action} successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusActions = () => {
    if (!user) return [];

    const actions = [];

    // Draft actions
    if (
      request.status === 'Draft' &&
      ['requester', 'admin'].includes(user.role)
    ) {
      actions.push({
        label: 'Submit for Approval',
        icon: Send,
        variant: 'default' as const,
        onClick: () => handleStatusTransition('Submitted', 'submitted'),
      });
    }

    // Submitted actions
    if (
      request.status === 'Submitted' &&
      ['approver', 'admin'].includes(user.role)
    ) {
      actions.push({
        label: 'Move to Review',
        icon: CheckCircle,
        variant: 'default' as const,
        onClick: () => handleStatusTransition('AO Review', 'moved to review'),
      });
    }

    // AO Review actions
    if (
      request.status === 'AO Review' &&
      ['approver', 'admin'].includes(user.role)
    ) {
      actions.push(
        {
          label: 'Approve',
          icon: CheckCircle,
          variant: 'default' as const,
          onClick: () => handleStatusTransition('Approved', 'approved'),
        },
        {
          label: 'Deny',
          icon: XCircle,
          variant: 'destructive' as const,
          onClick: () => handleStatusTransition('Denied', 'denied'),
        },
        {
          label: 'Return for Revision',
          icon: RotateCcw,
          variant: 'outline' as const,
          onClick: () =>
            handleStatusTransition('Returned', 'returned for revision'),
        }
      );
    }

    // Approved actions
    if (
      request.status === 'Approved' &&
      ['cardholder', 'admin'].includes(user.role)
    ) {
      actions.push({
        label: 'Begin Purchasing',
        icon: ShoppingCart,
        variant: 'default' as const,
        onClick: () =>
          handleStatusTransition(
            'Cardholder Purchasing',
            'moved to purchasing'
          ),
      });
    }

    // Cardholder Purchasing actions
    if (
      request.status === 'Cardholder Purchasing' &&
      ['cardholder', 'admin'].includes(user.role)
    ) {
      actions.push({
        label: 'Mark as Purchased',
        icon: CheckCircle,
        variant: 'default' as const,
        onClick: () =>
          handleStatusTransition('Purchased', 'marked as purchased'),
      });
    }

    // Purchased actions
    if (
      request.status === 'Purchased' &&
      ['cardholder', 'admin'].includes(user.role)
    ) {
      actions.push({
        label: 'Reconcile Purchase',
        icon: Receipt,
        variant: 'default' as const,
        onClick: () => handleStatusTransition('Reconciled', 'reconciled'),
      });
    }

    // Reconciled actions
    if (
      request.status === 'Reconciled' &&
      ['cardholder', 'admin'].includes(user.role)
    ) {
      actions.push({
        label: 'Close Request',
        icon: CheckCircle,
        variant: 'default' as const,
        onClick: () => handleStatusTransition('Closed', 'closed'),
      });
    }

    // Returned actions
    if (
      request.status === 'Returned' &&
      ['requester', 'admin'].includes(user.role)
    ) {
      actions.push(
        {
          label: 'Edit Request',
          icon: Edit,
          variant: 'outline' as const,
          onClick: () => handleStatusTransition('Draft', 'returned to draft'),
        },
        {
          label: 'Resubmit',
          icon: Send,
          variant: 'default' as const,
          onClick: () => handleStatusTransition('Submitted', 'resubmitted'),
        }
      );
    }

    return actions;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view this request
          </h1>
          <Button onClick={() => router.push('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Request #{request.id}
              </h1>
              <p className="text-gray-600 mt-1">
                {request.vendor} • {formatDate(request.createdAt)}
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>
                  Basic information about this purchase request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Vendor
                    </label>
                    <p className="text-gray-900">{request.vendor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Need By
                    </label>
                    <p className="text-gray-900">
                      {formatDate(request.needBy)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Accounting Code
                    </label>
                    <p className="text-gray-900">{request.accountingCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Total Estimate
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {formatCurrency(request.total)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Justification
                  </label>
                  <p className="text-gray-900 mt-1">{request.justification}</p>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
                <CardDescription>
                  {request.items.length} item(s) in this request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.items.map((item: any, index: number) => (
                    <div
                      key={`${item.sku}-${index}`}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.desc}
                        </h4>
                        <p className="text-sm text-gray-500">
                          SKU: {item.sku} • Qty: {item.qty} • Unit Price:{' '}
                          {formatCurrency(item.estUnitPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.qty * item.estUnitPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(request.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {request.attachments && request.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>
                    {request.attachments.length} file(s) attached
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {request.attachments.map((attachment: any) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-medium">
                              {attachment.name.split('.').pop()?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {attachment.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {attachment.size} •{' '}
                              {formatDate(attachment.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            {request.comments && request.comments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    {request.comments.length} comment(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {request.comments.map((comment: any) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">
                            {comment.author
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">
                              {comment.author}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(comment.timestamp)}
                            </p>
                          </div>
                          <p className="text-gray-700 mt-1">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getStatusActions().map((action, index) => (
                  <Button
                    key={index}
                    className="w-full"
                    variant={action.variant}
                    onClick={action.onClick}
                    disabled={isProcessing}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
                <div className="border-t pt-3 mt-3">
                  <Button className="w-full" variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Share Request
                  </Button>
                  <Button className="w-full mt-2" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* People */}
            <Card>
              <CardHeader>
                <CardTitle>People</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Requester
                  </label>
                  <div className="mt-1">
                    <p className="font-medium text-gray-900">
                      {request.requester.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.requester.email}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Approver
                  </label>
                  <div className="mt-1">
                    <p className="font-medium text-gray-900">
                      {request.approver.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.approver.email}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Cardholder
                  </label>
                  <div className="mt-1">
                    <p className="font-medium text-gray-900">
                      {request.cardholder.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.cardholder.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
