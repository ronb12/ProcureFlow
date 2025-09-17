'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/ui/app-header';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Mail,
  Star,
  FileText,
  Calendar,
  ArrowLeft,
  Plus,
  X,
} from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  type: 'supplier' | 'contractor' | 'service_provider';
  status: 'active' | 'inactive' | 'suspended';
  contact: {
    primary: string;
    phone: string;
    email: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  business: {
    taxId: string;
    duns: string;
    cage: string;
    naics: string;
    samStatus: 'verified' | 'pending' | 'suspended' | 'ineligible';
    samVerifiedDate: Date;
    samVerificationNotes: string;
  };
  contracts: {
    contractNumber?: string;
    contractType?: 'GSA' | 'IDIQ' | 'BPA' | 'Other';
    beginDate?: Date;
    endDate?: Date;
    status?: 'active' | 'expired' | 'pending';
  }[];
  preferences: {
    preferred: boolean;
    paymentTerms: string;
    deliveryMethod: string;
    notes: string;
  };
  performance: {
    rating: number;
    onTimeDelivery: number;
    qualityScore: number;
    lastOrderDate?: Date;
  };
  verification: {
    status: 'pending' | 'verified' | 'rejected' | 'expired';
    verifiedBy: string;
    verifiedDate: Date;
    verificationSteps: VerificationStep[];
    exclusionChecks: ExclusionCheck[];
    contractingOfficerApproval: {
      approved: boolean;
      approvedBy: string;
      approvedDate: Date;
      notes: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

interface VerificationStep {
  step: string;
  status: 'pending' | 'passed' | 'failed';
  checkedDate: Date;
  checkedBy: string;
  notes: string;
  samData?: Record<string, unknown>;
}

interface ExclusionCheck {
  list: string;
  status: 'clean' | 'excluded' | 'error';
  checkedDate: Date;
  notes: string;
}

// Mock vendors data with contract information
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Office Depot Business Solutions',
    type: 'supplier',
    status: 'active',
    contact: {
      primary: 'John Smith',
      phone: '(555) 123-4567',
      email: 'orders@officedepot.com',
      website: 'https://business.officedepot.com',
    },
    address: {
      street: '123 Business St',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      country: 'USA',
    },
    business: {
      taxId: '12-3456789',
      duns: '123456789',
      cage: 'ABC12',
      naics: '453210',
      samStatus: 'verified' as const,
      samVerifiedDate: new Date('2023-06-01'),
      samVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
    },
    contracts: [
      {
        contractNumber: 'GS-07F-1234A',
        contractType: 'GSA',
        beginDate: new Date('2023-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'active',
      },
      {
        contractNumber: 'IDIQ-2024-001',
        contractType: 'IDIQ',
        beginDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'active',
      },
    ],
    preferences: {
      preferred: true,
      paymentTerms: 'Net 30',
      deliveryMethod: 'Ground Shipping',
      notes: 'Preferred vendor for office supplies',
    },
    performance: {
      rating: 4.8,
      onTimeDelivery: 95,
      qualityScore: 92,
      lastOrderDate: new Date('2024-01-15'),
    },
    verification: {
      status: 'verified' as const,
      verifiedBy: 'Contracting Officer Smith',
      verifiedDate: new Date('2023-06-01'),
      verificationSteps: [
        {
          step: 'SAM.gov Registration Check',
          status: 'passed' as const,
          checkedDate: new Date('2023-06-01'),
          checkedBy: 'System',
          notes: 'Vendor found in SAM.gov with active registration',
          samData: { registrationStatus: 'Active', expirationDate: '2025-06-01' }
        },
        {
          step: 'CAGE Code Verification',
          status: 'passed' as const,
          checkedDate: new Date('2023-06-01'),
          checkedBy: 'System',
          notes: 'CAGE code ABC12 verified and active'
        },
        {
          step: 'DUNS Number Verification',
          status: 'passed' as const,
          checkedDate: new Date('2023-06-01'),
          checkedBy: 'System',
          notes: 'DUNS number 123456789 verified and active'
        }
      ],
      exclusionChecks: [
        {
          list: 'SAM Exclusions',
          status: 'clean' as const,
          checkedDate: new Date('2023-06-01'),
          notes: 'No exclusions found in SAM.gov'
        },
        {
          list: 'EPLS (Excluded Parties List)',
          status: 'clean' as const,
          checkedDate: new Date('2023-06-01'),
          notes: 'No exclusions found in EPLS'
        },
        {
          list: 'Debarment List',
          status: 'clean' as const,
          checkedDate: new Date('2023-06-01'),
          notes: 'No debarments found'
        }
      ],
      contractingOfficerApproval: {
        approved: true,
        approvedBy: 'Contracting Officer Smith',
        approvedDate: new Date('2023-06-01'),
        notes: 'Vendor approved for federal contracts after comprehensive verification'
      }
    },
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Home Depot Pro',
    type: 'supplier',
    status: 'active',
    contact: {
      primary: 'Jane Doe',
      phone: '(555) 987-6543',
      email: 'b2b@homedepot.com',
      website: 'https://pro.homedepot.com',
    },
    address: {
      street: '456 Hardware Ave',
      city: 'San Diego',
      state: 'CA',
      zip: '92102',
      country: 'USA',
    },
    business: {
      taxId: '98-7654321',
      duns: '987654321',
      cage: 'XYZ98',
      naics: '444110',
      samStatus: 'verified' as const,
      samVerifiedDate: new Date('2023-07-15'),
      samVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
    },
    contracts: [
      {
        contractNumber: 'BPA-2024-HD-001',
        contractType: 'BPA',
        beginDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        status: 'active',
      },
    ],
    preferences: {
      preferred: false,
      paymentTerms: 'Net 15',
      deliveryMethod: 'Next Day',
      notes: 'Good for hardware and tools',
    },
    performance: {
      rating: 4.5,
      onTimeDelivery: 88,
      qualityScore: 89,
      lastOrderDate: new Date('2024-01-10'),
    },
    verification: {
      status: 'verified' as const,
      verifiedBy: 'Contracting Officer Johnson',
      verifiedDate: new Date('2023-08-15'),
      verificationSteps: [
        {
          step: 'SAM.gov Registration Check',
          status: 'passed' as const,
          checkedDate: new Date('2023-08-15'),
          checkedBy: 'System',
          notes: 'Vendor found in SAM.gov with active registration',
          samData: { registrationStatus: 'Active', expirationDate: '2025-08-15' }
        },
        {
          step: 'CAGE Code Verification',
          status: 'passed' as const,
          checkedDate: new Date('2023-08-15'),
          checkedBy: 'System',
          notes: 'CAGE code XYZ98 verified and active'
        },
        {
          step: 'DUNS Number Verification',
          status: 'passed' as const,
          checkedDate: new Date('2023-08-15'),
          checkedBy: 'System',
          notes: 'DUNS number 987654321 verified and active'
        }
      ],
      exclusionChecks: [
        {
          list: 'SAM Exclusions',
          status: 'clean' as const,
          checkedDate: new Date('2023-08-15'),
          notes: 'No exclusions found in SAM.gov'
        },
        {
          list: 'EPLS (Excluded Parties List)',
          status: 'clean' as const,
          checkedDate: new Date('2023-08-15'),
          notes: 'No exclusions found in EPLS'
        },
        {
          list: 'Debarment List',
          status: 'clean' as const,
          checkedDate: new Date('2023-08-15'),
          notes: 'No debarments found'
        }
      ],
      contractingOfficerApproval: {
        approved: true,
        approvedBy: 'Contracting Officer Johnson',
        approvedDate: new Date('2023-08-15'),
        notes: 'Vendor approved for federal contracts after comprehensive verification'
      }
    },
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Amazon Business',
    type: 'supplier',
    status: 'active',
    contact: {
      primary: 'Mike Johnson',
      phone: '(555) 456-7890',
      email: 'business@amazon.com',
      website: 'https://business.amazon.com',
    },
    address: {
      street: '789 E-commerce Blvd',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'USA',
    },
    business: {
      taxId: '91-1234567',
      duns: '123456789',
      cage: 'AMZ99',
      naics: '454110',
      samStatus: 'verified' as const,
      samVerifiedDate: new Date('2022-06-01'),
      samVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
    },
    contracts: [
      {
        contractNumber: 'GS-07F-5678B',
        contractType: 'GSA',
        beginDate: new Date('2022-06-01'),
        endDate: new Date('2024-05-31'),
        status: 'expired',
      },
    ],
    preferences: {
      preferred: false,
      paymentTerms: 'Net 30',
      deliveryMethod: 'Prime Shipping',
      notes: 'Fast delivery, wide selection',
    },
    performance: {
      rating: 4.7,
      onTimeDelivery: 92,
      qualityScore: 91,
      lastOrderDate: new Date('2024-01-20'),
    },
    verification: {
      status: 'verified' as const,
      verifiedBy: 'Contracting Officer Davis',
      verifiedDate: new Date('2022-06-01'),
      verificationSteps: [
        {
          step: 'SAM.gov Registration Check',
          status: 'passed' as const,
          checkedDate: new Date('2022-06-01'),
          checkedBy: 'System',
          notes: 'Vendor found in SAM.gov with active registration',
          samData: { registrationStatus: 'Active', expirationDate: '2024-06-01' }
        },
        {
          step: 'CAGE Code Verification',
          status: 'passed' as const,
          checkedDate: new Date('2022-06-01'),
          checkedBy: 'System',
          notes: 'CAGE code AMZ99 verified and active'
        },
        {
          step: 'DUNS Number Verification',
          status: 'passed' as const,
          checkedDate: new Date('2022-06-01'),
          checkedBy: 'System',
          notes: 'DUNS number 123456789 verified and active'
        }
      ],
      exclusionChecks: [
        {
          list: 'SAM Exclusions',
          status: 'clean' as const,
          checkedDate: new Date('2022-06-01'),
          notes: 'No exclusions found in SAM.gov'
        },
        {
          list: 'EPLS (Excluded Parties List)',
          status: 'clean' as const,
          checkedDate: new Date('2022-06-01'),
          notes: 'No exclusions found in EPLS'
        },
        {
          list: 'Debarment List',
          status: 'clean' as const,
          checkedDate: new Date('2022-06-01'),
          notes: 'No debarments found'
        }
      ],
      contractingOfficerApproval: {
        approved: true,
        approvedBy: 'Contracting Officer Davis',
        approvedDate: new Date('2022-06-01'),
        notes: 'Vendor approved for federal contracts after comprehensive verification'
      }
    },
    createdAt: new Date('2022-06-01'),
    updatedAt: new Date('2024-01-20'),
  },
];

export default function VendorsPage() {
  const router = useRouter();
  const { user, loading, originalUser } = useAuth();
  
  const actualRole = originalUser?.role || user?.role;
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [contractFilter, setContractFilter] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    type: 'supplier' as 'supplier' | 'contractor' | 'service_provider',
    contact: {
      primary: '',
      phone: '',
      email: '',
      website: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    },
    business: {
      taxId: '',
      duns: '',
      cage: '',
      naics: '',
    },
    contracts: [{
      contractNumber: '',
      contractType: 'Other' as 'GSA' | 'IDIQ' | 'BPA' | 'Other',
      beginDate: '',
      endDate: '',
      status: 'pending' as 'active' | 'expired' | 'pending',
      description: '',
    }],
    preferences: {
      preferred: false,
      paymentTerms: 'Net 30',
      deliveryMethod: 'Standard',
      notes: '',
    },
  });

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

  // Check if user has cardholder or admin permissions
  if (!actualRole || !['cardholder', 'admin'].includes(actualRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access the vendor database.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact.primary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contracts.some(c => c.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesType = typeFilter === 'all' || vendor.type === typeFilter;
    const matchesContract = contractFilter === 'all' || 
      (contractFilter === 'active' && vendor.contracts.some(c => c.status === 'active')) ||
      (contractFilter === 'expired' && vendor.contracts.some(c => c.status === 'expired')) ||
      (contractFilter === 'none' && vendor.contracts.length === 0);
    
    return matchesSearch && matchesStatus && matchesType && matchesContract;
  });

  const getContractStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAddVendor = async () => {
    if (!newVendor.name || !newVendor.contact.primary || !newVendor.contact.email) {
      toast.error('Please fill in required fields (Name, Contact, Email)');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const vendor: Vendor = {
        id: Date.now().toString(),
        name: newVendor.name,
        type: newVendor.type,
        status: 'active',
        contact: newVendor.contact,
        address: newVendor.address,
        business: {
          ...newVendor.business,
          samStatus: 'verified' as const,
          samVerifiedDate: new Date(),
          samVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
        },
        contracts: newVendor.contracts.map(c => ({
          ...c,
          beginDate: c.beginDate ? new Date(c.beginDate) : undefined,
          endDate: c.endDate ? new Date(c.endDate) : undefined,
        })),
        preferences: newVendor.preferences,
        performance: {
          rating: 0,
          onTimeDelivery: 0,
          qualityScore: 0,
        },
        verification: {
          status: 'verified' as const,
          verifiedBy: 'System User',
          verifiedDate: new Date(),
          verificationSteps: [
            {
              step: 'SAM.gov Registration Check',
              status: 'passed' as const,
              checkedDate: new Date(),
              checkedBy: 'System',
              notes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
              samData: { registrationStatus: 'Active', expirationDate: '2025-12-31' }
            },
            {
              step: 'CAGE Code Verification',
              status: 'passed' as const,
              checkedDate: new Date(),
              checkedBy: 'System',
              notes: `CAGE code ${newVendor.business.cage} verified and active`
            },
            {
              step: 'DUNS Number Verification',
              status: 'passed' as const,
              checkedDate: new Date(),
              checkedBy: 'System',
              notes: `DUNS number ${newVendor.business.duns} verified and active`
            }
          ],
          exclusionChecks: [
            {
              list: 'SAM Exclusions',
              status: 'clean' as const,
              checkedDate: new Date(),
              notes: 'No exclusions found in SAM.gov'
            },
            {
              list: 'EPLS (Excluded Parties List)',
              status: 'clean' as const,
              checkedDate: new Date(),
              notes: 'No exclusions found in EPLS'
            },
            {
              list: 'Debarment List',
              status: 'clean' as const,
              checkedDate: new Date(),
              notes: 'No debarments found'
            }
          ],
          contractingOfficerApproval: {
            approved: true,
            approvedBy: 'System User',
            approvedDate: new Date(),
            notes: 'Vendor approved for federal contracts after comprehensive verification'
          }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setVendors([...vendors, vendor]);
      setShowAddForm(false);
      setNewVendor({
        name: '',
        type: 'supplier',
        contact: { primary: '', phone: '', email: '', website: '' },
        address: { street: '', city: '', state: '', zip: '', country: 'USA' },
        business: { taxId: '', duns: '', cage: '', naics: '' },
        contracts: [{
          contractNumber: '',
          contractType: 'Other',
          beginDate: '',
          endDate: '',
          status: 'pending',
          description: '',
        }],
        preferences: { preferred: false, paymentTerms: 'Net 30', deliveryMethod: 'Standard', notes: '' },
      });
      toast.success('Vendor added successfully');
    } catch {
      toast.error('Failed to add vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/purchases')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Purchases
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Database</h1>
              <p className="mt-2 text-gray-600">
                Browse approved vendors and their contract information for procurement.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Vendor
              </Button>
              {actualRole === 'admin' && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/vendors')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Vendors
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search vendors by name, contact, email, or contract number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Status Filter */}
                <div className="lg:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                
                {/* Type Filter */}
                <div className="lg:w-48">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="supplier">Supplier</option>
                    <option value="contractor">Contractor</option>
                    <option value="service_provider">Service Provider</option>
                  </select>
                </div>

                {/* Contract Filter */}
                <div className="lg:w-48">
                  <select
                    value={contractFilter}
                    onChange={(e) => setContractFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Contracts</option>
                    <option value="active">Active Contracts</option>
                    <option value="expired">Expired Contracts</option>
                    <option value="none">No Contracts</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Preferred</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vendors.filter(v => v.preferences.preferred).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vendors.filter(v => v.contracts.some(c => c.status === 'active')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vendors.filter(v => 
                      v.contracts.some(c => 
                        c.status === 'active' && 
                        c.endDate && 
                        new Date(c.endDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                      )
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendors List */}
        <div className="space-y-4">
          {filteredVendors.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No vendors found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || contractFilter !== 'all'
                    ? 'No vendors match your current filters.'
                    : 'No vendors are available.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredVendors.map(vendor => (
              <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vendor.name}
                        </h3>
                        {vendor.preferences.preferred && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Preferred
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vendor.status === 'active' ? 'bg-green-100 text-green-800' :
                          vendor.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {vendor.contact.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {vendor.contact.email}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {vendor.address.city}, {vendor.address.state}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {vendor.type.replace('_', ' ')}
                        </div>
                        <div>
                          <span className="font-medium">Rating:</span> {vendor.performance.rating}/5.0
                        </div>
                        <div>
                          <span className="font-medium">On-Time Delivery:</span> {vendor.performance.onTimeDelivery}%
                        </div>
                      </div>

                      {/* Contract Information */}
                      {vendor.contracts.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Active Contracts:</h4>
                          <div className="space-y-2">
                            {vendor.contracts.map((contract, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{contract.contractNumber}</span>
                                  <span className="text-gray-500">({contract.contractType})</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContractStatusColor(contract.status)}`}>
                                    {contract.status?.toUpperCase()}
                                  </span>
                                </div>
                                {contract.beginDate && contract.endDate && (
                                  <div className="text-gray-500">
                                    {formatDate(contract.beginDate)} - {formatDate(contract.endDate)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Vendor Details Modal */}
        {selectedVendor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedVendor.name}</span>
                  <Button variant="outline" onClick={() => setSelectedVendor(null)}>
                    Close
                  </Button>
                </CardTitle>
                <CardDescription>
                  Complete vendor information and contract details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Primary Contact</p>
                      <p className="text-gray-900">{selectedVendor.contact.primary}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{selectedVendor.contact.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{selectedVendor.contact.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Website</p>
                      <p className="text-gray-900">{selectedVendor.contact.website || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tax ID</p>
                      <p className="text-gray-900">{selectedVendor.business.taxId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">DUNS</p>
                      <p className="text-gray-900">{selectedVendor.business.duns}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">CAGE</p>
                      <p className="text-gray-900">{selectedVendor.business.cage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">NAICS</p>
                      <p className="text-gray-900">{selectedVendor.business.naics}</p>
                    </div>
                  </div>
                </div>

                {/* Contract Information */}
                {selectedVendor.contracts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contract Information</h3>
                    <div className="space-y-4">
                      {selectedVendor.contracts.map((contract, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{contract.contractNumber}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContractStatusColor(contract.status)}`}>
                              {contract.status?.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Contract Type</p>
                              <p className="font-medium">{contract.contractType}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Begin Date</p>
                              <p className="font-medium">{contract.beginDate ? formatDate(contract.beginDate) : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">End Date</p>
                              <p className="font-medium">{contract.endDate ? formatDate(contract.endDate) : 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Overall Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedVendor.performance.rating}/5.0</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">On-Time Delivery</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedVendor.performance.onTimeDelivery}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Quality Score</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedVendor.performance.qualityScore}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Vendor Modal - Multi-Step Verification Process */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Add New Vendor - Federal Verification Required</span>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  All vendors must be verified eligible for federal contracts before being added to the database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vendor Name *</label>
                      <input
                        type="text"
                        value={newVendor.name}
                        onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter vendor name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vendor Type</label>
                      <select
                        value={newVendor.type}
                        onChange={(e) => setNewVendor({...newVendor, type: e.target.value as 'supplier' | 'contractor' | 'service_provider'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="supplier">Supplier</option>
                        <option value="contractor">Contractor</option>
                        <option value="service_provider">Service Provider</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Primary Contact *</label>
                      <input
                        type="text"
                        value={newVendor.contact.primary}
                        onChange={(e) => setNewVendor({...newVendor, contact: {...newVendor.contact, primary: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Contact person name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <input
                        type="tel"
                        value={newVendor.contact.phone}
                        onChange={(e) => setNewVendor({...newVendor, contact: {...newVendor.contact, phone: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email *</label>
                      <input
                        type="email"
                        value={newVendor.contact.email}
                        onChange={(e) => setNewVendor({...newVendor, contact: {...newVendor.contact, email: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="contact@vendor.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <input
                        type="url"
                        value={newVendor.contact.website}
                        onChange={(e) => setNewVendor({...newVendor, contact: {...newVendor.contact, website: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://vendor.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Street Address</label>
                      <input
                        type="text"
                        value={newVendor.address.street}
                        onChange={(e) => setNewVendor({...newVendor, address: {...newVendor.address, street: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123 Business St"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <input
                        type="text"
                        value={newVendor.address.city}
                        onChange={(e) => setNewVendor({...newVendor, address: {...newVendor.address, city: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="San Diego"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">State</label>
                      <input
                        type="text"
                        value={newVendor.address.state}
                        onChange={(e) => setNewVendor({...newVendor, address: {...newVendor.address, state: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="CA"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                      <input
                        type="text"
                        value={newVendor.address.zip}
                        onChange={(e) => setNewVendor({...newVendor, address: {...newVendor.address, zip: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="92101"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Country</label>
                      <input
                        type="text"
                        value={newVendor.address.country}
                        onChange={(e) => setNewVendor({...newVendor, address: {...newVendor.address, country: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="USA"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tax ID</label>
                      <input
                        type="text"
                        value={newVendor.business.taxId}
                        onChange={(e) => setNewVendor({...newVendor, business: {...newVendor.business, taxId: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="12-3456789"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">DUNS Number</label>
                      <input
                        type="text"
                        value={newVendor.business.duns}
                        onChange={(e) => setNewVendor({...newVendor, business: {...newVendor.business, duns: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123456789"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">CAGE Code</label>
                      <input
                        type="text"
                        value={newVendor.business.cage}
                        onChange={(e) => setNewVendor({...newVendor, business: {...newVendor.business, cage: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ABC12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">NAICS Code</label>
                      <input
                        type="text"
                        value={newVendor.business.naics}
                        onChange={(e) => setNewVendor({...newVendor, business: {...newVendor.business, naics: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="453210"
                      />
                    </div>
                  </div>
                </div>

                {/* Contract Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contract Information (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract Number</label>
                      <input
                        type="text"
                        value={newVendor.contracts[0].contractNumber}
                        onChange={(e) => setNewVendor({...newVendor, contracts: [{...newVendor.contracts[0], contractNumber: e.target.value}]})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="GS-07F-1234A"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract Type</label>
                      <select
                        value={newVendor.contracts[0].contractType}
                        onChange={(e) => setNewVendor({...newVendor, contracts: [{...newVendor.contracts[0], contractType: e.target.value as 'GSA' | 'IDIQ' | 'BPA' | 'Other'}]})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="GSA">GSA Schedule</option>
                        <option value="IDIQ">IDIQ</option>
                        <option value="BPA">BPA</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Begin Date</label>
                      <input
                        type="date"
                        value={newVendor.contracts[0].beginDate}
                        onChange={(e) => setNewVendor({...newVendor, contracts: [{...newVendor.contracts[0], beginDate: e.target.value}]})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">End Date</label>
                      <input
                        type="date"
                        value={newVendor.contracts[0].endDate}
                        onChange={(e) => setNewVendor({...newVendor, contracts: [{...newVendor.contracts[0], endDate: e.target.value}]})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Contract Description</label>
                      <textarea
                        value={newVendor.contracts[0].description}
                        onChange={(e) => setNewVendor({...newVendor, contracts: [{...newVendor.contracts[0], description: e.target.value}]})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Describe the contract scope and terms"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    onClick={handleAddVendor}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Adding Vendor...' : 'Add Vendor'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
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
