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
import { ArrowLeft, Edit, Download, Share } from 'lucide-react';
import { useEffect, useState } from 'react';

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
      id: '1',
      sku: 'HD-001',
      desc: 'Office Chairs (Set of 4)',
      qty: 4,
      estUnitPrice: 150.0,
      lineTotal: 600.0,
    },
    {
      id: '2',
      sku: 'HD-002',
      desc: 'Desk Lamps',
      qty: 2,
      estUnitPrice: 45.0,
      lineTotal: 90.0,
    },
    {
      id: '3',
      sku: 'HD-003',
      desc: 'Storage Bins',
      qty: 10,
      estUnitPrice: 12.0,
      lineTotal: 120.0,
    },
    {
      id: '4',
      sku: 'HD-004',
      desc: 'Printer Paper (Case)',
      qty: 5,
      estUnitPrice: 88.0,
      lineTotal: 440.0,
    },
  ],
  attachments: [
    { name: 'Quote_HomeDepot.pdf', size: '2.3 MB' },
    { name: 'Specifications.docx', size: '1.1 MB' },
  ],
  approver: 'John Smith',
  submittedAt: new Date('2024-01-15'),
  lastUpdated: new Date('2024-01-16'),
};

export default function RequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [request, setRequest] = useState(mockRequest);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Request #{request.id}
              </h1>
              <p className="text-gray-600">{request.vendor}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <StatusBadge status={request.status} />
            <span className="text-sm text-gray-500">
              Created {formatDate(request.createdAt)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>
                  Basic information about this procurement request
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
                      Need By Date
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
                      Total Amount
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
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
                  Items included in this request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-gray-900">
                            {item.sku}
                          </span>
                          <span className="text-gray-600">{item.desc}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Qty: {item.qty} × {formatCurrency(item.estUnitPrice)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(item.lineTotal)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {request.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>
                    Supporting documents for this request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {request.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <Download className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{file.name}</span>
                          <span className="text-sm text-gray-500">
                            ({file.size})
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
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
                {request.status === 'Draft' && (
                  <Button className="w-full" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Request
                  </Button>
                )}
                <Button className="w-full" variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Share Request
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </CardContent>
            </Card>

            {/* Request Info */}
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Request ID
                  </label>
                  <p className="text-gray-900">#{request.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Submitted By
                  </label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Submitted Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(request.submittedAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-gray-900">
                    {formatDate(request.lastUpdated)}
                  </p>
                </div>
                {request.approver && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Approver
                    </label>
                    <p className="text-gray-900">{request.approver}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
