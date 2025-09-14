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
import { PurchaseOrderDetails } from '@/components/ui/purchase-order-details';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PurchaseOrder } from '@/lib/types';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Mail,
  Truck,
  Package,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for purchase orders
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    reqId: 'req-001',
    poNumber: 'PO-2024-001',
    vendor: {
      name: 'Home Depot',
      address: '123 Main Street',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      phone: 'Contact Phone',
      email: 'orders@homedepot.com',
      taxId: '12-3456789',
    },
    cardholder: {
      id: 'cardholder-1',
      name: 'Bob Johnson',
      email: 'bob.johnson@mwr.com',
      cardNumber: '****1234',
      cardType: 'Government Purchase Card',
    },
    delivery: {
      address: '456 Military Base Road',
      city: 'Base City',
      state: 'CA',
      zip: '98765',
      contactName: 'John Smith',
      contactPhone: '(555) 987-6543',
      specialInstructions: 'Deliver to Building A, Room 101',
    },
    terms: {
      paymentTerms: 'Net 30',
      shippingTerms: 'FOB Destination',
      deliveryDate: new Date('2024-02-15'),
      warranty: '1 Year Manufacturer Warranty',
    },
    items: [
      {
        sku: 'HD-001',
        desc: 'Office Chairs (Set of 4)',
        qty: 4,
        estUnitPrice: 150.0,
      },
      {
        sku: 'HD-002',
        desc: 'Desk Lamps',
        qty: 2,
        estUnitPrice: 45.0,
      },
    ],
    subtotal: 690.0,
    tax: 55.2,
    shipping: 25.0,
    total: 770.2,
    status: 'sent',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    sentAt: new Date('2024-01-16'),
  },
  {
    id: 'po-002',
    reqId: 'req-002',
    poNumber: 'PO-2024-002',
    vendor: {
      name: 'Office Depot',
      address: '789 Business Blvd',
      city: 'Commerce City',
      state: 'CA',
      zip: '54321',
      phone: '(555) 456-7890',
      email: 'orders@officedepot.com',
      taxId: '98-7654321',
    },
    cardholder: {
      id: 'cardholder-1',
      name: 'Bob Johnson',
      email: 'bob.johnson@mwr.com',
      cardNumber: '****1234',
      cardType: 'Government Purchase Card',
    },
    delivery: {
      address: '456 Military Base Road',
      city: 'Base City',
      state: 'CA',
      zip: '98765',
      contactName: 'Jane Doe',
      contactPhone: '(555) 987-6543',
    },
    terms: {
      paymentTerms: 'Net 30',
      shippingTerms: 'FOB Destination',
      deliveryDate: new Date('2024-02-20'),
    },
    items: [
      {
        sku: 'OD-001',
        desc: 'Computer Accessories',
        qty: 1,
        estUnitPrice: 850.0,
      },
    ],
    subtotal: 850.0,
    tax: 68.0,
    shipping: 0.0,
    total: 918.0,
    status: 'delivered',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    sentAt: new Date('2024-01-11'),
    acknowledgedAt: new Date('2024-01-12'),
    shippedAt: new Date('2024-01-20'),
    deliveredAt: new Date('2024-01-25'),
    trackingNumber: '1Z999AA1234567890',
  },
];

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    return null;
  }

  // Check if user has cardholder permissions
  if (!user?.role || !['cardholder', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access purchase orders.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'sent':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'acknowledged':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <Package className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-gray-600 bg-gray-50';
      case 'sent':
        return 'text-blue-600 bg-blue-50';
      case 'acknowledged':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleStatusUpdate = async (poId: string, newStatus: string) => {
    setPurchaseOrders(prev =>
      prev.map(po =>
        po.id === poId
          ? {
              ...po,
              status: newStatus as any,
              updatedAt: new Date(),
              ...(newStatus === 'sent' && { sentAt: new Date() }),
              ...(newStatus === 'acknowledged' && {
                acknowledgedAt: new Date(),
              }),
              ...(newStatus === 'shipped' && { shippedAt: new Date() }),
              ...(newStatus === 'delivered' && { deliveredAt: new Date() }),
            }
          : po
      )
    );
    toast.success(`Purchase Order ${newStatus} successfully`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="mt-2 text-gray-600">
            Manage purchase orders for approved requests.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search purchase orders..."
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
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Purchase Orders List */}
        <div className="space-y-4">
          {filteredPOs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No purchase orders found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No purchase orders have been created yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPOs.map(po => (
              <Card key={po.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {po.poNumber}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(po.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              po.status
                            )}`}
                          >
                            {po.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Vendor:</span>{' '}
                          {po.vendor.name}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>{' '}
                          {formatCurrency(po.total)}
                        </div>
                        <div>
                          <span className="font-medium">Delivery:</span>{' '}
                          {formatDate(po.terms.deliveryDate)}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span>{' '}
                          {po.items.length}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>{' '}
                          {formatDate(po.createdAt)}
                        </div>
                        {po.trackingNumber && (
                          <div>
                            <span className="font-medium">Tracking:</span>{' '}
                            {po.trackingNumber}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPO(po)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Purchase Order Details Modal */}
        {selectedPO && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Purchase Order Details
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedPO(null)}>
                    Close
                  </Button>
                </div>
                <PurchaseOrderDetails
                  purchaseOrder={selectedPO}
                  onSend={() => handleStatusUpdate(selectedPO.id, 'sent')}
                  onAcknowledge={() =>
                    handleStatusUpdate(selectedPO.id, 'acknowledged')
                  }
                  onMarkShipped={() =>
                    handleStatusUpdate(selectedPO.id, 'shipped')
                  }
                  onMarkDelivered={() =>
                    handleStatusUpdate(selectedPO.id, 'delivered')
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
