'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { AppHeader } from '@/components/ui/app-header';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  X,
  Download,
  Edit,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data - in real app this would come from API
const mockRequests = [
  {
    id: '1',
    vendor: 'Home Depot',
    total: 1250.0,
    status: 'AO Review' as const,
    createdAt: new Date('2024-01-15'),
    needBy: new Date('2024-01-20'),
    justification: 'Office supplies for MWR facility',
    facility: {
      id: '1',
      name: 'Fort Bragg Child Development Center',
      code: 'FB-CDC-001',
    },
    items: [
      {
        id: 'item-1',
        sku: 'HD-001',
        desc: 'Ergonomic Office Chairs (Set of 4)',
        qty: 4,
        estUnitPrice: 125.0,
        lineTotal: 500.0,
      },
      {
        id: 'item-2',
        sku: 'HD-002',
        desc: 'Adjustable Height Desks (Set of 2)',
        qty: 2,
        estUnitPrice: 275.0,
        lineTotal: 550.0,
      },
      {
        id: 'item-3',
        sku: 'HD-003',
        desc: 'LED Desk Lamps with USB Ports',
        qty: 4,
        estUnitPrice: 50.0,
        lineTotal: 200.0,
      },
    ],
  },
  {
    id: '2',
    vendor: 'Office Depot',
    total: 450.0,
    status: 'Purchased' as const,
    createdAt: new Date('2024-01-14'),
    needBy: new Date('2024-01-18'),
    justification: 'Computer equipment for new workstations',
    facility: {
      id: '2',
      name: 'Camp Lejeune Early Learning Center',
      code: 'CL-ELC-002',
    },
    items: [
      {
        id: 'item-4',
        sku: 'OD-001',
        desc: 'Wireless Mouse and Keyboard Combo',
        qty: 2,
        estUnitPrice: 45.0,
        lineTotal: 90.0,
      },
      {
        id: 'item-5',
        sku: 'OD-002',
        desc: '24" LED Monitor with HDMI',
        qty: 2,
        estUnitPrice: 180.0,
        lineTotal: 360.0,
      },
    ],
  },
  {
    id: '3',
    vendor: "Lowe's",
    total: 2100.0,
    status: 'Draft' as const,
    createdAt: new Date('2024-01-13'),
    needBy: new Date('2024-01-25'),
    justification: 'Maintenance supplies for facility repairs',
    facility: {
      id: '3',
      name: 'Norfolk Naval Station CDC',
      code: 'NN-CDC-003',
    },
    items: [
      {
        id: 'item-6',
        sku: 'LOW-001',
        desc: 'Paint - Interior Latex, White, 1 Gallon',
        qty: 6,
        estUnitPrice: 35.0,
        lineTotal: 210.0,
      },
      {
        id: 'item-7',
        sku: 'LOW-002',
        desc: 'Paint Brushes - Assorted Sizes (Set of 12)',
        qty: 2,
        estUnitPrice: 25.0,
        lineTotal: 50.0,
      },
      {
        id: 'item-8',
        sku: 'LOW-003',
        desc: 'Drop Cloths - Canvas, 9x12 ft',
        qty: 4,
        estUnitPrice: 15.0,
        lineTotal: 60.0,
      },
      {
        id: 'item-9',
        sku: 'LOW-004',
        desc: 'Caulk - Silicone, White, 10.1 oz',
        qty: 8,
        estUnitPrice: 8.5,
        lineTotal: 68.0,
      },
      {
        id: 'item-10',
        sku: 'LOW-005',
        desc: 'Light Fixtures - LED Ceiling Mount, 12"',
        qty: 6,
        estUnitPrice: 285.0,
        lineTotal: 1710.0,
      },
    ],
  },
  {
    id: '4',
    vendor: 'Amazon Business',
    total: 850.0,
    status: 'Approved' as const,
    createdAt: new Date('2024-01-12'),
    needBy: new Date('2024-01-22'),
    justification: 'Software licenses for productivity tools',
    items: [
      {
        id: 'item-11',
        sku: 'AMZ-001',
        desc: 'Microsoft Office 365 Business Premium (1 Year)',
        qty: 5,
        estUnitPrice: 150.0,
        lineTotal: 750.0,
      },
      {
        id: 'item-12',
        sku: 'AMZ-002',
        desc: 'Adobe Creative Cloud for Teams (1 Year)',
        qty: 2,
        estUnitPrice: 50.0,
        lineTotal: 100.0,
      },
    ],
  },
  {
    id: '5',
    vendor: 'Staples',
    total: 320.0,
    status: 'Reconciled' as const,
    createdAt: new Date('2024-01-10'),
    needBy: new Date('2024-01-15'),
    justification: 'Office furniture for conference room',
    items: [
      {
        id: 'item-13',
        sku: 'STP-001',
        desc: 'Conference Table - 8ft Rectangular, Oak Finish',
        qty: 1,
        estUnitPrice: 200.0,
        lineTotal: 200.0,
      },
      {
        id: 'item-14',
        sku: 'STP-002',
        desc: 'Conference Chairs - Mesh Back, Black (Set of 8)',
        qty: 1,
        estUnitPrice: 120.0,
        lineTotal: 120.0,
      },
    ],
  },
  {
    id: '6',
    vendor: 'Grainger Industrial Supply',
    total: 3425.5,
    status: 'Submitted' as const,
    createdAt: new Date('2024-01-16'),
    needBy: new Date('2024-01-30'),
    justification: 'Safety equipment and tools for MWR maintenance department',
    items: [
      {
        id: 'item-15',
        sku: 'GRA-001',
        desc: 'Safety Hard Hats - ANSI Z89.1 Type I Class C',
        qty: 12,
        estUnitPrice: 25.5,
        lineTotal: 306.0,
      },
      {
        id: 'item-16',
        sku: 'GRA-002',
        desc: 'Safety Glasses - Clear Lens, Anti-Fog',
        qty: 24,
        estUnitPrice: 8.75,
        lineTotal: 210.0,
      },
      {
        id: 'item-17',
        sku: 'GRA-003',
        desc: 'Work Gloves - Cut Resistant, Size Large',
        qty: 20,
        estUnitPrice: 12.0,
        lineTotal: 240.0,
      },
      {
        id: 'item-18',
        sku: 'GRA-004',
        desc: 'Steel Toe Boots - Composite Toe, Size 10',
        qty: 8,
        estUnitPrice: 85.0,
        lineTotal: 680.0,
      },
      {
        id: 'item-19',
        sku: 'GRA-005',
        desc: 'Tool Set - 150 Piece Mechanics Set',
        qty: 2,
        estUnitPrice: 450.0,
        lineTotal: 900.0,
      },
      {
        id: 'item-20',
        sku: 'GRA-006',
        desc: 'Cordless Drill - 20V Lithium Ion',
        qty: 4,
        estUnitPrice: 125.0,
        lineTotal: 500.0,
      },
      {
        id: 'item-21',
        sku: 'GRA-007',
        desc: 'Extension Cords - 25ft, 12 AWG, Yellow',
        qty: 6,
        estUnitPrice: 35.0,
        lineTotal: 210.0,
      },
      {
        id: 'item-22',
        sku: 'GRA-008',
        desc: 'First Aid Kit - Industrial, 50 Person',
        qty: 2,
        estUnitPrice: 89.5,
        lineTotal: 179.0,
      },
      {
        id: 'item-23',
        sku: 'GRA-009',
        desc: 'Fire Extinguisher - ABC Dry Chemical, 5lb',
        qty: 4,
        estUnitPrice: 45.0,
        lineTotal: 180.0,
      },
      {
        id: 'item-24',
        sku: 'GRA-010',
        desc: 'Ladder - 6ft Step Ladder, Fiberglass',
        qty: 2,
        estUnitPrice: 120.0,
        lineTotal: 240.0,
      },
    ],
  },
];

