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
  Search,
  Filter,
  Download,
  Plus,
  Building2,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  Bell,
  Users,
  Archive,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share,
  ExternalLink,
  X,
  Shield,
  Ban,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Enhanced mock data with analytics and financial controls
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
  // Additional purchase card purchases (within $10,000 limit)
  {
    id: '4',
    requestId: '4',
    vendor: 'Office Depot',
    total: 7500.00,
    status: 'Purchased' as RequestStatus,
    createdAt: new Date('2024-01-18'),
    needBy: new Date('2024-01-25'),
    items: [{ name: 'Office Furniture Set', qty: 1, price: 7500.00 }],
    requester: {
      name: 'David Wilson',
      email: 'david.wilson@mwr.com',
    },
    cardNumber: '****3456',
    purchaseDate: new Date('2024-01-20'),
    category: 'general',
    justification: 'New furniture for administrative office',
    // Vendor verification data
    vendorSamStatus: 'verified',
    vendorCageCode: 'ABC12',
    vendorDuns: '123456789',
    vendorLastVerified: new Date('2024-01-15'),
    vendorVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
  },
  {
    id: '5',
    requestId: '5',
    vendor: 'Staples',
    total: 4500.00,
    status: 'Cardholder Purchasing' as RequestStatus,
    createdAt: new Date('2024-01-22'),
    needBy: new Date('2024-02-01'),
    items: [{ name: 'Office Supplies Bulk Order', qty: 1, price: 4500.00 }],
    requester: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@mwr.com',
    },
    cardNumber: '****7890',
    category: 'general',
    justification: 'Quarterly office supplies for child care center',
    // Vendor verification data
    vendorSamStatus: 'pending',
    vendorCageCode: '',
    vendorDuns: '',
    vendorLastVerified: null,
    vendorVerificationNotes: 'Vendor verification pending - requires SAM.gov check',
  },
  {
    id: '6',
    requestId: '6',
    vendor: 'Home Depot',
    total: 8500.00,
    status: 'Purchased' as RequestStatus,
    createdAt: new Date('2024-01-19'),
    needBy: new Date('2024-01-30'),
    items: [{ name: 'Maintenance Equipment', qty: 1, price: 8500.00 }],
    requester: {
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@mwr.com',
    },
    cardNumber: '****2468',
    purchaseDate: new Date('2024-01-21'),
    category: 'general',
    justification: 'Facility maintenance equipment for playground repairs',
    // Vendor verification data
    vendorSamStatus: 'verified',
    vendorCageCode: 'DEF34',
    vendorDuns: '987654321',
    vendorLastVerified: new Date('2024-01-10'),
    vendorVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
  },
];

// Enhanced analytics and financial data
const analyticsData = {
  monthlySpending: {
    current: 125000,
    budget: 150000,
    lastMonth: 98000,
    trend: 27.6,
  },
  categoryBreakdown: [
    { category: 'Office Supplies', amount: 45000, percentage: 36, color: 'bg-blue-500' },
    { category: 'Equipment', amount: 35000, percentage: 28, color: 'bg-green-500' },
    { category: 'Software', amount: 25000, percentage: 20, color: 'bg-purple-500' },
    { category: 'Maintenance', amount: 20000, percentage: 16, color: 'bg-orange-500' },
  ],
  vendorPerformance: [
    { vendor: 'Home Depot', orders: 45, total: 125000, rating: 4.8, onTime: 95 },
    { vendor: 'Office Depot', orders: 32, total: 89000, rating: 4.6, onTime: 92 },
    { vendor: 'Amazon Business', orders: 28, total: 67000, rating: 4.9, onTime: 98 },
    { vendor: 'Lowe\'s', orders: 15, total: 34000, rating: 4.4, onTime: 88 },
  ],
  complianceMetrics: {
    totalTransactions: 124,
    compliantTransactions: 118,
    complianceRate: 95.2,
    pendingReviews: 6,
    overdueItems: 2,
  },
  budgetStatus: {
    allocated: 150000,
    spent: 125000,
    remaining: 25000,
    utilizationRate: 83.3,
    alerts: [
      { type: 'warning', message: 'Office Supplies category at 85% of budget' },
      { type: 'info', message: 'Equipment category has 15% remaining' },
    ],
  },
};

const costCenters = [
  { id: 'CC001', name: 'Administration', budget: 50000, spent: 42000, remaining: 8000 },
  { id: 'CC002', name: 'Child Care', budget: 75000, spent: 68000, remaining: 7000 },
  { id: 'CC003', name: 'Recreation', budget: 25000, spent: 15000, remaining: 10000 },
];

// DOD MWR Purchase Card (GPC) Thresholds and Approval Requirements (2024 Current Guidelines)
const dodThresholds = {
  micro: { amount: 0, label: 'Micro Purchase', approval: 'Cardholder Only', color: 'bg-green-100 text-green-800' },
  micro_construction: { amount: 2000, label: 'Micro Purchase (Construction)', approval: 'Cardholder Only', color: 'bg-green-100 text-green-800' },
  micro_services: { amount: 2500, label: 'Micro Purchase (Services)', approval: 'Cardholder Only', color: 'bg-green-100 text-green-800' },
  micro_general: { amount: 10000, label: 'Micro Purchase (General)', approval: 'Cardholder Only', color: 'bg-green-100 text-green-800' },
  micro_emergency_us: { amount: 20000, label: 'Micro Purchase (Emergency US)', approval: 'Cardholder Only', color: 'bg-green-100 text-green-800' },
  micro_emergency_overseas: { amount: 35000, label: 'Micro Purchase (Emergency Overseas)', approval: 'Cardholder Only', color: 'bg-green-100 text-green-800' },
  over_threshold: { amount: 10000, label: 'Over Purchase Card Limit', approval: 'Contracting Officer Required', color: 'bg-red-100 text-red-800' },
};

const getThresholdLevel = (amount: number, category: string = 'general') => {
  // Determine micro purchase threshold based on category
  let microThreshold = dodThresholds.micro_general.amount;
  if (category === 'construction') microThreshold = dodThresholds.micro_construction.amount;
  if (category === 'services') microThreshold = dodThresholds.micro_services.amount;
  
  if (amount <= microThreshold) return 'micro';
  if (amount <= dodThresholds.micro_general.amount) return 'micro_general';
  if (amount <= dodThresholds.micro_emergency_us.amount) return 'micro_emergency_us';
  if (amount <= dodThresholds.micro_emergency_overseas.amount) return 'micro_emergency_overseas';
  return 'over_threshold';
};

const getApprovalStatus = (purchase: any) => {
  const threshold = getThresholdLevel(purchase.total, purchase.category || 'general');
  const thresholdData = dodThresholds[threshold as keyof typeof dodThresholds];
  
  return {
    threshold,
    thresholdData,
    requiresApproval: threshold === 'over_threshold',
    approvalRequired: thresholdData.approval,
    isOverThreshold: threshold === 'over_threshold',
    needsContractingApproval: threshold === 'over_threshold',
    isMicroPurchase: threshold !== 'over_threshold',
  };
};

