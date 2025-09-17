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

// Define proper types for request data
interface RequestItem {
  id: string;
  sku: string;
  desc: string;
  qty: number;
  estUnitPrice: number;
  lineTotal: number;
}

interface Person {
  name: string;
  email: string;
  phone?: string;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  uploadedAt: Date;
  url?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

interface RequestData {
  id: string;
  vendor: string;
  justification: string;
  needBy: Date;
  accountingCode: string;
  status: string;
  createdAt: Date;
  total: number;
  items: RequestItem[];
  requester: Person;
  approver: Person;
  cardholder: Person;
  attachments: Attachment[];
  comments: Comment[];
}

// Mock data - in real app this would come from API
const mockRequest = {
  id: '1',
  vendor: 'Grainger Industrial Supply',
  justification:
    'Safety equipment and tools for MWR maintenance department to ensure OSHA compliance and operational readiness',
  needBy: new Date('2024-01-30'),
  accountingCode: '1234-5678-9012',
  status: 'AO Review' as const,
  createdAt: new Date('2024-01-16'),
  total: 3425.5,
  items: [
    {
      id: 'item-15',
      sku: 'GRA-001',
      desc: 'Safety Hard Hats - ANSI Z89.1 Type I Class C',
      qty: 12,
      estUnitPrice: 25.5,
      lineTotal: 306.0,
    },
    {
      id: 'item-16',
      sku: 'GRA-002',
      desc: 'Safety Glasses - Clear Lens, Anti-Fog',
      qty: 24,
      estUnitPrice: 8.75,
      lineTotal: 210.0,
    },
    {
      id: 'item-17',
      sku: 'GRA-003',
      desc: 'Work Gloves - Cut Resistant, Size Large',
      qty: 20,
      estUnitPrice: 12.0,
      lineTotal: 240.0,
    },
    {
      id: 'item-18',
      sku: 'GRA-004',
      desc: 'Steel Toe Boots - Composite Toe, Size 10',
      qty: 8,
      estUnitPrice: 85.0,
      lineTotal: 680.0,
    },
    {
      id: 'item-19',
      sku: 'GRA-005',
      desc: 'Tool Set - 150 Piece Mechanics Set',
      qty: 2,
      estUnitPrice: 450.0,
      lineTotal: 900.0,
    },
    {
      id: 'item-20',
      sku: 'GRA-006',
      desc: 'Cordless Drill - 20V Lithium Ion',
      qty: 4,
      estUnitPrice: 125.0,
      lineTotal: 500.0,
    },
    {
      id: 'item-21',
      sku: 'GRA-007',
      desc: 'Extension Cords - 25ft, 12 AWG, Yellow',
      qty: 6,
      estUnitPrice: 35.0,
      lineTotal: 210.0,
    },
    {
      id: 'item-22',
      sku: 'GRA-008',
      desc: 'First Aid Kit - Industrial, 50 Person',
      qty: 2,
      estUnitPrice: 89.5,
      lineTotal: 179.0,
    },
    {
      id: 'item-23',
      sku: 'GRA-009',
      desc: 'Fire Extinguisher - ABC Dry Chemical, 5lb',
      qty: 4,
      estUnitPrice: 45.0,
      lineTotal: 180.0,
    },
    {
      id: 'item-24',
      sku: 'GRA-010',
      desc: 'Ladder - 6ft Step Ladder, Fiberglass',
      qty: 2,
      estUnitPrice: 120.0,
      lineTotal: 240.0,
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
  const [request, setRequest] = useState<RequestData>(mockRequest as RequestData);
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
    const randomStatus = statuses[parseInt(requestId) % statuses.length] as 'Pending' | 'Approved' | 'Rejected' | 'Denied';

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

      setRequest((prev) => ({
        ...prev,
        status: newStatus as 'pending' | 'approved' | 'rejected' | 'cancelled',
      }));

      toast.success(`Request ${action} successfully`);
    } catch {
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
      user?.role && ['requester', 'admin'].includes(user.role)
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
      user?.role && ['approver', 'admin'].includes(user.role)
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
      user?.role && ['approver', 'admin'].includes(user.role)
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
      user?.role && ['cardholder', 'admin'].includes(user.role)
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
      user?.role && ['cardholder', 'admin'].includes(user.role)
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
      user?.role && ['cardholder', 'admin'].includes(user.role)
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
      user?.role && ['cardholder', 'admin'].includes(user.role)
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
      user?.role && ['requester', 'admin'].includes(user.role)
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
            <StatusBadge status={request.status as any} />
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

            {/* Items - Federal Government Line Item Detail */}
            <Card>
              <CardHeader>
                <CardTitle>Line Item Detail</CardTitle>
                <CardDescription>
                  {request.items.length} item(s) in this request - Federal
                  Government requires detailed itemization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Line #
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          SKU/Part #
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Description
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">
                          Qty
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">
                          Unit Price
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">
                          Line Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.items.map((item, index: number) => (
                        <tr
                          key={item.id || `${item.sku}-${index}`}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-600 font-medium">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4 text-gray-900 font-mono text-sm">
                            {item.sku}
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            {item.desc}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900">
                            {item.qty}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900">
                            {formatCurrency(item.estUnitPrice)}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                            {formatCurrency(
                              item.lineTotal || item.qty * item.estUnitPrice
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 bg-gray-100">
                        <td
                          colSpan={5}
                          className="py-3 px-4 text-right font-semibold text-gray-900"
                        >
                          Subtotal:
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          {formatCurrency(
                            request.items.reduce(
                              (sum: number, item) =>
                                sum +
                                (item.lineTotal ||
                                  item.qty * item.estUnitPrice),
                              0
                            )
                          )}
                        </td>
                      </tr>
                      <tr className="border-b bg-gray-100">
                        <td
                          colSpan={5}
                          className="py-3 px-4 text-right font-semibold text-gray-900"
                        >
                          Tax (8%):
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          {formatCurrency(
                            request.items.reduce(
                              (sum: number, item) =>
                                sum +
                                (item.lineTotal ||
                                  item.qty * item.estUnitPrice),
                              0
                            ) * 0.08
                          )}
                        </td>
                      </tr>
                      <tr className="border-b bg-gray-100">
                        <td
                          colSpan={5}
                          className="py-3 px-4 text-right font-semibold text-gray-900"
                        >
                          Shipping:
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          {formatCurrency(0)}
                        </td>
                      </tr>
                      <tr className="bg-blue-50 border-t-2 border-blue-300">
                        <td
                          colSpan={5}
                          className="py-3 px-4 text-right font-bold text-blue-900 text-lg"
                        >
                          TOTAL:
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-blue-900 text-lg">
                          {formatCurrency(request.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Federal Compliance Notice */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Federal Government Compliance
                      </h3>
                      <div className="mt-1 text-sm text-yellow-700">
                        <p>
                          This request includes detailed line item breakdown as
                          required by federal procurement regulations. Each item
                          is individually specified with SKU, description,
                          quantity, and unit pricing for audit compliance.
                        </p>
                      </div>
                    </div>
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
                    {request.attachments.map((attachment) => (
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
                    {request.comments.map((comment) => (
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
