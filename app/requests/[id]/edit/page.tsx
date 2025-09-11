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
import { ItemTable } from '@/components/ui/item-table';
import { MoneyInput } from '@/components/ui/money-input';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { CreateRequestData, RequestItem } from '@/lib/types';
import { ArrowLeft, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data - in real app this would come from API
const mockRequest = {
  id: '1',
  vendor: 'Home Depot',
  justification: 'Office supplies and equipment for Q1 operations',
  needBy: new Date('2024-01-20'),
  accountingCode: '1234-5678-9012',
  status: 'Draft' as const,
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
  ],
  attachments: [
    {
      id: '1',
      name: 'quote.pdf',
      size: '245 KB',
      uploadedAt: new Date('2024-01-15'),
    },
  ],
};

export default function EditRequestPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Form state
  const [formData, setFormData] = useState<
    Partial<CreateRequestData> & { totalEstimate?: number }
  >({
    vendor: '',
    justification: '',
    needBy: new Date(),
    accountingCode: '',
    items: [] as RequestItem[],
    totalEstimate: 0,
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load request data
  useEffect(() => {
    if (mockRequest) {
      setFormData({
        vendor: mockRequest.vendor,
        justification: mockRequest.justification,
        needBy: mockRequest.needBy,
        accountingCode: mockRequest.accountingCode,
        items: mockRequest.items.map((item, index) => ({
          ...item,
          id: item.id,
          lineTotal: item.qty * item.estUnitPrice,
        })),
        totalEstimate: mockRequest.total,
      });
    }
  }, []);

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

  // Check if user can edit this request
  if (!['requester', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to edit this request.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    field: keyof CreateRequestData,
    value: string | Date | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemsChange = (items: RequestItem[]) => {
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
    setFormData(prev => ({
      ...prev,
      items,
      totalEstimate: total,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isDraft) {
        toast.success('Request saved as draft');
      } else {
        toast.success('Request updated successfully');
      }

      router.push(`/requests/${mockRequest.id}`);
    } catch (error) {
      toast.error('Failed to update request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Request #{mockRequest.id}
          </h1>
          <p className="mt-2 text-gray-600">
            Update the details of this procurement request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update the basic details of your request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor *
                  </label>
                  <input
                    type="text"
                    value={formData.vendor || ''}
                    onChange={e => handleInputChange('vendor', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Need By Date *
                  </label>
                  <input
                    type="date"
                    value={
                      formData.needBy
                        ? formData.needBy.toISOString().split('T')[0]
                        : ''
                    }
                    onChange={e =>
                      handleInputChange('needBy', new Date(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accounting Code *
                </label>
                <input
                  type="text"
                  value={formData.accountingCode || ''}
                  onChange={e =>
                    handleInputChange('accountingCode', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1234-5678-9012"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justification *
                </label>
                <textarea
                  value={formData.justification || ''}
                  onChange={e =>
                    handleInputChange('justification', e.target.value)
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain why this purchase is necessary..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>
                Add or modify the items for this request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItemTable
                items={(formData.items || []) as RequestItem[]}
                onChange={handleItemsChange}
              />
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>
                Upload supporting documents (quotes, specifications, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileDropzone
                onFilesAccepted={setAttachments}
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    ['.docx'],
                  'image/*': ['.jpg', '.jpeg', '.png'],
                }}
                maxSize={10 * 1024 * 1024} // 10MB
                maxFiles={10}
              />
              {attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Files:
                  </h4>
                  <ul className="text-sm text-gray-600">
                    {attachments.map((file, index) => (
                      <li key={index}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total Estimate
                </span>
                <MoneyInput
                  value={formData.totalEstimate || 0}
                  onChange={value =>
                    setFormData(prev => ({ ...prev, totalEstimate: value }))
                  }
                  className="text-lg font-bold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDraft(true);
                handleSubmit(new Event('submit') as any);
              }}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Updating...' : 'Update Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