export default function PurchasesPage() {
  const router = useRouter();
  const { user, loading, originalUser } = useAuth();
  
  // Use original user role for access control, not debug role
  const actualRole = originalUser?.role || user?.role;
  const [purchases, setPurchases] = useState(mockPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  
  // Enhanced state management for A+ features
  const [selectedPurchases, setSelectedPurchases] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState('30');
  const [costCenterFilter, setCostCenterFilter] = useState('all');
  
  // Reconciliation workflow state
  const [showReconciliation, setShowReconciliation] = useState(false);
  const [reconcilingPurchase, setReconcilingPurchase] = useState<any>(null);
  const [reconciliationData, setReconciliationData] = useState({
    receiptUploaded: false,
    receiptVerified: false,
    accountingCode: '',
    costCenter: '',
    justification: '',
    complianceChecked: false,
    supervisorApproved: false,
    // Price verification fields
    poAmount: 0,
    receiptAmount: 0,
    priceMatch: false,
    priceDiscrepancy: 0,
    discrepancyReason: '',
    priceApproved: false,
    overageApproved: false,
  });
  
  // Document viewing state
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  
  // Settings and notifications state
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'info',
      title: 'Purchase Order #PO-001 Approved',
      message: 'Your purchase order has been approved and is ready for processing.',
      timestamp: new Date('2024-01-20T10:30:00'),
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Reconciliation Required',
      message: 'Purchase order #PO-002 requires reconciliation within 3 days.',
      timestamp: new Date('2024-01-19T14:15:00'),
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'Vendor Added Successfully',
      message: 'New vendor "Office Depot" has been verified and added to the database.',
      timestamp: new Date('2024-01-18T09:45:00'),
      read: true,
    },
  ]);
  
  // Vendor verification state
  const [vendorVerification, setVendorVerification] = useState({
    samStatus: 'verified', // verified, pending, suspended, ineligible
    cageCode: '',
    dunsNumber: '',
    lastVerified: new Date(),
    verificationNotes: '',
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

  // Enhanced reconciliation functions
  const handleStartReconciliation = (purchase: any) => {
    setReconcilingPurchase(purchase);
    setShowReconciliation(true);
    setReconciliationData({
      receiptUploaded: false,
      receiptVerified: false,
      accountingCode: '',
      costCenter: '',
      justification: '',
      complianceChecked: false,
      supervisorApproved: false,
      // Initialize price verification
      poAmount: purchase.total,
      receiptAmount: 0,
      priceMatch: false,
      priceDiscrepancy: 0,
      discrepancyReason: '',
      priceApproved: false,
      overageApproved: false,
    });
    
    // Initialize vendor verification
    setVendorVerification({
      samStatus: purchase.vendorSamStatus || 'verified',
      cageCode: purchase.vendorCageCode || '',
      dunsNumber: purchase.vendorDuns || '',
      lastVerified: purchase.vendorLastVerified || new Date(),
      verificationNotes: purchase.vendorVerificationNotes || '',
    });
  };

  const handleDocumentUpload = (file: File, documentType: string) => {
    // Simulate document upload
    toast.success(`${documentType} uploaded successfully`);
    
    if (documentType === 'receipt') {
      setReconciliationData(prev => ({ ...prev, receiptUploaded: true }));
    }
  };

  // Price verification functions
  const handleReceiptAmountChange = (amount: number) => {
    const poAmount = reconciliationData.poAmount;
    const discrepancy = amount - poAmount;
    const priceMatch = Math.abs(discrepancy) < 0.01; // Allow for small rounding differences
    
    setReconciliationData(prev => ({
      ...prev,
      receiptAmount: amount,
      priceDiscrepancy: discrepancy,
      priceMatch: priceMatch,
      priceApproved: priceMatch, // Auto-approve if prices match
      overageApproved: discrepancy <= 0, // Auto-approve if under budget
    }));
  };

  const handleDiscrepancyApproval = (approved: boolean) => {
    setReconciliationData(prev => ({
      ...prev,
      overageApproved: approved,
    }));
  };

  // Document viewing functions
  const handleViewDocument = (documentType: string) => {
    const document = {
      type: documentType,
      title: getDocumentTitle(documentType),
      content: getDocumentContent(documentType),
      purchase: reconcilingPurchase,
    };
    setViewingDocument(document);
    setShowDocumentViewer(true);
  };

  const getDocumentTitle = (documentType: string) => {
    switch (documentType) {
      case 'purchase_request':
        return `Purchase Request #${reconcilingPurchase.requestId}`;
      case 'purchase_order':
        return `Purchase Order PO-${reconcilingPurchase.id}`;
      case 'justification':
        return 'Purchase Order Justification';
      case 'approval':
        return 'Approval Documentation';
      default:
        return 'Document';
    }
  };

  const getDocumentContent = (documentType: string) => {
    switch (documentType) {
      case 'purchase_request':
        return {
          requestId: reconcilingPurchase.requestId,
          vendor: reconcilingPurchase.vendor,
          total: reconcilingPurchase.total,
          requester: reconcilingPurchase.requester?.name,
          createdAt: reconcilingPurchase.createdAt,
          needBy: reconcilingPurchase.needBy,
          items: reconcilingPurchase.items,
          justification: reconcilingPurchase.justification,
        };
      case 'purchase_order':
        return {
          poNumber: `PO-${reconcilingPurchase.id}`,
          vendor: reconcilingPurchase.vendor,
          total: reconcilingPurchase.total,
          cardNumber: reconcilingPurchase.cardNumber,
          createdAt: reconcilingPurchase.createdAt,
          items: reconcilingPurchase.items,
          justification: reconcilingPurchase.justification,
        };
      case 'justification':
        return {
          justification: reconcilingPurchase.justification,
          requestId: reconcilingPurchase.requestId,
          vendor: reconcilingPurchase.vendor,
          total: reconcilingPurchase.total,
        };
      case 'approval':
        return {
          approvalStatus: reconcilingPurchase.approvalStatus,
          approver: 'Supervisor/Contracting Officer',
          approvedAt: reconcilingPurchase.createdAt,
          comments: 'Approved for purchase card transaction',
        };
      default:
        return {};
    }
  };

  const handleDownloadDocument = (documentType: string) => {
    // Simulate document download
    toast.success(`${getDocumentTitle(documentType)} downloaded successfully`);
  };

  // Vendor verification functions
  const handleVerifyVendor = async () => {
    setIsProcessing(true);
    try {
      // Simulate SAM.gov verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification results
      const verificationResult = {
        samStatus: 'verified',
        cageCode: 'ABC12',
        dunsNumber: '123456789',
        lastVerified: new Date(),
        verificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
      };
      
      setVendorVerification(verificationResult);
      toast.success('Vendor verification completed successfully');
    } catch (error) {
      toast.error('Failed to verify vendor status');
    } finally {
      setIsProcessing(false);
    }
  };

  const getVendorStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'ineligible': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVendorStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified & Eligible';
      case 'pending': return 'Verification Pending';
      case 'suspended': return 'Suspended';
      case 'ineligible': return 'Ineligible';
      default: return 'Unknown Status';
    }
  };

  // Notification handlers
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Bell className="h-4 w-4 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatNotificationTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Report generation functions
  const generateSpendingReport = () => {
    const totalSpending = mockPurchases.reduce((sum, p) => sum + p.total, 0);
    const monthlySpending = mockPurchases
      .filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, p) => sum + p.total, 0);
    
    const categoryBreakdown = mockPurchases.reduce((acc, p) => {
      const category = p.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + p.total;
      return acc;
    }, {} as Record<string, number>);

    return {
      type: 'spending',
      title: 'Spending Analysis Report',
      data: {
        totalSpending,
        monthlySpending,
        categoryBreakdown,
        purchaseCount: mockPurchases.length,
        averagePurchase: totalSpending / mockPurchases.length,
        topVendors: Object.entries(
          mockPurchases.reduce((acc, p) => {
            acc[p.vendor] = (acc[p.vendor] || 0) + p.total;
            return acc;
          }, {} as Record<string, number>)
        ).sort(([,a], [,b]) => b - a).slice(0, 5)
      }
    };
  };

  const generateVendorReport = () => {
    const vendorStats = mockPurchases.reduce((acc, p) => {
      if (!acc[p.vendor]) {
        acc[p.vendor] = { totalSpent: 0, purchaseCount: 0, lastPurchase: p.createdAt };
      }
      acc[p.vendor].totalSpent += p.total;
      acc[p.vendor].purchaseCount += 1;
      if (new Date(p.createdAt) > new Date(acc[p.vendor].lastPurchase)) {
        acc[p.vendor].lastPurchase = p.createdAt;
      }
      return acc;
    }, {} as Record<string, any>);

    return {
      type: 'vendor',
      title: 'Vendor Performance Report',
      data: {
        totalVendors: Object.keys(vendorStats).length,
        vendorStats: Object.entries(vendorStats)
          .map(([vendor, stats]) => ({ vendor, ...stats }))
          .sort((a, b) => b.totalSpent - a.totalSpent),
        topVendor: Object.entries(vendorStats).sort(([,a], [,b]) => b.totalSpent - a.totalSpent)[0]
      }
    };
  };

  const generateComplianceReport = () => {
    const totalPurchases = mockPurchases.length;
    const compliantPurchases = mockPurchases.filter(p => 
      p.vendorSamStatus === 'verified' && 
      p.total <= 10000 && 
      p.status === 'Reconciled'
    ).length;
    
    const complianceRate = (compliantPurchases / totalPurchases) * 100;
    const nonCompliantPurchases = mockPurchases.filter(p => 
      p.vendorSamStatus !== 'verified' || 
      p.total > 10000 || 
      p.status !== 'Reconciled'
    );

    return {
      type: 'compliance',
      title: 'DOD MWR Compliance Report',
      data: {
        complianceRate,
        totalPurchases,
        compliantPurchases,
        nonCompliantPurchases: nonCompliantPurchases.length,
        issues: nonCompliantPurchases.map(p => ({
          id: p.id,
          vendor: p.vendor,
          amount: p.total,
          issue: p.vendorSamStatus !== 'verified' ? 'Unverified Vendor' : 
                 p.total > 10000 ? 'Exceeds GPC Limit' : 'Incomplete Status'
        }))
      }
    };
  };

  const generateReconciliationReport = () => {
    const pendingReconciliations = mockPurchases.filter(p => p.status === 'Purchased');
    const completedReconciliations = mockPurchases.filter(p => p.status === 'Reconciled');
    const overdueReconciliations = pendingReconciliations.filter(p => 
      new Date(p.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    return {
      type: 'reconciliation',
      title: 'Reconciliation Status Report',
      data: {
        pending: pendingReconciliations.length,
        completed: completedReconciliations.length,
        overdue: overdueReconciliations.length,
        pendingPurchases: pendingReconciliations,
        overduePurchases: overdueReconciliations,
        completionRate: (completedReconciliations.length / mockPurchases.length) * 100
      }
    };
  };

  const generateBudgetReport = () => {
    const monthlyBudget = 50000; // Mock budget
    const currentSpending = mockPurchases
      .filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, p) => sum + p.total, 0);
    
    const projectedSpending = currentSpending * 12; // Annual projection
    const budgetUtilization = (currentSpending / monthlyBudget) * 100;

    return {
      type: 'budget',
      title: 'Budget Analysis Report',
      data: {
        monthlyBudget,
        currentSpending,
        remainingBudget: monthlyBudget - currentSpending,
        budgetUtilization,
        projectedAnnual: projectedSpending,
        budgetStatus: budgetUtilization > 90 ? 'Critical' : 
                     budgetUtilization > 75 ? 'Warning' : 'Healthy'
      }
    };
  };

  const handleReportClick = (reportType: string) => {
    let report;
    switch (reportType) {
      case 'spending':
        report = generateSpendingReport();
        break;
      case 'vendor':
        report = generateVendorReport();
        break;
      case 'compliance':
        report = generateComplianceReport();
        break;
      case 'reconciliation':
        report = generateReconciliationReport();
        break;
      case 'budget':
        report = generateBudgetReport();
        break;
      case 'export':
        handleExportData();
        return;
      default:
        return;
    }
    
    setSelectedReportType(reportType);
    setReportData(report);
  };

  const handleExportData = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      
      // Generate comprehensive PDF report
      const totalSpending = mockPurchases.reduce((sum, p) => sum + p.total, 0);
      const monthlySpending = mockPurchases
        .filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum, p) => sum + p.total, 0);
      
      const vendorStats = mockPurchases.reduce((acc, p) => {
        if (!acc[p.vendor]) {
          acc[p.vendor] = { totalSpent: 0, purchaseCount: 0 };
        }
        acc[p.vendor].totalSpent += p.total;
        acc[p.vendor].purchaseCount += 1;
        return acc;
      }, {} as Record<string, any>);

      const compliantPurchases = mockPurchases.filter(p => 
        p.vendorSamStatus === 'verified' && 
        p.total <= 10000 && 
        p.status === 'Reconciled'
      ).length;
      const complianceRate = (compliantPurchases / mockPurchases.length) * 100;

      // Create new PDF document
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Helper function to add text with word wrapping
      const addText = (text: string, x: number, y: number, options: any = {}) => {
        const maxWidth = pageWidth - x - 20;
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * (options.lineHeight || 6));
      };

      // Helper function to add a new page if needed
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // Header
      doc.setFontSize(20);
      doc.setTextColor(30, 64, 175); // Blue color
      doc.text('DOD MWR Purchase Card Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128); // Gray color
      doc.text('Department of Defense Morale, Welfare & Recreation', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Report date
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 20;

      // Executive Summary
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('Executive Summary', 20, yPosition);
      yPosition += 10;

      // Summary stats
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const summaryData = [
        `Total Spending: $${totalSpending.toLocaleString()}`,
        `Monthly Spending: $${monthlySpending.toLocaleString()}`,
        `Total Purchases: ${mockPurchases.length}`,
        `Active Vendors: ${Object.keys(vendorStats).length}`
      ];

      summaryData.forEach(line => {
        yPosition = addText(line, 20, yPosition);
        yPosition += 3;
      });
      yPosition += 10;

      // Compliance Status
      checkNewPage(30);
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('Compliance Status', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const complianceColor = complianceRate >= 95 ? [5, 150, 105] : 
                             complianceRate >= 80 ? [217, 119, 6] : [220, 38, 38];
      doc.setTextColor(complianceColor[0], complianceColor[1], complianceColor[2]);
      doc.text(`Compliance Rate: ${complianceRate.toFixed(1)}%`, 20, yPosition);
      yPosition += 6;
      
      doc.setTextColor(0, 0, 0);
      doc.text(`Compliant Purchases: ${compliantPurchases}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Non-Compliant: ${mockPurchases.length - compliantPurchases}`, 20, yPosition);
      yPosition += 15;

      // Purchase Details Table
      checkNewPage(50);
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('Purchase Details', 20, yPosition);
      yPosition += 10;

      // Table headers
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      const tableHeaders = ['ID', 'Vendor', 'Amount', 'Category', 'Status', 'Date', 'SAM'];
      const colWidths = [15, 40, 20, 20, 25, 20, 15];
      let xPosition = 20;

      // Draw table header
      doc.setFillColor(243, 244, 246);
      doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
      
      tableHeaders.forEach((header, index) => {
        doc.text(header, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      yPosition += 10;

      // Table data
      mockPurchases.forEach((purchase, index) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }

        xPosition = 20;
        const rowData = [
          purchase.id,
          purchase.vendor.length > 15 ? purchase.vendor.substring(0, 15) + '...' : purchase.vendor,
          `$${purchase.total.toLocaleString()}`,
          (purchase.category || 'N/A').length > 8 ? (purchase.category || 'N/A').substring(0, 8) + '...' : (purchase.category || 'N/A'),
          purchase.status.length > 10 ? purchase.status.substring(0, 10) + '...' : purchase.status,
          formatDate(purchase.createdAt).substring(0, 8),
          (purchase.vendorSamStatus || 'N/A').substring(0, 6)
        ];

        rowData.forEach((data, colIndex) => {
          doc.text(data, xPosition, yPosition);
          xPosition += colWidths[colIndex];
        });
        yPosition += 6;
      });

      yPosition += 15;

      // Top Vendors
      checkNewPage(40);
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('Top Vendors by Spending', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      const topVendors = Object.entries(vendorStats)
        .map(([vendor, stats]) => [vendor, stats])
        .sort(([,a], [,b]) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

      topVendors.forEach(([vendor, stats]) => {
        const vendorText = vendor.length > 25 ? vendor.substring(0, 25) + '...' : vendor;
        const line = `${vendorText}: $${stats.totalSpent.toLocaleString()} (${stats.purchaseCount} purchases)`;
        yPosition = addText(line, 20, yPosition, { lineHeight: 4 });
        yPosition += 2;
      });

      yPosition += 20;

      // Footer
      checkNewPage(20);
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text('This report was generated by ProcureFlow - DOD MWR Purchase Card Management System', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 5;
      doc.text('Report contains sensitive financial information - For official use only', pageWidth / 2, yPosition, { align: 'center' });

      // Save the PDF
      const fileName = `DOD-MWR-Purchase-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('Professional PDF report downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF report');
    }
  };

  const handleReconciliationSubmit = async () => {
    if (!reconciliationData.receiptUploaded) {
      toast.error('Receipt must be uploaded before reconciliation');
      return;
    }
    
    if (!reconciliationData.accountingCode || !reconciliationData.costCenter) {
      toast.error('Accounting code and cost center are required');
      return;
    }

    if (reconciliationData.receiptAmount === 0) {
      toast.error('Receipt amount must be entered for price verification');
      return;
    }

    if (!reconciliationData.priceMatch && !reconciliationData.overageApproved) {
      toast.error('Price discrepancy must be approved before reconciliation');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate reconciliation processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPurchases(prev => 
        prev.map(p => 
          p.id === reconcilingPurchase.id 
            ? { 
                ...p, 
                status: 'Reconciled' as RequestStatus,
                reconciliationDate: new Date(),
                reconciliationData: { ...reconciliationData }
              }
            : p
        )
      );
      
      toast.success('Purchase reconciled successfully!');
      setShowReconciliation(false);
      setReconcilingPurchase(null);
    } catch (error) {
      toast.error('Failed to reconcile purchase');
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

  // Filter and search logic
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = searchTerm === '' || 
      purchase.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.id.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    const matchesVendor = vendorFilter === 'all' || purchase.vendor === vendorFilter;
    
    return matchesSearch && matchesStatus && matchesVendor;
  });

  const activePurchases = filteredPurchases.filter(
    purchase =>
      purchase.status === 'Cardholder Purchasing' ||
      purchase.status === 'Purchased'
  );

  // Get unique vendors for filter
  const vendors = [...new Set(purchases.map(p => p.vendor))];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
          <p className="mt-2 text-gray-600">
                Manage approved procurement requests, create purchase orders, and track purchases.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => router.push('/purchases/create-po')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Create Purchase Order
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/purchase-orders')}
              >
                <Receipt className="h-4 w-4 mr-2" />
                View Purchase Orders
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/vendors')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Vendor Database
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Primary Search Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search purchases by vendor, requester, ID, or amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Bulk Actions */}
                  {selectedPurchases.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{selectedPurchases.length} selected</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBulkActions(true)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Bulk Actions
                      </Button>
                    </div>
                  )}
                </div>

                {/* Advanced Filters Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Status Filter */}
                  <div className="lg:w-48">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Cardholder Purchasing">In Progress</option>
                      <option value="Purchased">Purchased</option>
                      <option value="Reconciled">Reconciled</option>
                    </select>
                  </div>
                  
                  {/* Vendor Filter */}
                  <div className="lg:w-48">
                    <select
                      value={vendorFilter}
                      onChange={(e) => setVendorFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Vendors</option>
                      {vendors.map(vendor => (
                        <option key={vendor} value={vendor}>{vendor}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cost Center Filter */}
                  <div className="lg:w-48">
                    <select
                      value={costCenterFilter}
                      onChange={(e) => setCostCenterFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Cost Centers</option>
                      {costCenters.map(cc => (
                        <option key={cc.id} value={cc.id}>{cc.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div className="lg:w-48">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                      <option value="365">Last year</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div className="lg:w-48">
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order as 'asc' | 'desc');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="total-desc">Highest Amount</option>
                      <option value="total-asc">Lowest Amount</option>
                      <option value="vendor-asc">Vendor A-Z</option>
                      <option value="vendor-desc">Vendor Z-A</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReports(true)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.success('Data refreshed successfully');
                        // In a real app, this would refetch data from the server
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNotifications(true)}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {notifications.filter(n => !n.read).length}
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHelp(true)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Help
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Analytics Dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReports(true)}
                className="flex items-center"
              >
                <PieChart className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Spending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analyticsData.monthlySpending.current)}
                    </p>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{analyticsData.monthlySpending.trend}% vs last month
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget Utilization</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.budgetStatus.utilizationRate}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(analyticsData.budgetStatus.remaining)} remaining
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Compliance Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.complianceMetrics.complianceRate}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {analyticsData.complianceMetrics.compliantTransactions} of {analyticsData.complianceMetrics.totalTransactions} transactions
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Purchases</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {purchases.filter(p => p.status === 'Cardholder Purchasing').length}
                    </p>
                    <p className="text-sm text-gray-600">
                      {purchases.filter(p => p.status === 'Purchased').length} completed
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          {showAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.categoryBreakdown.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                          <span className="text-sm font-medium text-gray-700">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(category.amount)}</p>
                          <p className="text-xs text-gray-500">{category.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Top Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.vendorPerformance.slice(0, 4).map((vendor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vendor.vendor}</p>
                          <p className="text-xs text-gray-500">{vendor.orders} orders • {vendor.onTime}% on-time</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(vendor.total)}</p>
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">{vendor.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* DOD MWR Threshold Management */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                DOD MWR Spending Thresholds
              </CardTitle>
              <CardDescription>
                Current threshold levels and approval requirements for purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(dodThresholds).map(([key, threshold]) => (
                  <div key={key} className={`p-4 rounded-lg border ${threshold.color}`}>
                    <div className="text-center">
                      <p className="text-sm font-medium">{threshold.label}</p>
                      <p className="text-lg font-bold">
                        {threshold.amount === 0 ? 'Under $2,000' : `$${threshold.amount.toLocaleString()}+`}
                      </p>
                      <p className="text-xs mt-1">{threshold.approval}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Card Threshold Alerts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Purchase Card Threshold Alerts
              </CardTitle>
              <CardDescription>
                Purchases that exceed purchase card limits and require alternative procurement methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchases
                  .filter(p => p.total > dodThresholds.micro_general.amount)
                  .map((purchase) => {
                    const approvalStatus = getApprovalStatus(purchase);
                    return (
                      <div key={purchase.id} className="p-4 rounded-lg border bg-red-50 border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {purchase.vendor} - {formatCurrency(purchase.total)}
                            </p>
                            <p className="text-sm text-red-600">
                              Exceeds Purchase Card Limit (${dodThresholds.micro_general.amount.toLocaleString()})
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              This purchase requires alternative procurement methods (contracting office)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {purchase.justification}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              OVER CARD LIMIT
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              Request #{purchase.requestId}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {purchases.filter(p => p.total > dodThresholds.micro_general.amount).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p className="text-lg font-medium">All purchases within card limits</p>
                    <p className="text-sm">No purchases exceed the $10,000 purchase card threshold</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Budget Alerts */}
          {analyticsData.budgetStatus.alerts.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Budget Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.budgetStatus.alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      alert.type === 'warning' ? 'bg-orange-50 border border-orange-200' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <p className={`text-sm ${
                        alert.type === 'warning' ? 'text-orange-800' : 'text-blue-800'
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Draft Purchase Orders Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-500" />
                    Draft Purchase Orders
                  </CardTitle>
                  <CardDescription>
                    Manage your draft purchase orders before sending them to vendors
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/purchase-orders?status=draft')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Drafts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No draft purchase orders
                </h3>
                <p className="text-gray-500 mb-4">
                  Create a purchase order and save it as a draft to work on it later.
                </p>
                <Button
                  onClick={() => router.push('/purchases/create-po')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Purchase Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchases List */}
        <div className="space-y-4">
          {filteredPurchases.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No purchases found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || vendorFilter !== 'all' 
                    ? 'No purchases match your current filters.'
                    : 'There are no approved requests ready for purchase.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPurchases.map(purchase => (
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
                      {purchase.status === 'Purchased' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartReconciliation(purchase)}
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          <Receipt className="h-4 w-4 mr-1" />
                          Reconcile
                        </Button>
                      )}
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

        {/* Comprehensive Reconciliation Modal */}
        {showReconciliation && reconcilingPurchase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Purchase Card Reconciliation</h2>
                <button
                  onClick={() => setShowReconciliation(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Purchase Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Purchase Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Vendor:</span> {reconcilingPurchase.vendor}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> {formatCurrency(reconcilingPurchase.total)}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(reconcilingPurchase.purchaseDate)}
                      </div>
                      <div>
                        <span className="font-medium">Card:</span> {reconcilingPurchase.cardNumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Required Documents</h3>
                  <div className="space-y-3">
                    {/* Receipt Upload - Only document that needs to be uploaded */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Vendor Receipt/Invoice</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          reconciliationData.receiptUploaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reconciliationData.receiptUploaded ? 'Uploaded' : 'Required'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload the vendor receipt or invoice to verify the actual amount charged.
                      </p>
                      <FileDropzone
                        onFilesAccepted={(files) => handleDocumentUpload(files[0], 'receipt')}
                        accept={{
                          'image/*': ['.jpg', '.jpeg', '.png'],
                          'application/pdf': ['.pdf'],
                        }}
                        maxSize={10 * 1024 * 1024} // 10MB
                        maxFiles={1}
                      />
                    </div>

                    {/* Existing Documents - Show actual attachments */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-3">Existing System Documents</h4>
                      <div className="space-y-3">
                        {/* Purchase Request Document */}
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Purchase Request #{reconcilingPurchase.requestId}</p>
                              <p className="text-xs text-gray-500">Submitted {formatDate(reconcilingPurchase.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Attached
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument('purchase_request')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadDocument('purchase_request')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* Purchase Order Document */}
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <Receipt className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Purchase Order PO-{reconcilingPurchase.id}</p>
                              <p className="text-xs text-gray-500">Generated {formatDate(reconcilingPurchase.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Attached
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument('purchase_order')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadDocument('purchase_order')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* Purchase Order Justification Document */}
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-purple-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Purchase Order Justification</p>
                              <p className="text-xs text-gray-500">PO justification document</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Attached
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument('justification')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadDocument('justification')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* Approval Documents (if any) */}
                        {reconcilingPurchase.approvalStatus && reconcilingPurchase.approvalStatus !== 'approved_supervisor' && (
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-orange-600 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Approval Documentation</p>
                                <p className="text-xs text-gray-500">Supervisor/Contracting approval</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                Attached
                              </span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDocument('approval')}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadDocument('approval')}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        These documents are automatically included in the reconciliation package.
                      </p>
                    </div>

                    {/* Vendor Verification Documentation */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-3">Vendor Verification Documentation</h4>
                      <div className="space-y-3">
                        {/* SAM.gov Verification */}
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">SAM.gov Verification</p>
                              <p className="text-xs text-gray-500">Federal registration status and eligibility</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Verified
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument('sam_verification')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadDocument('sam_verification')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* EPLS Exclusion Check */}
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <Ban className="h-5 w-5 text-yellow-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">EPLS Exclusion Check</p>
                              <p className="text-xs text-gray-500">Excluded Parties List verification</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Clean
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument('epls_check')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadDocument('epls_check')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* Debarment List Check */}
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Debarment List Check</p>
                              <p className="text-xs text-gray-500">Debarment and suspension verification</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Clean
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument('debarment_check')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadDocument('debarment_check')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* Vendor Verification Summary */}
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Vendor Verification Summary</p>
                              <p className="text-xs text-gray-500">Complete verification audit trail</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Complete
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument('vendor_verification')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadDocument('vendor_verification')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Vendor verification documentation ensures compliance with federal acquisition regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Information Section */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Vendor Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Pre-Verified Vendor</h4>
                      <p className="text-sm text-gray-600">
                        This vendor has been pre-verified and is eligible for federal contracts
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Verified & Eligible
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">CAGE Code:</span>
                      <p className="text-gray-900">{reconcilingPurchase.vendorCageCode || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">DUNS Number:</span>
                      <p className="text-gray-900">{reconcilingPurchase.vendorDuns || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Verified:</span>
                      <p className="text-gray-900">{reconcilingPurchase.vendorLastVerified ? formatDate(reconcilingPurchase.vendorLastVerified) : 'N/A'}</p>
                    </div>
                  </div>
                  
                  {reconcilingPurchase.vendorVerificationNotes && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm font-medium text-gray-700 mb-1">Verification Notes:</p>
                      <p className="text-sm text-gray-600">{reconcilingPurchase.vendorVerificationNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Accounting Information */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Accounting Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accounting Code *
                    </label>
                    <select
                      value={reconciliationData.accountingCode}
                      onChange={(e) => setReconciliationData(prev => ({ ...prev, accountingCode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Accounting Code</option>
                      <option value="AC001">Child Care Operations</option>
                      <option value="AC002">Administrative Support</option>
                      <option value="AC003">Facility Maintenance</option>
                      <option value="AC004">Equipment & Supplies</option>
                      <option value="AC005">Technology & Software</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Center *
                    </label>
                    <select
                      value={reconciliationData.costCenter}
                      onChange={(e) => setReconciliationData(prev => ({ ...prev, costCenter: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Cost Center</option>
                      {costCenters.map(cc => (
                        <option key={cc.id} value={cc.id}>{cc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Order Justification
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-700">
                      <strong>Original Purchase Order Justification:</strong>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {reconcilingPurchase.justification || 'No justification provided in original purchase order'}
                    </p>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Reconciliation Notes (Optional)
                    </label>
                    <textarea
                      value={reconciliationData.justification}
                      onChange={(e) => setReconciliationData(prev => ({ ...prev, justification: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add any additional notes for reconciliation (e.g., price changes, delivery issues, etc.)..."
                    />
                  </div>
                </div>
              </div>

              {/* Compliance Checks */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Compliance Verification</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reconciliationData.complianceChecked}
                      onChange={(e) => setReconciliationData(prev => ({ ...prev, complianceChecked: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-sm">I verify this purchase complies with DOD MWR policies and regulations</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reconciliationData.supervisorApproved}
                      onChange={(e) => setReconciliationData(prev => ({ ...prev, supervisorApproved: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-sm">Supervisor approval obtained (if required by threshold)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReconciliation(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReconciliationSubmit}
                  disabled={isProcessing || !reconciliationData.receiptUploaded || !reconciliationData.accountingCode || !reconciliationData.costCenter}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Reconciliation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  <span>Purchase Settings</span>
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure your purchase card settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 overflow-y-auto flex-1">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-sm">Email notifications for purchase approvals</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-sm">SMS alerts for urgent reconciliations</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-sm">Weekly spending summary reports</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-sm">Vendor verification status updates</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Purchase Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Default Cost Center</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Select cost center...</option>
                        <option>CC-001 - Child Care Operations</option>
                        <option>CC-002 - Administrative</option>
                        <option>CC-003 - Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Default Accounting Code</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Select accounting code...</option>
                        <option>AC-001 - Supplies & Materials</option>
                        <option>AC-002 - Equipment</option>
                        <option>AC-003 - Services</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-sm">Require supervisor approval for purchases over $5,000</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-sm">Enable two-factor authentication for reconciliation</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-sm">Auto-logout after 30 minutes of inactivity</span>
                    </label>
                  </div>
                </div>

              </CardContent>
              <div className="flex justify-end space-x-3 pt-4 border-t px-6 pb-6 flex-shrink-0">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Settings saved successfully');
                  setShowSettings(false);
                }}>
                  Save Settings
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Notifications Modal */}
        {showNotifications && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  <span>Notifications</span>
                  <div className="flex items-center space-x-2">
                    {notifications.filter(n => !n.read).length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllNotificationsAsRead}
                      >
                        Mark All Read
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setShowNotifications(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Stay updated with your purchase activities and system alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-y-auto flex-1">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          notification.read 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-blue-50 border-blue-200'
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                notification.read ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className={`text-sm mt-1 ${
                                notification.read ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatNotificationTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Document Viewer Modal */}
        {showDocumentViewer && viewingDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{viewingDocument.title}</span>
                  <Button variant="outline" onClick={() => setShowDocumentViewer(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Document details for {viewingDocument.purchase?.vendor || 'Purchase'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Document Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Document Type:</span>
                      <p className="text-gray-900">{viewingDocument.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Purchase ID:</span>
                      <p className="text-gray-900">{viewingDocument.purchase?.id || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Vendor:</span>
                      <p className="text-gray-900">{viewingDocument.purchase?.vendor || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Amount:</span>
                      <p className="text-gray-900">{viewingDocument.purchase?.total ? formatCurrency(viewingDocument.purchase.total) : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <p className="text-gray-900">{viewingDocument.purchase?.createdAt ? formatDate(viewingDocument.purchase.createdAt) : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-900">{viewingDocument.purchase?.status || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Document Content */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Document Content</h3>
                  <div className="bg-white border rounded-lg p-6">
                    <div className="prose max-w-none">
                      {viewingDocument.type === 'purchase_request' && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Purchase Request Details</h4>
                          <div className="space-y-3">
                            <div>
                              <strong>Request ID:</strong> {viewingDocument.purchase?.requestId || 'N/A'}
                            </div>
                            <div>
                              <strong>Justification:</strong> {viewingDocument.purchase?.justification || 'No justification provided'}
                            </div>
                            <div>
                              <strong>Items Requested:</strong>
                              <ul className="mt-2 ml-4 space-y-1">
                                {viewingDocument.purchase?.items?.map((item: any, index: number) => (
                                  <li key={index} className="flex justify-between">
                                    <span>{item.name} (Qty: {item.qty})</span>
                                    <span>{formatCurrency(item.price * item.qty)}</span>
                                  </li>
                                )) || <li>No items specified</li>}
                              </ul>
                            </div>
                            <div>
                              <strong>Total Amount:</strong> {viewingDocument.purchase?.total ? formatCurrency(viewingDocument.purchase.total) : 'N/A'}
                            </div>
                            <div>
                              <strong>Need By Date:</strong> {viewingDocument.purchase?.needBy ? formatDate(viewingDocument.purchase.needBy) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      )}

                      {viewingDocument.type === 'purchase_order' && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Purchase Order Details</h4>
                          <div className="space-y-3">
                            <div>
                              <strong>PO Number:</strong> PO-{viewingDocument.purchase?.id || 'N/A'}
                            </div>
                            <div>
                              <strong>Vendor:</strong> {viewingDocument.purchase?.vendor || 'N/A'}
                            </div>
                            <div>
                              <strong>Card Number:</strong> {viewingDocument.purchase?.cardNumber || 'N/A'}
                            </div>
                            <div>
                              <strong>Purchase Date:</strong> {viewingDocument.purchase?.purchaseDate ? formatDate(viewingDocument.purchase.purchaseDate) : 'N/A'}
                            </div>
                            <div>
                              <strong>Items Ordered:</strong>
                              <ul className="mt-2 ml-4 space-y-1">
                                {viewingDocument.purchase?.items?.map((item: any, index: number) => (
                                  <li key={index} className="flex justify-between">
                                    <span>{item.name} (Qty: {item.qty})</span>
                                    <span>{formatCurrency(item.price * item.qty)}</span>
                                  </li>
                                )) || <li>No items specified</li>}
                              </ul>
                            </div>
                            <div>
                              <strong>Total Amount:</strong> {viewingDocument.purchase?.total ? formatCurrency(viewingDocument.purchase.total) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      )}

                      {viewingDocument.type === 'justification' && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Purchase Order Justification</h4>
                          <div className="space-y-3">
                            <div>
                              <strong>Justification:</strong>
                              <p className="mt-2 p-3 bg-gray-50 rounded border">
                                {viewingDocument.purchase?.justification || 'No justification provided in original purchase order'}
                              </p>
                            </div>
                            <div>
                              <strong>Business Need:</strong>
                              <p className="mt-2 p-3 bg-gray-50 rounded border">
                                This purchase supports DOD MWR child care operations and is necessary for maintaining quality services for military families.
                              </p>
                            </div>
                            <div>
                              <strong>Compliance:</strong>
                              <p className="mt-2 p-3 bg-gray-50 rounded border">
                                Purchase complies with DOD MWR policies and federal acquisition regulations. Vendor has been verified in SAM.gov and is eligible for federal contracts.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {viewingDocument.type === 'approval' && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Approval Documentation</h4>
                          <div className="space-y-3">
                            <div>
                              <strong>Approval Status:</strong>
                              <span className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                Approved
                              </span>
                            </div>
                            <div>
                              <strong>Approved By:</strong> Approving Official
                            </div>
                            <div>
                              <strong>Approval Date:</strong> {viewingDocument.purchase?.createdAt ? formatDate(viewingDocument.purchase.createdAt) : 'N/A'}
                            </div>
                            <div>
                              <strong>Approval Notes:</strong>
                              <p className="mt-2 p-3 bg-gray-50 rounded border">
                                Purchase request has been reviewed and approved for procurement. All required documentation is complete and vendor verification is current.
                              </p>
                            </div>
                            <div>
                              <strong>Approval Authority:</strong>
                              <p className="mt-2 p-3 bg-gray-50 rounded border">
                                This approval is based on delegated authority for micro-purchase transactions within established thresholds.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {viewingDocument.type === 'sam_verification' && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">SAM.gov Verification Report</h4>
                          <div className="space-y-3">
                            <div>
                              <strong>Vendor Name:</strong> {viewingDocument.purchase?.vendor || 'N/A'}
                            </div>
                            <div>
                              <strong>CAGE Code:</strong> {viewingDocument.purchase?.vendorCageCode || 'N/A'}
                            </div>
                            <div>
                              <strong>DUNS Number:</strong> {viewingDocument.purchase?.vendorDuns || 'N/A'}
                            </div>
                            <div>
                              <strong>Registration Status:</strong>
                              <span className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                            <div>
                              <strong>Verification Date:</strong> {viewingDocument.purchase?.vendorLastVerified ? formatDate(viewingDocument.purchase.vendorLastVerified) : 'N/A'}
                            </div>
                            <div>
                              <strong>Verification Notes:</strong>
                              <p className="mt-2 p-3 bg-gray-50 rounded border">
                                {viewingDocument.purchase?.vendorVerificationNotes || 'Vendor verified in SAM.gov - Active and eligible for federal contracts'}
                              </p>
                            </div>
                            <div>
                              <strong>Compliance Status:</strong>
                              <p className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                                ✅ Vendor is registered and active in SAM.gov<br/>
                                ✅ Eligible for federal government contracts<br/>
                                ✅ Registration current and valid
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {viewingDocument.type === 'epls_check' && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">EPLS Exclusion Check Report</h4>
                          <div className="space-y-3">
                            <div>
                              <strong>Vendor Name:</strong> {viewingDocument.purchase?.vendor || 'N/A'}
                            </div>
                            <div>
                              <strong>Check Date:</strong> {viewingDocument.purchase?.vendorLastVerified ? formatDate(viewingDocument.purchase.vendorLastVerified) : 'N/A'}
                            </div>
                            <div>
                              <strong>Exclusion Status:</strong>
                              <span className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                Clean - No Exclusions Found
                              </span>
                            </div>
                            <div>
                              <strong>Check Results:</strong>
                              <p className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                                ✅ No exclusions found in EPLS (Excluded Parties List)<br/>
                                ✅ Vendor is not suspended or debarred<br/>
                                ✅ Eligible to receive federal contracts
                              </p>
                            </div>
                            <div>
                              <strong>Verification Method:</strong>
                              <p className="mt-2 p-3 bg-gray-50 rounded border">
                                Automated check against current EPLS database maintained by GSA. 
                                Search conducted using vendor name, CAGE code, and DUNS number.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {viewingDocument.type === 'debarment_check' && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Debarment List Check Report</h4>
                          <div className="space-y-3">
                            <div>
                              <strong>Vendor Name:</strong> {viewingDocument.purchase?.vendor || 'N/A'}
                            </div>
                            <div>
                              <strong>Check Date:</strong> {viewingDocument.purchase?.vendorLastVerified ? formatDate(viewingDocument.purchase.vendorLastVerified) : 'N/A'}
                            </div>
                            <div>
                              <strong>Debarment Status:</strong>
                              <span className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                Clean - No Debarments Found
                              </span>
                            </div>
                            <div>
                              <strong>Check Results:</strong>
                              <p className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                                ✅ No debarments found in federal debarment database<br/>
                                ✅ Vendor is not suspended from federal contracting<br/>
                                ✅ No administrative actions pending
                              </p>
                            </div>
                            <div>
                              <strong>Verification Method:</strong>
                              <p className="mt-2 p-3 bg-gray-50 rounded border">
                                Comprehensive check against federal debarment and suspension databases 
                                including SAM.gov exclusions, agency-specific lists, and administrative actions.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {viewingDocument.type === 'vendor_verification' && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Complete Vendor Verification Summary</h4>
                          <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h5 className="font-medium text-blue-900 mb-2">Vendor Information</h5>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><strong>Name:</strong> {viewingDocument.purchase?.vendor || 'N/A'}</div>
                                <div><strong>CAGE Code:</strong> {viewingDocument.purchase?.vendorCageCode || 'N/A'}</div>
                                <div><strong>DUNS Number:</strong> {viewingDocument.purchase?.vendorDuns || 'N/A'}</div>
                                <div><strong>Verification Date:</strong> {viewingDocument.purchase?.vendorLastVerified ? formatDate(viewingDocument.purchase.vendorLastVerified) : 'N/A'}</div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h5 className="font-medium text-green-900 mb-2">Verification Results</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                  <span>SAM.gov Registration: Active and Current</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                  <span>EPLS Exclusion Check: Clean - No Exclusions</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                  <span>Debarment Check: Clean - No Debarments</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                  <span>Federal Eligibility: Confirmed</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border">
                              <h5 className="font-medium text-gray-900 mb-2">Compliance Summary</h5>
                              <p className="text-sm text-gray-700">
                                This vendor has been thoroughly verified and is eligible to receive federal government contracts. 
                                All required verification checks have been completed and passed. The vendor is registered in SAM.gov, 
                                not listed on any exclusion lists, and has no pending administrative actions.
                              </p>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                              <h5 className="font-medium text-yellow-900 mb-2">Audit Trail</h5>
                              <div className="text-sm text-yellow-800">
                                <p><strong>Verification Performed By:</strong> Purchase Cardholder</p>
                                <p><strong>Verification Date:</strong> {viewingDocument.purchase?.vendorLastVerified ? formatDate(viewingDocument.purchase.vendorLastVerified) : 'N/A'}</p>
                                <p><strong>Verification Method:</strong> Automated system checks against federal databases</p>
                                <p><strong>Next Verification Due:</strong> {viewingDocument.purchase?.vendorLastVerified ? formatDate(new Date(viewingDocument.purchase.vendorLastVerified.getTime() + 365 * 24 * 60 * 60 * 1000)) : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadDocument(viewingDocument.type)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDocumentViewer(false)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Modal */}
        {showReports && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Purchase Reports & Analytics</span>
                  <Button variant="outline" onClick={() => setShowReports(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Comprehensive reports and analytics for purchase card activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Report Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Spending Reports */}
                  <Card 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleReportClick('spending')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Spending Reports</h3>
                        <p className="text-sm text-gray-600">Monthly, quarterly, and annual spending analysis</p>
                      </div>
                    </div>
                  </Card>

                  {/* Vendor Analysis */}
                  <Card 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleReportClick('vendor')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Vendor Analysis</h3>
                        <p className="text-sm text-gray-600">Vendor performance and spending patterns</p>
                      </div>
                    </div>
                  </Card>

                  {/* Compliance Reports */}
                  <Card 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleReportClick('compliance')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Shield className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Compliance Reports</h3>
                        <p className="text-sm text-gray-600">DOD MWR policy compliance and audit reports</p>
                      </div>
                    </div>
                  </Card>

                  {/* Reconciliation Status */}
                  <Card 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleReportClick('reconciliation')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Reconciliation Status</h3>
                        <p className="text-sm text-gray-600">Pending and completed reconciliations</p>
                      </div>
                    </div>
                  </Card>

                  {/* Budget Analysis */}
                  <Card 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleReportClick('budget')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Target className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Budget Analysis</h3>
                        <p className="text-sm text-gray-600">Budget utilization and forecasting</p>
                      </div>
                    </div>
                  </Card>

                  {/* Export Data */}
                  <Card 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleReportClick('export')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Download className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Export Data</h3>
                        <p className="text-sm text-gray-600">Export purchase data for external analysis</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Spending</p>
                        <p className="text-2xl font-bold text-blue-900">$45,250</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Active Vendors</p>
                        <p className="text-2xl font-bold text-green-900">23</p>
                      </div>
                      <Building2 className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-1">+3 new this month</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">Pending Reconciliations</p>
                        <p className="text-2xl font-bold text-yellow-900">7</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">Due within 3 days</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Compliance Rate</p>
                        <p className="text-2xl font-bold text-purple-900">98.5%</p>
                      </div>
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-xs text-purple-600 mt-1">Above target</p>
                  </div>
                </div>

                {/* Report Detail View */}
                {selectedReportType && reportData && (
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{reportData.title}</h3>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedReportType(null);
                          setReportData(null);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Close Report
                      </Button>
                    </div>
                    
                    {selectedReportType === 'spending' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-blue-600">Total Spending</p>
                            <p className="text-2xl font-bold text-blue-900">{formatCurrency(reportData.data.totalSpending)}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-600">Monthly Spending</p>
                            <p className="text-2xl font-bold text-green-900">{formatCurrency(reportData.data.monthlySpending)}</p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-purple-600">Average Purchase</p>
                            <p className="text-2xl font-bold text-purple-900">{formatCurrency(reportData.data.averagePurchase)}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Category Breakdown</h4>
                            <div className="space-y-2">
                              {Object.entries(reportData.data.categoryBreakdown).map(([category, amount]) => (
                                <div key={category} className="flex justify-between items-center">
                                  <span className="capitalize">{category}</span>
                                  <span className="font-semibold">{formatCurrency(amount as number)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3">Top Vendors</h4>
                            <div className="space-y-2">
                              {reportData.data.topVendors.map(([vendor, amount]: [string, number]) => (
                                <div key={vendor} className="flex justify-between items-center">
                                  <span>{vendor}</span>
                                  <span className="font-semibold">{formatCurrency(amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedReportType === 'vendor' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-600">Total Vendors</p>
                            <p className="text-2xl font-bold text-green-900">{reportData.data.totalVendors}</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-blue-600">Top Vendor</p>
                            <p className="text-lg font-bold text-blue-900">{reportData.data.topVendor?.[0] || 'N/A'}</p>
                            <p className="text-sm text-blue-600">{formatCurrency(reportData.data.topVendor?.[1] || 0)}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Vendor Performance</h4>
                          <div className="space-y-2">
                            {reportData.data.vendorStats.slice(0, 10).map((vendor: any) => (
                              <div key={vendor.vendor} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">{vendor.vendor}</p>
                                  <p className="text-sm text-gray-600">{vendor.purchaseCount} purchases</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{formatCurrency(vendor.totalSpent)}</p>
                                  <p className="text-sm text-gray-600">{formatDate(vendor.lastPurchase)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedReportType === 'compliance' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-600">Compliance Rate</p>
                            <p className="text-2xl font-bold text-green-900">{reportData.data.complianceRate.toFixed(1)}%</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-blue-600">Total Purchases</p>
                            <p className="text-2xl font-bold text-blue-900">{reportData.data.totalPurchases}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-600">Compliant</p>
                            <p className="text-2xl font-bold text-green-900">{reportData.data.compliantPurchases}</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-red-600">Non-Compliant</p>
                            <p className="text-2xl font-bold text-red-900">{reportData.data.nonCompliantPurchases}</p>
                          </div>
                        </div>
                        
                        {reportData.data.issues.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3 text-red-600">Compliance Issues</h4>
                            <div className="space-y-2">
                              {reportData.data.issues.map((issue: any) => (
                                <div key={issue.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                  <div>
                                    <p className="font-medium">{issue.vendor}</p>
                                    <p className="text-sm text-red-600">{issue.issue}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(issue.amount)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedReportType === 'reconciliation' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-yellow-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-900">{reportData.data.pending}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-600">Completed</p>
                            <p className="text-2xl font-bold text-green-900">{reportData.data.completed}</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-red-600">Overdue</p>
                            <p className="text-2xl font-bold text-red-900">{reportData.data.overdue}</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-blue-600">Completion Rate</p>
                            <p className="text-2xl font-bold text-blue-900">{reportData.data.completionRate.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedReportType === 'budget' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-blue-600">Monthly Budget</p>
                            <p className="text-2xl font-bold text-blue-900">{formatCurrency(reportData.data.monthlyBudget)}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-600">Current Spending</p>
                            <p className="text-2xl font-bold text-green-900">{formatCurrency(reportData.data.currentSpending)}</p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-purple-600">Remaining</p>
                            <p className="text-2xl font-bold text-purple-900">{formatCurrency(reportData.data.remainingBudget)}</p>
                          </div>
                          <div className={`p-4 rounded-lg ${
                            reportData.data.budgetStatus === 'Critical' ? 'bg-red-50' :
                            reportData.data.budgetStatus === 'Warning' ? 'bg-yellow-50' : 'bg-green-50'
                          }`}>
                            <p className={`text-sm font-medium ${
                              reportData.data.budgetStatus === 'Critical' ? 'text-red-600' :
                              reportData.data.budgetStatus === 'Warning' ? 'text-yellow-600' : 'text-green-600'
                            }`}>Budget Status</p>
                            <p className={`text-2xl font-bold ${
                              reportData.data.budgetStatus === 'Critical' ? 'text-red-900' :
                              reportData.data.budgetStatus === 'Warning' ? 'text-yellow-900' : 'text-green-900'
                            }`}>{reportData.data.budgetStatus}</p>
                            <p className="text-xs text-gray-600">{reportData.data.budgetUtilization.toFixed(1)}% utilized</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Recent Activity */}
                {!selectedReportType && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {mockPurchases.slice(0, 5).map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg">
                              <Receipt className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{purchase.vendor}</p>
                              <p className="text-sm text-gray-600">{formatDate(purchase.createdAt)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(purchase.total)}</p>
                            <p className="text-sm text-gray-600">{purchase.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowReports(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success('Report generated successfully');
                      setShowReports(false);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>DOD MWR Purchase Card Help & Support</span>
                  <Button variant="outline" onClick={() => setShowHelp(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Comprehensive help and guidance for purchase card operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Start Guide */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Quick Start Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">1. Create Purchase Order</h4>
                      <p className="text-sm text-blue-700">Click "Create Purchase Order" to start a new purchase. Ensure vendor is verified before proceeding.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">2. Verify Vendors</h4>
                      <p className="text-sm text-green-700">All vendors must be SAM.gov verified and eligible for federal business before purchase.</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">3. Reconcile Purchases</h4>
                      <p className="text-sm text-yellow-700">Complete reconciliation within 7 days of purchase with all required documentation.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">4. Generate Reports</h4>
                      <p className="text-sm text-purple-700">Use the Reports section to generate compliance and spending reports for audits.</p>
                    </div>
                  </div>
                </div>

                {/* DOD MWR Thresholds */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Purchase Card Thresholds</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">General Purchases</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Micro-purchase: Up to $10,000</li>
                          <li>• Construction: Up to $2,000</li>
                          <li>• Services: Up to $2,500</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Emergency Operations</h4>
                        <ul className="text-sm space-y-1">
                          <li>• US Operations: Up to $20,000</li>
                          <li>• Overseas Operations: Up to $25,000</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-red-600 mt-3 font-semibold">
                      ⚠️ Purchases exceeding these limits require alternative procurement methods
                    </p>
                  </div>
                </div>

                {/* Required Documentation */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Required Documentation</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Vendor Receipt/Invoice</h4>
                        <p className="text-sm text-gray-600">Original receipt showing itemized charges and payment method</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Purchase Order</h4>
                        <p className="text-sm text-gray-600">Generated purchase order with vendor and item details</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Vendor Verification</h4>
                        <p className="text-sm text-gray-600">SAM.gov verification and exclusion list checks</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Approval Documentation</h4>
                        <p className="text-sm text-gray-600">Required approvals based on purchase amount and category</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Common Issues */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Common Issues & Solutions</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                      <h4 className="font-semibold text-yellow-800">Vendor Not Verified</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Solution: Use the "Add New Vendor" feature to verify vendor through SAM.gov before making purchase
                      </p>
                    </div>
                    <div className="border-l-4 border-red-400 bg-red-50 p-4">
                      <h4 className="font-semibold text-red-800">Purchase Exceeds Threshold</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Solution: Contact contracting office for alternative procurement methods or split purchase
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                      <h4 className="font-semibold text-blue-800">Reconciliation Issues</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Solution: Ensure all required documents are uploaded and price verification is completed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Support & Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Technical Support</h4>
                      <p className="text-sm text-gray-600">Email: support@procureflow.mil</p>
                      <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Procurement Office</h4>
                      <p className="text-sm text-gray-600">Email: procurement@dod.mil</p>
                      <p className="text-sm text-gray-600">Phone: (555) 987-6543</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowHelp(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      window.open('mailto:support@procureflow.mil?subject=Purchase Card Support Request', '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contact Support
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
