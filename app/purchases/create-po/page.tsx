'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/ui/app-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Save,
  Send,
  ArrowLeft,
  Calculator,
  Building2,
  CheckCircle,
  FileText,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  nsn?: string; // National Stock Number
  partNumber?: string;
  manufacturer?: string;
  model?: string;
}

interface Vendor {
  id: string;
  name: string;
  address: string;
  contact: string;
  phone: string;
  email: string;
  business: {
    taxId: string;
    duns: string;
    cage: string;
    naics: string;
    samStatus: 'verified' | 'pending' | 'suspended' | 'ineligible';
    samVerifiedDate: Date;
    samVerificationNotes: string;
  };
}

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

// Mock vendors - All pre-verified and eligible for federal contracts
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Office Depot',
    address: '123 Business St, City, State 12345',
    contact: 'John Smith',
    phone: '(555) 123-4567',
    email: 'orders@officedepot.com',
    business: {
      taxId: '12-3456789',
      duns: '123456789',
      cage: 'ABC12',
      naics: '453210',
      samStatus: 'verified' as const,
      samVerifiedDate: new Date('2023-06-01'),
      samVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
    },
  },
  {
    id: '2',
    name: 'Home Depot',
    address: '456 Hardware Ave, City, State 12345',
    contact: 'Jane Doe',
    phone: '(555) 987-6543',
    email: 'b2b@homedepot.com',
    business: {
      taxId: '98-7654321',
      duns: '987654321',
      cage: 'XYZ98',
      naics: '444110',
      samStatus: 'verified' as const,
      samVerifiedDate: new Date('2023-07-15'),
      samVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
    },
  },
  {
    id: '3',
    name: 'Amazon Business',
    address: '789 E-commerce Blvd, City, State 12345',
    contact: 'Mike Johnson',
    phone: '(555) 456-7890',
    email: 'business@amazon.com',
    business: {
      taxId: '91-1234567',
      duns: '123456789',
      cage: 'AMZ99',
      naics: '454110',
      samStatus: 'verified' as const,
      samVerifiedDate: new Date('2023-08-01'),
      samVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
    },
  },
];

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

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const { user, loading, originalUser } = useAuth();
  
  const actualRole = originalUser?.role || user?.role;
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedInstallation, setSelectedInstallation] = useState<string>('');
  const [items, setItems] = useState<PurchaseOrderItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0, nsn: '', partNumber: '', manufacturer: '', model: '' }
  ]);
  const [poNumber, setPoNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New vendor verification state
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cage: '',
    duns: '',
    taxId: '',
  });
  const [vendorVerificationComplete, setVendorVerificationComplete] = useState(false);
  
  const [dodFields, setDodFields] = useState({
    contractNumber: '',
    contractType: 'GSA',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    deliveryContact: '',
    deliveryPhone: '',
    specialInstructions: '',
    fundingCode: '',
    costCenter: '',
    projectCode: '',
    justification: '',
    urgency: 'normal',
    securityClearance: 'none',
  });

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

  // Generate PO number
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setPoNumber(`PO-${year}${month}${day}-${random}`);
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

  // Check if user has cardholder permissions
  if (!actualRole || !['cardholder', 'admin'].includes(actualRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to create purchase orders.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      nsn: '',
      partNumber: '',
      manufacturer: '',
      model: '',
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof PurchaseOrderItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = 0; // DOD MWR is federal government - tax exempt
  const total = subtotal; // No tax for federal government

  const handleVerifyNewVendor = async () => {
    // Show manual verification prompt
    const manualVerification = await new Promise((resolve) => {
      const confirmed = window.confirm(
        `MANUAL VENDOR VERIFICATION REQUIRED\n\n` +
        `Please verify this vendor before creating purchase order:\n\n` +
        `1. Go to https://sam.gov\n` +
        `2. Search for CAGE Code: ${newVendorData.cage}\n` +
        `3. Search for DUNS: ${newVendorData.duns}\n` +
        `4. Verify vendor is ACTIVE and eligible for federal contracts\n` +
        `5. Check exclusion lists (EPLS, debarment)\n\n` +
        `Click OK if verification is successful, or Cancel to skip.`
      );
      resolve(confirmed);
    });

    if (manualVerification) {
      // Create temporary verified vendor
      const tempVendor: Vendor = {
        id: 'temp-' + Date.now(),
        name: newVendorData.name,
        address: `${newVendorData.address}, ${newVendorData.city}, ${newVendorData.state} ${newVendorData.zip}`,
        contact: newVendorData.contact,
        phone: newVendorData.phone,
        email: newVendorData.email,
        business: {
          taxId: newVendorData.taxId,
          duns: newVendorData.duns,
          cage: newVendorData.cage,
          naics: '453210',
          samStatus: 'verified' as const,
          samVerifiedDate: new Date(),
          samVerificationNotes: 'Vendor verified manually during PO creation - eligible for federal contracts',
        },
      };

      setSelectedVendor(tempVendor);
      setVendorVerificationComplete(true);
      setShowNewVendorForm(false);
      toast.success('Vendor verified successfully - ready for purchase order');
    } else {
      toast.error('Vendor verification cancelled');
    }
  };

  const handleSubmit = async (action: 'save' | 'send') => {
    if (!selectedInstallation) {
      toast.error('Please select an installation');
      return;
    }
    if (!selectedFacility) {
      toast.error('Please select a child care center');
      return;
    }
    if (!selectedVendor) {
      toast.error('Please select a vendor');
      return;
    }

    if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error('Please fill in all item details');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (action === 'save') {
        toast.success('Purchase order saved as draft');
      } else {
        toast.success('Purchase order sent to vendor');
      }
      
      router.push('/purchases');
    } catch (error) {
      toast.error('Failed to process purchase order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/purchase-orders')}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Purchase Orders
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Purchase Order</h1>
          <p className="mt-2 text-gray-600">
            Create a new purchase order for approved procurement requests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Facility Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Facility Information
                </CardTitle>
                <CardDescription>
                  Select the DOD MWR child care facility for this purchase order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="installation">Installation *</Label>
                    <Select
                      value={selectedInstallation}
                      onValueChange={(value) => {
                        setSelectedInstallation(value);
                        setSelectedFacility(null); // Reset facility when installation changes
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an installation" />
                      </SelectTrigger>
                      <SelectContent>
                        {installations.map((installation) => (
                          <SelectItem key={installation.id} value={installation.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{installation.name}</span>
                              <span className="text-sm text-gray-500">({installation.code})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="facility">Child Care Center *</Label>
                    <Select
                      value={selectedFacility?.id || ''}
                      onValueChange={(value) => {
                        const facility = mockFacilities.find(f => f.id === value);
                        setSelectedFacility(facility || null);
                      }}
                      disabled={!selectedInstallation}
                    >
                      <SelectTrigger className={!selectedInstallation ? 'bg-gray-100' : ''}>
                        <SelectValue placeholder={selectedInstallation ? "Select a child care center" : "Select installation first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedInstallation && getFacilitiesByInstallation(selectedInstallation).map((facility) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{facility.name}</span>
                              <span className="text-sm text-gray-500">{facility.code} - {facility.city}, {facility.state}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedFacility && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Selected Facility Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Director:</span> {selectedFacility.director}
                        </div>
                        <div>
                          <span className="font-medium">Capacity:</span> {selectedFacility.capacity} children
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {selectedFacility.phone}
                        </div>
                        <div>
                          <span className="font-medium">Age Groups:</span> {selectedFacility.ageGroups.join(', ')}
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Address:</span> {selectedFacility.address}, {selectedFacility.city}, {selectedFacility.state} {selectedFacility.zip}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vendor Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Vendor Information
                </CardTitle>
                <CardDescription>
                  Select the vendor for this purchase order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vendor">Vendor</Label>
                    <div className="space-y-2">
                      <Select
                        value={selectedVendor?.id || ''}
                        onValueChange={(value) => {
                          if (value === 'new-vendor') {
                            setShowNewVendorForm(true);
                          } else {
                            const vendor = mockVendors.find(v => v.id === value);
                            setSelectedVendor(vendor || null);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vendor or add new vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVendors.map(vendor => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                              {vendor.name} (Verified)
                            </SelectItem>
                          ))}
                          <SelectItem value="new-vendor">
                            + Add New Vendor (Requires Verification)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {selectedVendor && (
                        <div className="text-xs text-green-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Pre-verified vendor - ready for purchase
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedVendor && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{selectedVendor.name}</h4>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          SAM Verified
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{selectedVendor.address}</p>
                        <p>Contact: {selectedVendor.contact}</p>
                        <p>Phone: {selectedVendor.phone}</p>
                        <p>Email: {selectedVendor.email}</p>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="font-medium text-gray-700">Federal Registration:</p>
                          <p>CAGE Code: {selectedVendor.business.cage}</p>
                          <p>DUNS: {selectedVendor.business.duns}</p>
                          <p>Verified: {selectedVendor.business.samVerifiedDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* New Vendor Verification Form */}
            {showNewVendorForm && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-900">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    New Vendor Verification Required
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    You must verify this vendor before creating a purchase order. This ensures compliance with federal acquisition regulations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-2">Manual Verification Required</h4>
                    <p className="text-sm text-yellow-800">
                      Before proceeding, you must manually verify this vendor in SAM.gov and check exclusion lists. 
                      This is required for all new vendors to ensure federal compliance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newVendorName">Vendor Name *</Label>
                      <Input
                        id="newVendorName"
                        value={newVendorData.name}
                        onChange={(e) => setNewVendorData({...newVendorData, name: e.target.value})}
                        placeholder="Enter vendor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newVendorContact">Contact Person *</Label>
                      <Input
                        id="newVendorContact"
                        value={newVendorData.contact}
                        onChange={(e) => setNewVendorData({...newVendorData, contact: e.target.value})}
                        placeholder="Contact person name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newVendorCage">CAGE Code *</Label>
                      <Input
                        id="newVendorCage"
                        value={newVendorData.cage}
                        onChange={(e) => setNewVendorData({...newVendorData, cage: e.target.value})}
                        placeholder="Enter CAGE code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newVendorDuns">DUNS Number *</Label>
                      <Input
                        id="newVendorDuns"
                        value={newVendorData.duns}
                        onChange={(e) => setNewVendorData({...newVendorData, duns: e.target.value})}
                        placeholder="Enter DUNS number"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleVerifyNewVendor}
                      disabled={!newVendorData.name || !newVendorData.cage || !newVendorData.duns}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Vendor Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewVendorForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Items
                  </span>
                  <Button onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardTitle>
                <CardDescription>
                  Add items to this purchase order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Basic Item Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <Label htmlFor={`description-${item.id}`}>Item Description *</Label>
                          <Input
                            id={`description-${item.id}`}
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Detailed item description"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`manufacturer-${item.id}`}>Manufacturer</Label>
                          <Input
                            id={`manufacturer-${item.id}`}
                            value={item.manufacturer || ''}
                            onChange={(e) => updateItem(item.id, 'manufacturer', e.target.value)}
                            placeholder="Manufacturer name"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`model-${item.id}`}>Model Number</Label>
                          <Input
                            id={`model-${item.id}`}
                            value={item.model || ''}
                            onChange={(e) => updateItem(item.id, 'model', e.target.value)}
                            placeholder="Model/part number"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`nsn-${item.id}`}>NSN (National Stock Number)</Label>
                          <Input
                            id={`nsn-${item.id}`}
                            value={item.nsn || ''}
                            onChange={(e) => updateItem(item.id, 'nsn', e.target.value)}
                            placeholder="XXXX-XX-XXX-XXXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`partNumber-${item.id}`}>Part Number</Label>
                          <Input
                            id={`partNumber-${item.id}`}
                            value={item.partNumber || ''}
                            onChange={(e) => updateItem(item.id, 'partNumber', e.target.value)}
                            placeholder="Vendor part number"
                          />
                        </div>
                      </div>

                      {/* Quantity and Pricing */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor={`quantity-${item.id}`}>Quantity *</Label>
                          <Input
                            id={`quantity-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`unitPrice-${item.id}`}>Unit Price *</Label>
                          <Input
                            id={`unitPrice-${item.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Total</Label>
                          <div className="px-3 py-2 bg-gray-50 rounded-md text-sm font-medium">
                            {formatCurrency(item.total)}
                          </div>
                        </div>
                        <div>
                          <Label>Unit of Measure</Label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="EA">Each (EA)</option>
                            <option value="BX">Box (BX)</option>
                            <option value="CS">Case (CS)</option>
                            <option value="PK">Pack (PK)</option>
                            <option value="FT">Foot (FT)</option>
                            <option value="YD">Yard (YD)</option>
                            <option value="LB">Pound (LB)</option>
                            <option value="KG">Kilogram (KG)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* DOD MWR Specific Fields */}
            <Card>
              <CardHeader>
                <CardTitle>DOD MWR Required Information</CardTitle>
                <CardDescription>
                  Federal government procurement requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contract Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contract Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contractNumber">Contract Number</Label>
                      <Input
                        id="contractNumber"
                        value={dodFields.contractNumber}
                        onChange={(e) => setDodFields({...dodFields, contractNumber: e.target.value})}
                        placeholder="GS-07F-1234A"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contractType">Contract Type</Label>
                      <select
                        id="contractType"
                        value={dodFields.contractType}
                        onChange={(e) => setDodFields({...dodFields, contractType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="GSA">GSA Schedule</option>
                        <option value="IDIQ">IDIQ</option>
                        <option value="BPA">BPA</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Delivery Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                      <Input
                        id="deliveryAddress"
                        value={dodFields.deliveryAddress}
                        onChange={(e) => setDodFields({...dodFields, deliveryAddress: e.target.value})}
                        placeholder="Building, Street Address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryCity">City *</Label>
                      <Input
                        id="deliveryCity"
                        value={dodFields.deliveryCity}
                        onChange={(e) => setDodFields({...dodFields, deliveryCity: e.target.value})}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryState">State *</Label>
                      <Input
                        id="deliveryState"
                        value={dodFields.deliveryState}
                        onChange={(e) => setDodFields({...dodFields, deliveryState: e.target.value})}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryZip">ZIP Code *</Label>
                      <Input
                        id="deliveryZip"
                        value={dodFields.deliveryZip}
                        onChange={(e) => setDodFields({...dodFields, deliveryZip: e.target.value})}
                        placeholder="12345"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryContact">Delivery Contact *</Label>
                      <Input
                        id="deliveryContact"
                        value={dodFields.deliveryContact}
                        onChange={(e) => setDodFields({...dodFields, deliveryContact: e.target.value})}
                        placeholder="Contact person name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryPhone">Contact Phone *</Label>
                      <Input
                        id="deliveryPhone"
                        value={dodFields.deliveryPhone}
                        onChange={(e) => setDodFields({...dodFields, deliveryPhone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Funding and Project Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Funding & Project Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fundingCode">Funding Code *</Label>
                      <Input
                        id="fundingCode"
                        value={dodFields.fundingCode}
                        onChange={(e) => setDodFields({...dodFields, fundingCode: e.target.value})}
                        placeholder="e.g., 1234"
                      />
                    </div>
                    <div>
                      <Label htmlFor="costCenter">Cost Center *</Label>
                      <Input
                        id="costCenter"
                        value={dodFields.costCenter}
                        onChange={(e) => setDodFields({...dodFields, costCenter: e.target.value})}
                        placeholder="e.g., CC001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectCode">Project Code</Label>
                      <Input
                        id="projectCode"
                        value={dodFields.projectCode}
                        onChange={(e) => setDodFields({...dodFields, projectCode: e.target.value})}
                        placeholder="e.g., PROJ-2024-001"
                      />
                    </div>
                  </div>
                </div>

                {/* Justification and Urgency */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Justification & Urgency</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="justification">Justification for Purchase *</Label>
                      <Textarea
                        id="justification"
                        value={dodFields.justification}
                        onChange={(e) => setDodFields({...dodFields, justification: e.target.value})}
                        placeholder="Explain why this purchase is necessary..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <select
                          id="urgency"
                          value={dodFields.urgency}
                          onChange={(e) => setDodFields({...dodFields, urgency: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="normal">Normal</option>
                          <option value="urgent">Urgent</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="securityClearance">Security Clearance Required</Label>
                        <select
                          id="securityClearance"
                          value={dodFields.securityClearance}
                          onChange={(e) => setDodFields({...dodFields, securityClearance: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="none">None</option>
                          <option value="confidential">Confidential</option>
                          <option value="secret">Secret</option>
                          <option value="top-secret">Top Secret</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <Label htmlFor="specialInstructions">Special Delivery Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={dodFields.specialInstructions}
                    onChange={(e) => setDodFields({...dodFields, specialInstructions: e.target.value})}
                    placeholder="Any special delivery requirements, access codes, or instructions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
                <CardDescription>
                  Add any special instructions or notes for this purchase order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any special instructions or notes..."
                  rows={4}
                />
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">
                        <strong>Tax-Exempt Purchase:</strong> This purchase order is for DOD MWR, a federal government entity, and is therefore tax-exempt under FAR 52.229-1 (State and Local Taxes) and Internal Revenue Code Section 5000.
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        <strong>Reference:</strong> Federal Acquisition Regulation (FAR) 52.229-1 - Federal government entities are exempt from state and local taxes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* PO Details */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">PO Number</Label>
                  <p className="text-lg font-semibold">{poNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date</Label>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created By</Label>
                  <p>{user?.name || user?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Tax (Federal Exempt):</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  * DOD MWR purchases are tax-exempt as federal government entity
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    onClick={() => handleSubmit('save')}
                    disabled={isSubmitting || !selectedVendor}
                    className="w-full"
                    variant="outline"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit('send')}
                    disabled={isSubmitting || !selectedVendor}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send to Vendor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
