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
import { formatCurrency, formatDate } from '@/lib/utils';
import { RequestStatus } from '@/lib/types';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock audit data
const mockAuditData = [
  {
    id: '1',
    requestId: '1',
    vendor: 'Home Depot',
    total: 1250.0,
    status: 'Reconciled' as RequestStatus,
    createdAt: new Date('2024-01-15'),
    completedAt: new Date('2024-01-22'),
    requester: {
      name: 'Jane Doe',
      email: 'jane.doe@mwr.com',
    },
    cardholder: {
      name: 'Bob Johnson',
      email: 'bob.johnson@mwr.com',
    },
    approver: {
      name: 'John Smith',
      email: 'john.smith@mwr.com',
    },
    auditStatus: 'compliant',
    violations: [],
    notes: 'All documentation in order',
  },
  {
    id: '2',
    requestId: '2',
    vendor: 'Office Depot',
    total: 850.0,
    status: 'Reconciled' as RequestStatus,
    createdAt: new Date('2024-01-16'),
    completedAt: new Date('2024-01-23'),
    requester: {
      name: 'Bob Smith',
      email: 'bob.smith@mwr.com',
    },
    cardholder: {
      name: 'Bob Johnson',
      email: 'bob.johnson@mwr.com',
    },
    approver: {
      name: 'John Smith',
      email: 'john.smith@mwr.com',
    },
    auditStatus: 'violation',
    violations: ['Missing receipt', 'Incomplete justification'],
    notes: 'Receipt not uploaded within 48 hours',
  },
  {
    id: '3',
    requestId: '3',
    vendor: 'Amazon Business',
    total: 2400.0,
    status: 'Reconciled' as RequestStatus,
    createdAt: new Date('2024-01-17'),
    completedAt: new Date('2024-01-24'),
    requester: {
      name: 'Alice Johnson',
      email: 'alice.johnson@mwr.com',
    },
    cardholder: {
      name: 'Bob Johnson',
      email: 'bob.johnson@mwr.com',
    },
    approver: {
      name: 'John Smith',
      email: 'john.smith@mwr.com',
    },
    auditStatus: 'pending',
    violations: [],
    notes: 'Under review',
  },
  {
    id: '4',
    requestId: '4',
    vendor: 'Staples',
    total: 320.0,
    status: 'Closed' as RequestStatus,
    createdAt: new Date('2024-01-10'),
    completedAt: new Date('2024-01-20'),
    requester: {
      name: 'Charlie Brown',
      email: 'charlie.brown@mwr.com',
    },
    cardholder: {
      name: 'Bob Johnson',
      email: 'bob.johnson@mwr.com',
    },
    approver: {
      name: 'John Smith',
      email: 'john.smith@mwr.com',
    },
    auditStatus: 'compliant',
    violations: [],
    notes: 'All documentation verified',
  },
];

export default function AuditPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [auditData, setAuditData] = useState(mockAuditData);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [auditStatusFilter, setAuditStatusFilter] = useState('all');

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

  // Check if user has audit permissions
  if (!['auditor', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the audit page.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const filteredData = auditData.filter(item => {
    const matchesSearch =
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requestId.includes(searchTerm);
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    const matchesAuditStatus =
      auditStatusFilter === 'all' || item.auditStatus === auditStatusFilter;
    return matchesSearch && matchesStatus && matchesAuditStatus;
  });

  const getAuditStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'violation':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-50';
      case 'violation':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const totalValue = auditData.reduce((sum, item) => sum + item.total, 0);
  const compliantCount = auditData.filter(
    item => item.auditStatus === 'compliant'
  ).length;
  const violationCount = auditData.filter(
    item => item.auditStatus === 'violation'
  ).length;
  const pendingCount = auditData.filter(
    item => item.auditStatus === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Audit Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Review and audit completed procurement requests for compliance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Value Audited
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalValue)}
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
                  <p className="text-sm font-medium text-gray-500">Compliant</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {compliantCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Violations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {violationCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Pending Review
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by vendor, requester, or ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Status
                </label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Reconciled">Reconciled</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audit Status
                </label>
                <select
                  value={auditStatusFilter}
                  onChange={e => setAuditStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Audit Statuses</option>
                  <option value="compliant">Compliant</option>
                  <option value="violation">Violation</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit List */}
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No audit records found
                </h3>
                <p className="text-gray-500">
                  No completed requests match your current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredData.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Request #{item.requestId}
                        </h3>
                        <StatusBadge status={item.status} />
                        <div className="flex items-center space-x-2">
                          {getAuditStatusIcon(item.auditStatus)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getAuditStatusColor(
                              item.auditStatus
                            )}`}
                          >
                            {item.auditStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Vendor:</span>{' '}
                          {item.vendor}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>{' '}
                          {formatCurrency(item.total)}
                        </div>
                        <div>
                          <span className="font-medium">Completed:</span>{' '}
                          {formatDate(item.completedAt)}
                        </div>
                        <div>
                          <span className="font-medium">Requester:</span>{' '}
                          {item.requester.name}
                        </div>
                        <div>
                          <span className="font-medium">Cardholder:</span>{' '}
                          {item.cardholder.name}
                        </div>
                        <div>
                          <span className="font-medium">Approver:</span>{' '}
                          {item.approver.name}
                        </div>
                      </div>
                      {item.violations.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-red-600">
                            Violations:
                          </span>
                          <ul className="text-sm text-red-600 ml-4 list-disc">
                            {item.violations.map(
                              (violation: string, index: number) => (
                                <li key={index}>{violation}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                      <p className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Notes:</span> {item.notes}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAudit(item)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
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

        {/* Audit Detail Modal */}
        {selectedAudit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>
                  Audit Details - Request #{selectedAudit.requestId}
                </CardTitle>
                <CardDescription>
                  Complete audit information for this procurement request.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Request Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">
                          Vendor:
                        </span>{' '}
                        {selectedAudit.vendor}
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Total:
                        </span>{' '}
                        {formatCurrency(selectedAudit.total)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Status:
                        </span>{' '}
                        <StatusBadge status={selectedAudit.status} />
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Created:
                        </span>{' '}
                        {formatDate(selectedAudit.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Completed:
                        </span>{' '}
                        {formatDate(selectedAudit.completedAt)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      People Involved
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">
                          Requester:
                        </span>{' '}
                        {selectedAudit.requester.name} (
                        {selectedAudit.requester.email})
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Cardholder:
                        </span>{' '}
                        {selectedAudit.cardholder.name} (
                        {selectedAudit.cardholder.email})
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Approver:
                        </span>{' '}
                        {selectedAudit.approver.name} (
                        {selectedAudit.approver.email})
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Audit Results
                  </h4>
                  <div className="flex items-center space-x-2 mb-3">
                    {getAuditStatusIcon(selectedAudit.auditStatus)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getAuditStatusColor(
                        selectedAudit.auditStatus
                      )}`}
                    >
                      {selectedAudit.auditStatus.toUpperCase()}
                    </span>
                  </div>
                  {selectedAudit.violations.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium text-red-600 mb-2">
                        Violations Found:
                      </h5>
                      <ul className="text-sm text-red-600 ml-4 list-disc">
                        {selectedAudit.violations.map(
                          (violation: string, index: number) => (
                            <li key={index}>{violation}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      Audit Notes:
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedAudit.notes}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => setSelectedAudit(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
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
