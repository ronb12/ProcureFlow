'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { X, Building2, Plus, Edit } from 'lucide-react';
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
    onTimeDelivery: number; // percentage
    qualityScore: number; // percentage
    lastOrderDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface VendorFormData extends Partial<Vendor> {
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
}

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendorData: Vendor) => void;
  vendor?: Vendor | null;
  isProcessing?: boolean;
}

const vendorTypeOptions = [
  { value: 'supplier', label: 'Supplier' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'service_provider', label: 'Service Provider' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

const paymentTermsOptions = [
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Due on Receipt',
  '2/10 Net 30',
];

const deliveryMethodOptions = [
  'Ground Shipping',
  'Express Shipping',
  'Store Pickup',
  'Delivery',
  'Email Delivery',
];

export function VendorModal({
  isOpen,
  onClose,
  onSave,
  vendor,
  isProcessing = false,
}: VendorModalProps) {
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    type: 'supplier',
    status: 'active',
    marketType: 'contract',
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
    contracts: [],
    preferences: {
      preferred: false,
      paymentTerms: 'Net 30',
      deliveryMethod: 'Ground Shipping',
      notes: '',
    },
    performance: {
      rating: 0,
      onTimeDelivery: 0,
      qualityScore: 0,
      lastOrderDate: undefined,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vendor) {
      setFormData({
        id: vendor.id,
        name: vendor.name,
        type: vendor.type,
        status: vendor.status,
        marketType: vendor.marketType,
        contact: { ...vendor.contact },
        address: { ...vendor.address },
        business: { ...vendor.business },
        contracts: [...vendor.contracts],
        preferences: { ...vendor.preferences },
        performance: { ...vendor.performance },
      });
    } else {
      setFormData({
        name: '',
        type: 'supplier',
        status: 'active',
        marketType: 'contract',
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
        contracts: [],
        preferences: {
          preferred: false,
          paymentTerms: 'Net 30',
          deliveryMethod: 'Ground Shipping',
          notes: '',
        },
        performance: {
          rating: 0,
          onTimeDelivery: 0,
          qualityScore: 0,
          lastOrderDate: undefined,
        },
      });
    }
    setErrors({});
  }, [vendor, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required';
    }

    if (!formData.contact.primary.trim()) {
      newErrors.contactPrimary = 'Primary contact name is required';
    }

    if (!formData.contact.email.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData.contact.phone.trim()) {
      newErrors.contactPhone = 'Phone number is required';
    }

    if (!formData.address.street.trim()) {
      newErrors.addressStreet = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.addressCity = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors.addressState = 'State is required';
    }

    if (!formData.address.zip.trim()) {
      newErrors.addressZip = 'ZIP code is required';
    }

    if (!formData.business.taxId.trim()) {
      newErrors.businessTaxId = 'Tax ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    const vendorData: Vendor = {
      id: formData.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      status: formData.status,
      marketType: formData.marketType || 'contract',
      contact: {
        primary: formData.contact.primary,
        phone: formData.contact.phone,
        email: formData.contact.email,
        website: formData.contact.website || undefined,
      },
      address: {
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        zip: formData.address.zip,
        country: formData.address.country,
      },
      business: {
        taxId: formData.business.taxId,
        duns: formData.business.duns,
        cage: formData.business.cage,
        naics: formData.business.naics,
      },
      contracts: formData.contracts || [],
      preferences: {
        preferred: formData.preferences.preferred,
        paymentTerms: formData.preferences.paymentTerms,
        deliveryMethod: formData.preferences.deliveryMethod,
        notes: formData.preferences.notes || '',
      },
      performance: formData.performance || {
        rating: 0,
        onTimeDelivery: 0,
        qualityScore: 0,
        lastOrderDate: undefined,
      },
      createdAt: vendor?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(vendorData);
  };

  const handleInputChange = (
    field: string,
    value: string | boolean,
    subField?: string
  ) => {
    setFormData(prev => {
      if (subField) {
        const currentField = prev[field as keyof VendorFormData] as any;
        return {
          ...prev,
          [field]: {
            ...currentField,
            [subField]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });

    // Clear error when user starts typing
    if (subField) {
      const errorKey = `${field}${subField.charAt(0).toUpperCase() + subField.slice(1)}`;
      if (errors[errorKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    } else if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  const isEditMode = !!vendor?.id;
  const modalTitle = isEditMode ? 'Edit Vendor' : 'Add New Vendor';
  const submitButtonText = isProcessing 
    ? (isEditMode ? 'Updating...' : 'Creating...') 
    : (isEditMode ? 'Update Vendor' : 'Create Vendor');

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            {isEditMode ? (
              <Edit className="h-5 w-5 text-blue-600" />
            ) : (
              <Plus className="h-5 w-5 text-green-600" />
            )}
            <CardTitle className="text-xl font-semibold">{modalTitle}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter vendor name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {vendorTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Market Type *
                  </label>
                  <select
                    value={formData.marketType || 'contract'}
                    onChange={(e) => handleInputChange('marketType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="contract">Federal Contract</option>
                    <option value="open_market">Open Market</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="preferred"
                    checked={formData.preferences.preferred}
                    onChange={(e) => handleInputChange('preferences', e.target.checked, 'preferred')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="preferred" className="text-sm font-medium text-gray-700">
                    Preferred Vendor
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Contact *
                  </label>
                  <input
                    type="text"
                    value={formData.contact.primary}
                    onChange={(e) => handleInputChange('contact', e.target.value, 'primary')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactPrimary ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contact person name"
                  />
                  {errors.contactPrimary && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPrimary}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleInputChange('contact', e.target.value, 'phone')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact', e.target.value, 'email')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contact@vendor.com"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.contact.website || ''}
                    onChange={(e) => handleInputChange('contact', e.target.value, 'website')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.vendor.com"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address', e.target.value, 'street')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.addressStreet ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Business Street"
                  />
                  {errors.addressStreet && (
                    <p className="mt-1 text-sm text-red-600">{errors.addressStreet}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address', e.target.value, 'city')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.addressCity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Springfield"
                  />
                  {errors.addressCity && (
                    <p className="mt-1 text-sm text-red-600">{errors.addressCity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address', e.target.value, 'state')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.addressState ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="IL"
                  />
                  {errors.addressState && (
                    <p className="mt-1 text-sm text-red-600">{errors.addressState}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.address.zip}
                    onChange={(e) => handleInputChange('address', e.target.value, 'zip')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.addressZip ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="62704"
                  />
                  {errors.addressZip && (
                    <p className="mt-1 text-sm text-red-600">{errors.addressZip}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange('address', e.target.value, 'country')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="USA"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID *
                  </label>
                  <input
                    type="text"
                    value={formData.business.taxId}
                    onChange={(e) => handleInputChange('business', e.target.value, 'taxId')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.businessTaxId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="12-3456789"
                  />
                  {errors.businessTaxId && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessTaxId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DUNS Number
                  </label>
                  <input
                    type="text"
                    value={formData.business.duns}
                    onChange={(e) => handleInputChange('business', e.target.value, 'duns')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="80-123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CAGE Code
                  </label>
                  <input
                    type="text"
                    value={formData.business.cage}
                    onChange={(e) => handleInputChange('business', e.target.value, 'cage')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1A2B3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NAICS Code
                  </label>
                  <input
                    type="text"
                    value={formData.business.naics}
                    onChange={(e) => handleInputChange('business', e.target.value, 'naics')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="453210"
                  />
                </div>
              </div>
            </div>

            {/* Contract Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Federal Contracts</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newContract = {
                      contractNumber: '',
                      contractType: 'GSA' as const,
                      beginDate: new Date(),
                      endDate: new Date(),
                      status: 'active' as const,
                      description: '',
                    };
                    setFormData(prev => ({
                      ...prev,
                      contracts: [...(prev.contracts || []), newContract]
                    }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contract
                </Button>
              </div>
              
              {formData.contracts && formData.contracts.length > 0 ? (
                <div className="space-y-4">
                  {formData.contracts.map((contract, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Contract {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              contracts: prev.contracts?.filter((_, i) => i !== index) || []
                            }));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contract Number
                          </label>
                          <input
                            type="text"
                            value={contract.contractNumber || ''}
                            onChange={(e) => {
                              const newContracts = [...(formData.contracts || [])];
                              newContracts[index] = { ...contract, contractNumber: e.target.value };
                              setFormData(prev => ({ ...prev, contracts: newContracts }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="GS-07F-1234A"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contract Type
                          </label>
                          <select
                            value={contract.contractType || 'GSA'}
                            onChange={(e) => {
                              const newContracts = [...(formData.contracts || [])];
                              newContracts[index] = { ...contract, contractType: e.target.value as any };
                              setFormData(prev => ({ ...prev, contracts: newContracts }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="GSA">GSA Schedule</option>
                            <option value="IDIQ">IDIQ</option>
                            <option value="BPA">BPA</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Begin Date
                          </label>
                          <input
                            type="date"
                            value={contract.beginDate ? contract.beginDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const newContracts = [...(formData.contracts || [])];
                              newContracts[index] = { ...contract, beginDate: new Date(e.target.value) };
                              setFormData(prev => ({ ...prev, contracts: newContracts }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={contract.endDate ? contract.endDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const newContracts = [...(formData.contracts || [])];
                              newContracts[index] = { ...contract, endDate: new Date(e.target.value) };
                              setFormData(prev => ({ ...prev, contracts: newContracts }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={contract.status || 'active'}
                            onChange={(e) => {
                              const newContracts = [...(formData.contracts || [])];
                              newContracts[index] = { ...contract, status: e.target.value as any };
                              setFormData(prev => ({ ...prev, contracts: newContracts }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="pending">Pending</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={contract.description || ''}
                            onChange={(e) => {
                              const newContracts = [...(formData.contracts || [])];
                              newContracts[index] = { ...contract, description: e.target.value };
                              setFormData(prev => ({ ...prev, contracts: newContracts }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            placeholder="Contract description or scope of work..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No federal contracts added yet.</p>
                  <p className="text-sm">Click "Add Contract" to add federal government contracts.</p>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={formData.preferences.paymentTerms}
                    onChange={(e) => handleInputChange('preferences', e.target.value, 'paymentTerms')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentTermsOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Method
                  </label>
                  <select
                    value={formData.preferences.deliveryMethod}
                    onChange={(e) => handleInputChange('preferences', e.target.value, 'deliveryMethod')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {deliveryMethodOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.preferences.notes || ''}
                    onChange={(e) => handleInputChange('preferences', e.target.value, 'notes')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Additional notes about this vendor..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{submitButtonText}</span>
                  </div>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
