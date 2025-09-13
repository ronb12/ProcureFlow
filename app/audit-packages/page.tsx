'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { AuditPackageViewer } from '@/components/ui/audit-package-viewer';
import { formatDate, formatCurrency } from '@/lib/utils';
import { AuditPackage } from '@/lib/audit-package';
import {
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Shield,
  Plus,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock audit packages data
const mockAuditPackages: AuditPackage[] = [
  {
    requestId: 'REQ-2024-001',
    poId: 'PO-2024-001',
    purchaseId: 'PUR-2024-001',
    cardholderId: 'cardholder1',
    approverId: 'approver1',
    orgId: 'org1',
    documents: {
      purchase_request: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/req-001.pdf',
        lastUpdated: new Date('2024-01-15'),
        issues: []
      },
      approval_document: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/approval-001.pdf',
        lastUpdated: new Date('2024-01-16'),
        issues: []
      },
      purchase_order: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/po-001.pdf',
        lastUpdated: new Date('2024-01-17'),
        issues: []
      },
      receipt: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/receipt-001.pdf',
        lastUpdated: new Date('2024-01-20'),
        issues: []
      },
      delivery_confirmation: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/delivery-001.pdf',
        lastUpdated: new Date('2024-01-21'),
        issues: []
      },
      reconciliation_document: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/reconciliation-001.pdf',
        lastUpdated: new Date('2024-01-22'),
        issues: []
      },
      policy_compliance_check: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/compliance-001.pdf',
        lastUpdated: new Date('2024-01-15'),
        issues: []
      },
      vendor_verification: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/vendor-001.pdf',
        lastUpdated: new Date('2024-01-15'),
        issues: []
      },
      cardholder_certification: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/cardholder-001.pdf',
        lastUpdated: new Date('2024-01-15'),
        issues: []
      },
      approving_official_certification: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/approver-001.pdf',
        lastUpdated: new Date('2024-01-16'),
        issues: []
      }
    },
    complianceChecks: {
      micro_purchase_limit: {
        passed: true,
        value: 1250,
        limit: 3000,
        compliant: true,
        issues: []
      },
      split_purchase_detection: {
        passed: true,
        detected: false,
        compliant: true,
        issues: []
      },
      blocked_merchant_check: {
        passed: true,
        blocked: false,
        compliant: true,
        issues: []
      },
      vendor_approval_status: {
        passed: true,
        approved: true,
        compliant: true,
        issues: []
      },
      delivery_address_validation: {
        passed: true,
        valid: true,
        compliant: true,
        issues: []
      },
      accounting_code_verification: {
        passed: true,
        valid: true,
        compliant: true,
        issues: []
      },
      justification_adequacy: {
        passed: true,
        adequate: true,
        compliant: true,
        issues: []
      },
      receipt_legibility: {
        passed: true,
        legible: true,
        compliant: true,
        issues: []
      },
      purchase_order_accuracy: {
        passed: true,
        accurate: true,
        compliant: true,
        issues: []
      },
      reconciliation_completeness: {
        passed: true,
        complete: true,
        compliant: true,
        issues: []
      }
    },
    status: 'audit_ready',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-22'),
    lastAuditedAt: new Date('2024-01-22'),
    auditScore: 100,
    totalIssues: 0,
    criticalIssues: 0,
    warnings: 0,
    exportUrl: '/exports/audit-package-001.zip',
    exportGeneratedAt: new Date('2024-01-22'),
    exportExpiresAt: new Date('2024-02-21')
  },
  {
    requestId: 'REQ-2024-002',
    poId: 'PO-2024-002',
    purchaseId: 'PUR-2024-002',
    cardholderId: 'cardholder2',
    approverId: 'approver1',
    orgId: 'org1',
    documents: {
      purchase_request: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/req-002.pdf',
        lastUpdated: new Date('2024-01-18'),
        issues: []
      },
      approval_document: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/approval-002.pdf',
        lastUpdated: new Date('2024-01-19'),
        issues: []
      },
      purchase_order: {
        present: true,
        complete: false,
        compliant: false,
        fileUrl: '/documents/po-002.pdf',
        lastUpdated: new Date('2024-01-20'),
        issues: ['Missing vendor signature', 'Incomplete delivery terms']
      },
      receipt: {
        present: false,
        complete: false,
        compliant: false,
        fileUrl: '',
        lastUpdated: new Date('2024-01-20'),
        issues: ['Receipt not uploaded']
      },
      delivery_confirmation: {
        present: false,
        complete: false,
        compliant: false,
        fileUrl: '',
        lastUpdated: new Date('2024-01-20'),
        issues: ['Delivery confirmation missing']
      },
      reconciliation_document: {
        present: false,
        complete: false,
        compliant: false,
        fileUrl: '',
        lastUpdated: new Date('2024-01-20'),
        issues: ['Reconciliation not completed']
      },
      policy_compliance_check: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/compliance-002.pdf',
        lastUpdated: new Date('2024-01-18'),
        issues: []
      },
      vendor_verification: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/vendor-002.pdf',
        lastUpdated: new Date('2024-01-18'),
        issues: []
      },
      cardholder_certification: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/cardholder-002.pdf',
        lastUpdated: new Date('2024-01-18'),
        issues: []
      },
      approving_official_certification: {
        present: true,
        complete: true,
        compliant: true,
        fileUrl: '/documents/approver-002.pdf',
        lastUpdated: new Date('2024-01-19'),
        issues: []
      }
    },
    complianceChecks: {
      micro_purchase_limit: {
        passed: true,
        value: 2500,
        limit: 3000,
        compliant: true,
        issues: []
      },
      split_purchase_detection: {
        passed: true,
        detected: false,
        compliant: true,
        issues: []
      },
      blocked_merchant_check: {
        passed: true,
        blocked: false,
        compliant: true,
        issues: []
      },
      vendor_approval_status: {
        passed: true,
        approved: true,
        compliant: true,
        issues: []
      },
      delivery_address_validation: {
        passed: true,
        valid: true,
        compliant: true,
        issues: []
      },
      accounting_code_verification: {
        passed: true,
        valid: true,
        compliant: true,
        issues: []
      },
      justification_adequacy: {
        passed: true,
        adequate: true,
        compliant: true,
        issues: []
      },
      receipt_legibility: {
        passed: false,
        legible: false,
        compliant: false,
        issues: ['Receipt not available for legibility check']
      },
      purchase_order_accuracy: {
        passed: false,
        accurate: false,
        compliant: false,
        issues: ['PO accuracy cannot be verified without complete PO']
      },
      reconciliation_completeness: {
        passed: false,
        complete: false,
        compliant: false,
        issues: ['Reconciliation not completed']
      }
    },
    status: 'incomplete',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
    auditScore: 45,
    totalIssues: 8,
    criticalIssues: 4,
    warnings: 4
  }
];

