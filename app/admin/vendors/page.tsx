'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Search,
  MapPin,
  Phone,
  Mail,
  Star,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  };
  contracts: {
    contractNumber?: string;
    contractType?: 'GSA' | 'IDIQ' | 'BPA' | 'Other';
    beginDate?: Date;
    endDate?: Date;
    status?: 'active' | 'expired' | 'pending';
    description?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

// Mock vendors data
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
    },
    contracts: [
      {
        contractNumber: 'GS-07F-1234A',
        contractType: 'GSA',
        beginDate: new Date('2023-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'active',
        description: 'GSA Schedule 70 - IT Equipment and Services',
      },
      {
        contractNumber: 'IDIQ-2024-001',
        contractType: 'IDIQ',
        beginDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'active',
        description: 'Indefinite Delivery Indefinite Quantity - Office Supplies',
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
    },
    contracts: [
      {
        contractNumber: 'BPA-2024-HD-001',
        contractType: 'BPA',
        beginDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        status: 'active',
        description: 'Blanket Purchase Agreement - Hardware and Tools',
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
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-01-10'),
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

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

  // Check if user has admin permissions
  if (!actualRole || !['admin'].includes(actualRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access the vendor management page.
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
      vendor.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesType = typeFilter === 'all' || vendor.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== vendorId));
      toast.success('Vendor deleted successfully');
    }
  };

  const handleTogglePreferred = (vendorId: string) => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId 
        ? { ...vendor, preferences: { ...vendor.preferences, preferred: !vendor.preferences.preferred } }
        : vendor
    ));
    toast.success('Vendor preference updated');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
              <p className="mt-2 text-gray-600">
                Manage vendor database, add new vendors, and track performance.
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Vendor
            </Button>
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
                      placeholder="Search vendors by name, contact, or email..."
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
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vendors.filter(v => v.status === 'active').length}
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
                  <p className="text-sm font-medium text-gray-500">Suspended</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vendors.filter(v => v.status === 'suspended').length}
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
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                    ? 'No vendors match your current filters.'
                    : 'Get started by adding your first vendor.'
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
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
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePreferred(vendor.id)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {vendor.preferences.preferred ? 'Remove' : 'Set'} Preferred
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
