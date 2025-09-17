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
// import { MoneyInput } from '@/components/ui/money-input';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { CreateRequestData, RequestItem } from '@/lib/types';
import { notificationService } from '@/lib/notification-service';
import { ArrowLeft, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface Facility {
  id: string;
  name: string;
  code: string;
  installation: string;
  installationCode: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  director: string;
  capacity: number;
  ageGroups: string[];
  status: 'active' | 'inactive';
}

// Mock facilities data for DOD MWR child care centers grouped by installation
const mockFacilities: Facility[] = [
  // Fort Jackson, SC - Multiple Child Care Centers
  {
    id: '1',
    name: 'Fort Jackson CDC #1 - Main',
    code: 'FJ-CDC-001',
    installation: 'Fort Jackson',
    installationCode: 'FJ',
    address: '1234 Child Care Drive',
    city: 'Columbia',
    state: 'SC',
    zip: '29207',
    phone: '(803) 555-0101',
    director: 'Sarah Johnson',
    capacity: 120,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Fort Jackson CDC #2 - East',
    code: 'FJ-CDC-002',
    installation: 'Fort Jackson',
    installationCode: 'FJ',
    address: '5678 East Child Care Blvd',
    city: 'Columbia',
    state: 'SC',
    zip: '29207',
    phone: '(803) 555-0102',
    director: 'Michael Rodriguez',
    capacity: 95,
    ageGroups: ['Infant', 'Toddler', 'Preschool'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Fort Jackson CDC #3 - West',
    code: 'FJ-CDC-003',
    installation: 'Fort Jackson',
    installationCode: 'FJ',
    address: '9012 West Child Care Ave',
    city: 'Columbia',
    state: 'SC',
    zip: '29207',
    phone: '(803) 555-0103',
    director: 'Jennifer Williams',
    capacity: 150,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  {
    id: '4',
    name: 'Fort Jackson CDC #4 - North',
    code: 'FJ-CDC-004',
    installation: 'Fort Jackson',
    installationCode: 'FJ',
    address: '3456 North Child Care St',
    city: 'Columbia',
    state: 'SC',
    zip: '29207',
    phone: '(803) 555-0104',
    director: 'David Chen',
    capacity: 180,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  {
    id: '5',
    name: 'Fort Jackson CDC #5 - South',
    code: 'FJ-CDC-005',
    installation: 'Fort Jackson',
    installationCode: 'FJ',
    address: '7890 South Child Care Rd',
    city: 'Columbia',
    state: 'SC',
    zip: '29207',
    phone: '(803) 555-0105',
    director: 'Lisa Thompson',
    capacity: 200,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  {
    id: '6',
    name: 'Fort Jackson CDC #6 - Central',
    code: 'FJ-CDC-006',
    installation: 'Fort Jackson',
    installationCode: 'FJ',
    address: '2468 Central Child Care Way',
    city: 'Columbia',
    state: 'SC',
    zip: '29207',
    phone: '(803) 555-0106',
    director: 'Robert Davis',
    capacity: 110,
    ageGroups: ['Infant', 'Toddler', 'Preschool'],
    status: 'active',
  },
  {
    id: '7',
    name: 'Fort Jackson CDC #7 - Training',
    code: 'FJ-CDC-007',
    installation: 'Fort Jackson',
    installationCode: 'FJ',
    address: '1357 Training Child Care Ln',
    city: 'Columbia',
    state: 'SC',
    zip: '29207',
    phone: '(803) 555-0107',
    director: 'Maria Garcia',
    capacity: 85,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  {
    id: '8',
    name: 'Fort Jackson CDC #8 - Support',
    code: 'FJ-CDC-008',
    installation: 'Fort Jackson',
    installationCode: 'FJ',
    address: '9753 Support Child Care Dr',
    city: 'Columbia',
    state: 'SC',
    zip: '29207',
    phone: '(803) 555-0108',
    director: 'James Wilson',
    capacity: 140,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  // Fort Bragg, NC - Multiple Centers
  {
    id: '9',
    name: 'Fort Bragg CDC #1 - Main',
    code: 'FB-CDC-001',
    installation: 'Fort Bragg',
    installationCode: 'FB',
    address: '1234 Child Care Drive',
    city: 'Fayetteville',
    state: 'NC',
    zip: '28310',
    phone: '(910) 555-0201',
    director: 'Sarah Johnson',
    capacity: 120,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  {
    id: '10',
    name: 'Fort Bragg CDC #2 - East',
    code: 'FB-CDC-002',
    installation: 'Fort Bragg',
    installationCode: 'FB',
    address: '5678 East Child Care Blvd',
    city: 'Fayetteville',
    state: 'NC',
    zip: '28310',
    phone: '(910) 555-0202',
    director: 'Michael Rodriguez',
    capacity: 95,
    ageGroups: ['Infant', 'Toddler', 'Preschool'],
    status: 'active',
  },
  {
    id: '11',
    name: 'Fort Bragg CDC #3 - West',
    code: 'FB-CDC-003',
    installation: 'Fort Bragg',
    installationCode: 'FB',
    address: '9012 West Child Care Ave',
    city: 'Fayetteville',
    state: 'NC',
    zip: '28310',
    phone: '(910) 555-0203',
    director: 'Jennifer Williams',
    capacity: 150,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  // Camp Lejeune, NC
  {
    id: '12',
    name: 'Camp Lejeune CDC #1 - Main',
    code: 'CL-CDC-001',
    installation: 'Camp Lejeune',
    installationCode: 'CL',
    address: '1234 Marine Way',
    city: 'Jacksonville',
    state: 'NC',
    zip: '28542',
    phone: '(910) 555-0301',
    director: 'David Chen',
    capacity: 180,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  {
    id: '13',
    name: 'Camp Lejeune CDC #2 - East',
    code: 'CL-CDC-002',
    installation: 'Camp Lejeune',
    installationCode: 'CL',
    address: '5678 East Marine Blvd',
    city: 'Jacksonville',
    state: 'NC',
    zip: '28542',
    phone: '(910) 555-0302',
    director: 'Lisa Thompson',
    capacity: 200,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  // Norfolk Naval Station, VA
  {
    id: '14',
    name: 'Norfolk Naval CDC #1 - Main',
    code: 'NN-CDC-001',
    installation: 'Norfolk Naval Station',
    installationCode: 'NN',
    address: '1234 Navy Boulevard',
    city: 'Norfolk',
    state: 'VA',
    zip: '23511',
    phone: '(757) 555-0401',
    director: 'Robert Davis',
    capacity: 150,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
  },
  {
    id: '15',
    name: 'Norfolk Naval CDC #2 - East',
    code: 'NN-CDC-002',
    installation: 'Norfolk Naval Station',
    installationCode: 'NN',
    address: '5678 East Navy Ave',
    city: 'Norfolk',
    state: 'VA',
    zip: '23511',
    phone: '(757) 555-0402',
    director: 'Maria Garcia',
    capacity: 110,
    ageGroups: ['Infant', 'Toddler', 'Preschool'],
    status: 'active',
  },
];

export default function NewRequestPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isDraft, setIsDraft] = useState(false);

  // Form state
  const [formData, setFormData] = useState<
    Partial<CreateRequestData> & { totalEstimate?: number; facilityId?: string; installationId?: string }
  >({
    vendor: '',
    justification: '',
    needBy: new Date(),
    accountingCode: '',
    items: [] as RequestItem[],
    totalEstimate: 0,
    facilityId: '',
    installationId: '',
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  // Get unique installations
  const installations = Array.from(
    new Set(mockFacilities.map(f => f.installation))
  ).map(installation => ({
    id: installation,
    name: installation,
    code: mockFacilities.find(f => f.installation === installation)?.installationCode || '',
  }));

  // Get facilities by installation
  const getFacilitiesByInstallation = (installationId: string) => {
    return mockFacilities.filter(f => f.installation === installationId);
  };

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

  // Check if user has permission to create requests (separation of duties)
  if (!['requester', 'admin'].includes(user.role || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            Only requesters can create new procurement requests. 
            <br />
            Approvers, cardholders, and auditors have different responsibilities.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof CreateRequestData | 'facilityId' | 'installationId', value: unknown) => {
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
      if (!formData.installationId?.trim()) {
        toast.error('Installation selection is required');
        return;
      }
      if (!formData.facilityId?.trim()) {
        toast.error('Child care center selection is required');
        return;
      }
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
                    Installation *
                  </label>
                  <select
                    value={formData.installationId || ''}
                    onChange={e => {
                      handleInputChange('installationId', e.target.value);
                      handleInputChange('facilityId', ''); // Reset facility when installation changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an installation</option>
                    {installations.map(installation => (
                      <option key={installation.id} value={installation.id}>
                        {installation.name} ({installation.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child Care Center *
                  </label>
                  <select
                    value={formData.facilityId || ''}
                    onChange={e => handleInputChange('facilityId', e.target.value)}
                    disabled={!formData.installationId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.installationId ? 'Select a child care center' : 'Select installation first'}
                    </option>
                    {formData.installationId && getFacilitiesByInstallation(formData.installationId).map(facility => (
                      <option key={facility.id} value={facility.id}>
                        {facility.name} ({facility.code})
                      </option>
                    ))}
                  </select>
                </div>
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
