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

interface Organization {
  id: string;
  name: string;
  code: string;
  users: number;
  status: 'active' | 'inactive';
  description?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact?: {
    primary: string;
    phone: string;
    email: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrganizationFormData extends Partial<Organization> {
  name: string;
  code: string;
  users: number;
  status: 'active' | 'inactive';
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact: {
    primary: string;
    phone: string;
    email: string;
  };
}

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (organizationData: Organization) => void;
  organization?: Organization | null;
  isProcessing?: boolean;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export function OrganizationModal({
  isOpen,
  onClose,
  onSave,
  organization,
  isProcessing = false,
}: OrganizationModalProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    code: '',
    users: 0,
    status: 'active',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    },
    contact: {
      primary: '',
      phone: '',
      email: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (organization) {
      setFormData({
        id: organization.id,
        name: organization.name,
        code: organization.code,
        users: organization.users,
        status: organization.status,
        description: organization.description || '',
        address: {
          street: organization.address?.street || '',
          city: organization.address?.city || '',
          state: organization.address?.state || '',
          zip: organization.address?.zip || '',
          country: organization.address?.country || 'USA',
        },
        contact: {
          primary: organization.contact?.primary || '',
          phone: organization.contact?.phone || '',
          email: organization.contact?.email || '',
        },
      });
    } else {
      setFormData({
        name: '',
        code: '',
        users: 0,
        status: 'active',
        description: '',
        address: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'USA',
        },
        contact: {
          primary: '',
          phone: '',
          email: '',
        },
      });
    }
    setErrors({});
  }, [organization, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Organization code is required';
    }

    if (formData.users < 0) {
      newErrors.users = 'User count cannot be negative';
    }

    if (formData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.contact.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.contact.phone)) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    const organizationData: Organization = {
      id: formData.id || Date.now().toString(),
      name: formData.name.trim(),
      code: formData.code.trim(),
      users: formData.users,
      status: formData.status,
      description: formData.description.trim() || undefined,
      address: {
        street: formData.address.street.trim(),
        city: formData.address.city.trim(),
        state: formData.address.state.trim(),
        zip: formData.address.zip.trim(),
        country: formData.address.country.trim(),
      },
      contact: {
        primary: formData.contact.primary.trim(),
        phone: formData.contact.phone.trim(),
        email: formData.contact.email.trim(),
      },
      createdAt: organization?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(organizationData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof OrganizationFormData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (!isOpen) {
    return null;
  }

  const isEditMode = !!organization?.id;
  const modalTitle = isEditMode ? 'Edit Organization' : 'Add New Organization';
  const submitButtonText = isProcessing 
    ? (isEditMode ? 'Updating...' : 'Creating...') 
    : (isEditMode ? 'Update Organization' : 'Create Organization');

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
          <div>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              {modalTitle}
            </CardTitle>
            <CardDescription>
              {isEditMode ? 'Update organization information' : 'Add a new organization to the system'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter organization name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter organization code"
                  />
                  {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Count
                  </label>
                  <input
                    type="number"
                    value={formData.users}
                    onChange={(e) => handleInputChange('users', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.users ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.users && <p className="text-red-500 text-xs mt-1">{errors.users}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter organization description"
                  rows={3}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Contact
                  </label>
                  <input
                    type="text"
                    value={formData.contact.primary}
                    onChange={(e) => handleInputChange('contact.primary', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contact person name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contact@organization.com"
                  />
                  {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.address.zip}
                    onChange={(e) => handleInputChange('address.zip', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {submitButtonText}
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
