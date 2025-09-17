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
import { UserRole, User } from '@/lib/types';
import { X, UserPlus, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

// Extended user type for form purposes
interface UserFormData extends Partial<User> {
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  approvalLimit: number;
  status?: 'active' | 'inactive';
  phone?: string;
  department?: string;
  title?: string;
  lastLogin?: Date | null;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: User) => void;
  user?: User | null;
  isProcessing?: boolean;
}

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'requester',
    label: 'Requester',
    description: 'Can create and manage requests',
  },
  {
    value: 'approver',
    label: 'Approver',
    description: 'Can approve/deny requests',
  },
  {
    value: 'cardholder',
    label: 'Cardholder',
    description: 'Can purchase and reconcile',
  },
  {
    value: 'auditor',
    label: 'Auditor',
    description: 'Can view audit logs',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full system access',
  },
];

const organizationOptions = [
  { value: 'org_cdc', label: 'CDC Organization' },
  { value: 'org_mwr', label: 'MWR Organization' },
  { value: 'org_navy', label: 'Navy Organization' },
  { value: 'org_army', label: 'Army Organization' },
];

export function UserModal({ isOpen, onClose, onSave, user, isProcessing = false }: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'requester',
    orgId: 'org_cdc',
    approvalLimit: 0,
    phone: '',
    department: '',
    title: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        approvalLimit: user.approvalLimit || 0,
        phone: '',
        department: '',
        title: '',
        status: 'active',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: null,
      });
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        role: 'requester',
        orgId: 'org_cdc',
        approvalLimit: 0,
        phone: '',
        department: '',
        title: '',
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.orgId) {
      newErrors.orgId = 'Organization is required';
    }

    if (formData.role === 'approver' && (formData.approvalLimit ?? 0) <= 0) {
      newErrors.approvalLimit = 'Approval limit must be greater than 0 for approvers';
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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

    // Convert form data to User type
    const userData: User = {
      id: formData.id || '',
      name: formData.name,
      email: formData.email,
      role: formData.role,
      orgId: formData.orgId,
      approvalLimit: formData.approvalLimit,
      createdAt: formData.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(userData);
  };

  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) {
    return null;
  }
  const isEditMode = !!user?.id;
  const modalTitle = isEditMode ? 'Edit User' : 'Add New User';
  const submitButtonText = isProcessing 
    ? (isEditMode ? 'Updating...' : 'Creating...') 
    : (isEditMode ? 'Update User' : 'Create User');

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-semibold">
              {modalTitle}
            </CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Update user information and permissions'
                : 'Create a new user account with role assignment'
              }
            </CardDescription>
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
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter department"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter job title"
                />
              </div>
            </div>

            {/* Role and Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Role and Permissions</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.role ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  {roleOptions.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization *
                </label>
                <select
                  value={formData.orgId}
                  onChange={(e) => handleInputChange('orgId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.orgId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  {organizationOptions.map(org => (
                    <option key={org.value} value={org.value}>
                      {org.label}
                    </option>
                  ))}
                </select>
                {errors.orgId && (
                  <p className="mt-1 text-sm text-red-600">{errors.orgId}</p>
                )}
              </div>

              {formData.role === 'approver' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approval Limit ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.approvalLimit}
                    onChange={(e) => handleInputChange('approvalLimit', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.approvalLimit ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter approval limit"
                    min="0"
                    step="100"
                  />
                  {errors.approvalLimit && (
                    <p className="mt-1 text-sm text-red-600">{errors.approvalLimit}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Maximum amount this user can approve for requests
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
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
                className="min-w-[120px]"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {submitButtonText}
                  </div>
                ) : (
                  <div className="flex items-center">
                    {isEditMode ? (
                      <Edit className="h-4 w-4 mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    {submitButtonText}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
