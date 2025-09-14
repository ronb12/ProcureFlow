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
import { StatusBadge } from '@/components/ui/status-badge';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RequestStatus } from '@/lib/types';
import {
  CreditCard,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  ShoppingCart,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for cardholder purchases
const mockPurchases = [
  {
    id: '1',
    requestId: '1',
    vendor: 'Home Depot',
    total: 1250.0,
    status: 'Cardholder Purchasing' as RequestStatus,
    createdAt: new Date('2024-01-15'),
    needBy: new Date('2024-01-20'),
    items: [
      { name: 'Office Chairs (Set of 4)', qty: 4, price: 150.0 },
      { name: 'Desk Lamps', qty: 2, price: 45.0 },
      { name: 'Storage Bins', qty: 10, price: 12.0 },
    ],
    requester: {
      name: 'Jane Doe',
      email: 'jane.doe@mwr.com',
    },
    cardNumber: '****1234',
    purchaseDate: null,
    receipt: null,
  },
  {
    id: '2',
    requestId: '2',
    vendor: 'Office Depot',
    total: 850.0,
    status: 'Purchased' as RequestStatus,
    createdAt: new Date('2024-01-16'),
    needBy: new Date('2024-01-25'),
    items: [{ name: 'Computer Accessories', qty: 1, price: 850.0 }],
    requester: {
      name: 'Bob Smith',
      email: 'bob.smith@mwr.com',
    },
    cardNumber: '****1234',
    purchaseDate: new Date('2024-01-18'),
    receipt: {
      name: 'receipt_office_depot.pdf',
      size: '245 KB',
      uploadedAt: new Date('2024-01-18'),
    },
  },
  {
    id: '3',
    requestId: '3',
    vendor: 'Amazon Business',
    total: 2400.0,
    status: 'Reconciled' as RequestStatus,
    createdAt: new Date('2024-01-17'),
    needBy: new Date('2024-02-01'),
    items: [{ name: 'Software Licenses', qty: 1, price: 2400.0 }],
    requester: {
      name: 'Alice Johnson',
      email: 'alice.johnson@mwr.com',
    },
    cardNumber: '****1234',
    purchaseDate: new Date('2024-01-19'),
    receipt: {
      name: 'receipt_amazon.pdf',
      size: '312 KB',
      uploadedAt: new Date('2024-01-19'),
    },
  },
];

export default function PurchasesPage() {
  const router = useRouter();
  const { user, loading, originalUser } = useAuth();
  
  // Use original user role for access control, not debug role
  const actualRole = originalUser?.role || user?.role;
  const [purchases, setPurchases] = useState(mockPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

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

  // Check if user has cardholder permissions
  if (!actualRole || !['cardholder', 'admin'].includes(actualRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the purchases page.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handlePurchaseAction = async (
    purchaseId: string,
    action: 'mark_purchased' | 'upload_receipt' | 'reconcile'
  ) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (action === 'mark_purchased') {
        setPurchases(prev =>
          prev.map(purchase =>
            purchase.id === purchaseId
              ? ({
                  ...purchase,
                  status: 'Purchased' as RequestStatus,
                  purchaseDate: new Date(),
                } as any)
              : purchase
          )
        );
        toast.success('Purchase marked as completed');
      } else if (action === 'upload_receipt') {
        if (receiptFile) {
          setPurchases(prev =>
            prev.map(purchase =>
              purchase.id === purchaseId
                ? ({
                    ...purchase,
                    receipt: {
                      name: receiptFile.name,
                      size: `${(receiptFile.size / 1024).toFixed(0)} KB`,
                      uploadedAt: new Date(),
                    },
                  } as any)
                : purchase
            )
          );
          toast.success('Receipt uploaded successfully');
          setReceiptFile(null);
        }
      } else if (action === 'reconcile') {
        setPurchases(prev =>
          prev.map(purchase =>
            purchase.id === purchaseId
              ? ({ ...purchase, status: 'Reconciled' as RequestStatus } as any)
              : purchase
          )
        );
        toast.success('Purchase reconciled successfully');
      }

      setSelectedPurchase(null);
    } catch (error) {
      toast.error('Failed to process purchase action');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'Cardholder Purchasing':
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case 'Purchased':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Reconciled':
        return <Receipt className="h-5 w-5 text-purple-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusAction = (status: RequestStatus) => {
    switch (status) {
      case 'Cardholder Purchasing':
        return 'Mark as Purchased';
      case 'Purchased':
        return 'Upload Receipt';
      case 'Reconciled':
        return 'View Receipt';
      default:
        return 'View Details';
    }
  };

  const activePurchases = purchases.filter(
    purchase =>
      purchase.status === 'Cardholder Purchasing' ||
      purchase.status === 'Purchased'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
          <p className="mt-2 text-gray-600">
            Manage approved procurement requests and track purchases.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      purchases.filter(
                        p => p.status === 'Cardholder Purchasing'
                      ).length
                    }
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
                  <p className="text-sm font-medium text-gray-500">Purchased</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {purchases.filter(p => p.status === 'Purchased').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Receipt className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Reconciled
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {purchases.filter(p => p.status === 'Reconciled').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      purchases.reduce((sum, p) => sum + p.total, 0)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchases List */}
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No purchases found
                </h3>
                <p className="text-gray-500">
                  There are no approved requests ready for purchase.
                </p>
              </CardContent>
            </Card>
          ) : (
            purchases.map(purchase => (
              <Card
                key={purchase.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Purchase #{purchase.id}
                        </h3>
                        <StatusBadge status={purchase.status} />
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(purchase.status)}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Vendor:</span>{' '}
                          {purchase.vendor}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>{' '}
                          {formatCurrency(purchase.total)}
                        </div>
                        <div>
                          <span className="font-medium">Need By:</span>{' '}
                          {formatDate(purchase.needBy)}
                        </div>
                        <div>
                          <span className="font-medium">Requester:</span>{' '}
                          {purchase.requester.name}
                        </div>
                        <div>
                          <span className="font-medium">Card:</span>{' '}
                          {purchase.cardNumber}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span>{' '}
                          {purchase.items.length}
                        </div>
                      </div>
                      {purchase.purchaseDate && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Purchased:</span>{' '}
                          {formatDate(purchase.purchaseDate)}
                        </div>
                      )}
                      {purchase.receipt && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Receipt:</span>{' '}
                          {purchase.receipt.name} ({purchase.receipt.size})
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPurchase(purchase)}
                      >
                        {getStatusAction(purchase.status)}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Purchase Action Modal */}
        {selectedPurchase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Purchase #{selectedPurchase.id}</CardTitle>
                <CardDescription>
                  {selectedPurchase.status === 'Cardholder Purchasing' &&
                    'Mark this purchase as completed.'}
                  {selectedPurchase.status === 'Purchased' &&
                    'Upload receipt for this purchase.'}
                  {selectedPurchase.status === 'Reconciled' &&
                    'View purchase details and receipt.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Vendor
                    </label>
                    <p className="text-gray-900">{selectedPurchase.vendor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Total Amount
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {formatCurrency(selectedPurchase.total)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Card Number
                    </label>
                    <p className="text-gray-900">
                      {selectedPurchase.cardNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Need By
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedPurchase.needBy)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Items
                  </label>
                  <div className="mt-2 space-y-2">
                    {selectedPurchase.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} (Qty: {item.qty})
                        </span>
                        <span>{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPurchase.status === 'Purchased' && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Upload Receipt
                    </label>
                    <FileDropzone
                      onFilesAccepted={files =>
                        setReceiptFile(files[0] || null)
                      }
                      accept={{
                        'image/*': ['.jpg', '.jpeg', '.png'],
                        'application/pdf': ['.pdf'],
                      }}
                      maxSize={5 * 1024 * 1024} // 5MB
                      maxFiles={1}
                    />
                    {receiptFile && (
                      <p className="mt-2 text-sm text-green-600">
                        Selected: {receiptFile.name}
                      </p>
                    )}
                  </div>
                )}

                {selectedPurchase.receipt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Receipt
                    </label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {selectedPurchase.receipt.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedPurchase.receipt.size} • Uploaded{' '}
                          {formatDate(selectedPurchase.receipt.uploadedAt)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t">
                  {selectedPurchase.status === 'Cardholder Purchasing' && (
                    <Button
                      onClick={() =>
                        handlePurchaseAction(
                          selectedPurchase.id,
                          'mark_purchased'
                        )
                      }
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Purchased
                    </Button>
                  )}
                  {selectedPurchase.status === 'Purchased' && (
                    <Button
                      onClick={() =>
                        handlePurchaseAction(
                          selectedPurchase.id,
                          'upload_receipt'
                        )
                      }
                      disabled={isProcessing || !receiptFile}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Receipt
                    </Button>
                  )}
                  {selectedPurchase.status === 'Purchased' &&
                    selectedPurchase.receipt && (
                      <Button
                        onClick={() =>
                          handlePurchaseAction(selectedPurchase.id, 'reconcile')
                        }
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Reconcile
                      </Button>
                    )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPurchase(null)}
                    disabled={isProcessing}
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
