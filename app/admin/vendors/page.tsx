'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { AdminNav } from '@/components/ui/admin-nav';
import { VendorModal } from '@/components/ui/vendor-modal';
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
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Vendor {
  id: string;
  name: string;
  type: 'supplier' | 'contractor' | 'service_provider';
  status: 'active' | 'inactive' | 'suspended';
  marketType: 'contract' | 'open_market';
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
    marketType: 'contract',
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
    marketType: 'open_market',
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
  const [marketTypeFilter, setMarketTypeFilter] = useState<string>('all');
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
    const matchesMarketType = marketTypeFilter === 'all' || vendor.marketType === marketTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesMarketType;
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

  const handleAddVendor = () => {
    setSelectedVendor(null);
    setShowAddForm(true);
  };

  const handleEditVendor = (vendorId: string) => {
    const vendorToEdit = vendors.find(v => v.id === vendorId);
    if (vendorToEdit) {
      setSelectedVendor(vendorToEdit);
      setShowAddForm(true);
    }
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
    setSelectedVendor(null);
  };

  const handleSaveVendor = async (vendorData: Vendor) => {
    try {
      if (vendorData.id && vendors.find(v => v.id === vendorData.id)) {
        // Update existing vendor
        setVendors(prev =>
          prev.map(v =>
            v.id === vendorData.id
              ? { ...vendorData, updatedAt: new Date() }
              : v
          )
        );
        toast.success('Vendor updated successfully');
      } else {
        // Add new vendor
        const newVendor: Vendor = {
          ...vendorData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setVendors(prev => [...prev, newVendor]);
        toast.success('Vendor created successfully');
      }

      setShowAddForm(false);
      setSelectedVendor(null);
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast.error('Failed to save vendor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/admin')}
                  className="flex items-center space-x-2 text-sm"
                >
                  ← Back to Admin Dashboard
                </Button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vendor Management</h1>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                Manage vendor database, add new vendors, and track performance.
              </p>
            </div>
            <Button
              onClick={handleAddVendor}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
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

                {/* Market Type Filter */}
                <div className="lg:w-48">
                  <select
                    value={marketTypeFilter}
                    onChange={(e) => setMarketTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Markets</option>
                    <option value="contract">Federal Contract</option>
                    <option value="open_market">Open Market</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vendor.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
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
                          <span className="font-medium">Market:</span> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${
                            vendor.marketType === 'contract' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {vendor.marketType === 'contract' ? 'Federal Contract' : 'Open Market'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Rating:</span> {vendor.performance.rating}/5.0
                        </div>
                        <div>
                          <span className="font-medium">On-Time Delivery:</span> {vendor.performance.onTimeDelivery}%
                        </div>
                      </div>
                      
                      {/* Contract Information */}
                      {vendor.contracts && vendor.contracts.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Federal Contracts</h4>
                          <div className="space-y-2">
                            {vendor.contracts.slice(0, 2).map((contract, index) => (
                              <div key={index} className="bg-blue-50 p-2 rounded text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-blue-900">
                                    {contract.contractNumber || 'Contract #' + (index + 1)}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    contract.status === 'active' 
                                      ? 'bg-green-100 text-green-800' 
                                      : contract.status === 'expired'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {contract.status || 'Unknown'}
                                  </span>
                                </div>
                                <div className="text-blue-700 mt-1">
                                  {contract.contractType} • {contract.description || 'No description'}
                                </div>
                                {contract.beginDate && contract.endDate && (
                                  <div className="text-blue-600 text-xs mt-1">
                                    {contract.beginDate.toLocaleDateString()} - {contract.endDate.toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            ))}
                            {vendor.contracts.length > 2 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{vendor.contracts.length - 2} more contracts
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVendor(vendor.id)}
                        className="w-full sm:w-auto"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePreferred(vendor.id)}
                        className="w-full sm:w-auto"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">{vendor.preferences.preferred ? 'Remove' : 'Set'} Preferred</span>
                        <span className="sm:hidden">{vendor.preferences.preferred ? 'Remove' : 'Set'}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-1 sm:mr-0" />
                        <span className="sm:hidden">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Vendor Modal */}
        <VendorModal
          isOpen={showAddForm}
          onClose={handleCloseModal}
          onSave={handleSaveVendor}
          vendor={selectedVendor}
          isProcessing={false}
        />
      </div>
    </div>
  );
}