export default function RequestsPage() {
  console.log('RequestsPage component rendered');
  const router = useRouter();
  const { user, loading, originalUser } = useAuth();
  
  // Use original user role for debugging
  const actualRole = originalUser?.role || user?.role;
  console.log('RequestsPage - User:', user?.email, 'Actual Role:', actualRole, 'Effective Role:', user?.role);
  const [requests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<Record<string, unknown> | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.justification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.facility?.name && request.facility.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' || request.status === statusFilter;
    const matchesFacility =
      facilityFilter === 'all' || request.facility?.id === facilityFilter;
    return matchesSearch && matchesStatus && matchesFacility;
  });

  const statusCounts = requests.reduce(
    (acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
                <p className="mt-2 text-gray-600">
                  Manage your procurement requests
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/requests/new')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft ({statusCounts.Draft || 0})</option>
                <option value="Submitted">
                  Submitted ({statusCounts.Submitted || 0})
                </option>
                <option value="AO Review">
                  AO Review ({statusCounts['AO Review'] || 0})
                </option>
                <option value="Approved">
                  Approved ({statusCounts.Approved || 0})
                </option>
                <option value="Purchased">
                  Purchased ({statusCounts.Purchased || 0})
                </option>
                <option value="Reconciled">
                  Reconciled ({statusCounts.Reconciled || 0})
                </option>
              </select>
              <select
                value={facilityFilter}
                onChange={e => setFacilityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Facilities</option>
                <option value="1">Fort Bragg CDC</option>
                <option value="2">Camp Lejeune ELC</option>
                <option value="3">Norfolk Naval CDC</option>
                <option value="4">San Diego Naval CDC</option>
                <option value="5">JBLM CDC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">No requests found</p>
                <p className="text-gray-400 mt-2">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first request to get started'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map(request => (
              <Card
                key={request.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.vendor}
                        </h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-gray-600 mb-2">
                        {request.justification}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>Created: {formatDate(request.createdAt)}</span>
                        <span>Need by: {formatDate(request.needBy)}</span>
                        <span className="font-medium text-gray-900">
                          Total: {formatCurrency(request.total)}
                        </span>
                      </div>
                      {request.facility && (
                        <div className="mt-2 text-sm text-blue-600">
                          <span className="font-medium">Facility:</span> {request.facility.name} ({request.facility.code})
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View Details
                      </Button>
                      {request.status === 'Draft' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            // TODO: Navigate to edit request
                            toast('Edit request coming soon');
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Request #{selectedRequest.id as string}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Close</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Request Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Request Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Vendor
                          </label>
                          <p className="text-gray-900">
                            {selectedRequest.vendor as string}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Need By Date
                          </label>
                          <p className="text-gray-900">
                            {formatDate(selectedRequest.needBy as string)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Status
                          </label>
                          <div className="mt-1">
                            <StatusBadge status={selectedRequest.status as any} />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Total Amount
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(selectedRequest.total as number)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Justification
                        </label>
                        <p className="text-gray-900 mt-1">
                          {selectedRequest.justification as string}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mock Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <span className="font-medium text-gray-900">
                                HD-001
                              </span>
                              <span className="text-gray-600">
                                Office Supplies
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Qty: 1 × {formatCurrency(selectedRequest.total as number)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(selectedRequest.total as number)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedRequest.status === 'Draft' && (
                        <Button className="w-full" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Request
                        </Button>
                      )}
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Request Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Request Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Request ID
                        </label>
                        <p className="text-gray-900">#{selectedRequest.id as string}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Created Date
                        </label>
                        <p className="text-gray-900">
                          {formatDate(selectedRequest.createdAt as string)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
