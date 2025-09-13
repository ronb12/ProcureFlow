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
import { notificationService } from '@/lib/notification-service';
import { ArrowLeft, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewRequestPage() {
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

  const handleInputChange = (field: keyof CreateRequestData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemsChange = (items: RequestItem[]) => {
    const totalEstimate = items.reduce((sum, item) => sum + item.lineTotal, 0);
    setFormData(prev => ({
      ...prev,
      items,
      totalEstimate,
    }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft) {
      // Validate required fields
      if (!formData.vendor?.trim()) {
        toast.error('Vendor is required');
        return;
      }
      if (!formData.justification?.trim()) {
        toast.error('Justification is required');
        return;
      }
      if (!formData.accountingCode?.trim()) {
        toast.error('Accounting code is required');
        return;
      }
      if (!formData.items || formData.items.length === 0) {
        toast.error('At least one item is required');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual API call to create request
      console.log('Creating request:', { ...formData, isDraft });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a mock request ID for notifications
      const requestId = `req_${Date.now()}`;

      if (!isDraft && user) {
        // Send notification for request creation
        await notificationService.notifyRequestCreated(
          user.id,
          requestId,
          formData.vendor || 'Unknown Vendor',
          formData.totalEstimate || 0
        );

        // Check if approval is needed and notify approvers
        if (
          formData.totalEstimate &&
          formData.totalEstimate > (user.approvalLimit || 0)
        ) {
          // In a real app, this would query for approvers
          console.log('Request exceeds approval limit, would notify approvers');
        }
      }

      toast.success(
        isDraft ? 'Request saved as draft' : 'Request submitted successfully'
      );
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">New Request</h1>
          <p className="mt-2 text-gray-600">
            Create a new procurement request for MWR facilities.
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
              <CardDescription>
                Provide basic details about your procurement request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor *
                  </label>
                  <input
                    type="text"
                    value={formData.vendor || ''}
                    onChange={e => handleInputChange('vendor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter vendor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accounting Code *
                </label>
                <input
                  type="text"
                  value={formData.accountingCode || ''}
                  onChange={e =>
                    handleInputChange('accountingCode', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter accounting code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justification *
                </label>
                <textarea
                  value={formData.justification || ''}
                  onChange={e =>
                    handleInputChange('justification', e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain why this purchase is needed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>
                Add the items you need to purchase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItemTable
                items={(formData.items as RequestItem[]) || []}
                onChange={handleItemsChange}
              />
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>
                Upload supporting documents (quotes, specifications, etc.).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileDropzone
                files={attachments}
                onFilesAccepted={setAttachments}
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    ['.docx'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png'],
                }}
                maxFiles={5}
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </CardContent>
          </Card>

          {/* Total Estimate */}
          {formData.totalEstimate && formData.totalEstimate > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Estimate:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${formData.totalEstimate.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save as Draft</span>
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