export default function AuditPackagesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [auditPackages, setAuditPackages] = useState<AuditPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<AuditPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<AuditPackage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load audit packages
  useEffect(() => {
    const loadAuditPackages = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAuditPackages(mockAuditPackages);
        setFilteredPackages(mockAuditPackages);
      } catch (error) {
        console.error('Error loading audit packages:', error);
        toast.error('Failed to load audit packages');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadAuditPackages();
    }
  }, [user]);

  // Filter audit packages
  useEffect(() => {
    let filtered = auditPackages;

    if (searchTerm) {
      filtered = filtered.filter(pkg => 
        pkg.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.poId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.purchaseId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.status === statusFilter);
    }

    setFilteredPackages(filtered);
  }, [auditPackages, searchTerm, statusFilter]);

  const handleViewPackage = (auditPackage: AuditPackage) => {
    setSelectedPackage(auditPackage);
  };

  const handleDownloadPackage = (auditPackage: AuditPackage) => {
    if (auditPackage.exportUrl) {
      // TODO: Implement actual download
      toast.success('Downloading audit package...');
    } else {
      toast.error('Audit package not ready for download');
    }
  };

  const handleFixIssue = (issue: string) => {
    toast(`Redirecting to fix: ${issue}`);
    // TODO: Implement issue fixing workflow
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'audit_ready':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending_review':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'non_compliant':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'incomplete':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedPackage(null)}
              className="mb-4"
            >
              ← Back to Audit Packages
            </Button>
            <AuditPackageViewer
              auditPackage={selectedPackage}
              onDownload={() => handleDownloadPackage(selectedPackage)}
              onViewDocument={(docType) => toast(`Viewing ${docType}`)}
              onFixIssue={handleFixIssue}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Audit Packages</h1>
          <p className="mt-2 text-gray-600">
            Manage and review DOD MWR compliance audit packages
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Request ID, PO ID, or Purchase ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="audit_ready">Audit Ready</option>
                  <option value="compliant">Compliant</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="non_compliant">Non-Compliant</option>
                  <option value="incomplete">Incomplete</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Packages List */}
        <div className="space-y-4">
          {filteredPackages.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Audit Packages Found</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No audit packages have been created yet.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredPackages.map((auditPackage) => (
              <Card key={auditPackage.requestId} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(auditPackage.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {auditPackage.requestId}
                        </h3>
                        <div className="text-sm text-gray-600">
                          PO: {auditPackage.poId} • Purchase: {auditPackage.purchaseId}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {formatDate(auditPackage.createdAt)} • 
                          Updated: {formatDate(auditPackage.updatedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <StatusBadge status={auditPackage.status} />
                          {auditPackage.auditScore && (
                            <span className="text-sm font-medium">
                              {auditPackage.auditScore}/100
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {auditPackage.totalIssues} issues • 
                          {auditPackage.criticalIssues} critical
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPackage(auditPackage)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {auditPackage.status === 'audit_ready' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPackage(auditPackage)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* DOD MWR Compliance Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900">DOD MWR Compliance Requirements</h3>
                <p className="text-sm text-blue-800 mt-1">
                  All audit packages must include complete documentation and pass all compliance checks 
                  according to DOD MWR policies and guidelines. Packages are retained for 6 years 
                  and must be audit-ready before closure.
                </p>
                <div className="mt-2 text-xs text-blue-700">
                  <strong>Required Documents:</strong> Purchase Request, Approval, PO, Receipt, 
                  Delivery Confirmation, Reconciliation, Policy Compliance, Vendor Verification, 
                  Cardholder Certification, Approving Official Certification
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
