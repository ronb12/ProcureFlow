import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Generate static params for the dynamic route
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

// Mock data for individual audit packages
const mockAuditPackageDetails = {
  '1': {
    id: '1',
    requestId: 'REQ-2024-001',
    status: 'audit_ready',
    auditScore: 95,
    totalIssues: 0,
    criticalIssues: 0,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-22',
    cardholder: 'John Smith',
    approver: 'Jane Doe',
    vendor: 'Office Supplies Inc.',
    amount: 1250.00,
    description: 'Office supplies for Q1 2024',
    documents: [
      'Purchase Request',
      'Approval Document',
      'Purchase Order',
      'Receipt',
      'Delivery Confirmation',
      'Reconciliation Document'
    ],
    complianceChecks: [
      'Micro-purchase limit check: PASSED',
      'Split purchase detection: PASSED',
      'Blocked merchant check: PASSED',
      'Vendor approval status: PASSED',
      'Delivery address validation: PASSED'
    ]
  },
  '2': {
    id: '2',
    requestId: 'REQ-2024-002',
    status: 'incomplete',
    auditScore: 45,
    totalIssues: 8,
    criticalIssues: 4,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20',
    cardholder: 'Mike Johnson',
    approver: 'Sarah Wilson',
    vendor: 'Tech Solutions LLC',
    amount: 2500.00,
    description: 'Computer equipment for new office',
    documents: [
      'Purchase Request',
      'Approval Document',
      'Purchase Order (Incomplete)',
      'Receipt (Missing)',
      'Delivery Confirmation (Missing)',
      'Reconciliation Document (Missing)'
    ],
    complianceChecks: [
      'Micro-purchase limit check: PASSED',
      'Split purchase detection: PASSED',
      'Blocked merchant check: PASSED',
      'Vendor approval status: PASSED',
      'Delivery address validation: FAILED'
    ]
  },
  '3': {
    id: '3',
    requestId: 'REQ-2024-003',
    status: 'compliant',
    auditScore: 88,
    totalIssues: 0,
    criticalIssues: 0,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25',
    cardholder: 'Alice Brown',
    approver: 'Bob Green',
    vendor: 'Office Depot',
    amount: 750.00,
    description: 'Office furniture and supplies',
    documents: [
      'Purchase Request',
      'Approval Document',
      'Purchase Order',
      'Receipt',
      'Delivery Confirmation',
      'Reconciliation Document'
    ],
    complianceChecks: [
      'Micro-purchase limit check: PASSED',
      'Split purchase detection: PASSED',
      'Blocked merchant check: PASSED',
      'Vendor approval status: PASSED',
      'Delivery address validation: PASSED'
    ]
  },
  '4': {
    id: '4',
    requestId: 'REQ-2024-004',
    status: 'pending_review',
    auditScore: 75,
    totalIssues: 2,
    criticalIssues: 0,
    createdAt: '2024-01-22',
    updatedAt: '2024-01-28',
    cardholder: 'Carol Davis',
    approver: 'David Wilson',
    vendor: 'Amazon Business',
    amount: 1800.00,
    description: 'IT equipment and software licenses',
    documents: [
      'Purchase Request',
      'Approval Document',
      'Purchase Order',
      'Receipt (Pending)',
      'Delivery Confirmation',
      'Reconciliation Document (Pending)'
    ],
    complianceChecks: [
      'Micro-purchase limit check: PASSED',
      'Split purchase detection: PASSED',
      'Blocked merchant check: PASSED',
      'Vendor approval status: PASSED',
      'Delivery address validation: PASSED'
    ]
  },
  '5': {
    id: '5',
    requestId: 'REQ-2024-005',
    status: 'non_compliant',
    auditScore: 25,
    totalIssues: 15,
    criticalIssues: 10,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-30',
    cardholder: 'Eve Miller',
    approver: 'Frank Taylor',
    vendor: 'Unapproved Vendor LLC',
    amount: 5000.00,
    description: 'Equipment purchase exceeding limits',
    documents: [
      'Purchase Request (Incomplete)',
      'Approval Document (Missing)',
      'Purchase Order (Invalid)',
      'Receipt (Missing)',
      'Delivery Confirmation (Missing)',
      'Reconciliation Document (Missing)'
    ],
    complianceChecks: [
      'Micro-purchase limit check: FAILED',
      'Split purchase detection: FAILED',
      'Blocked merchant check: FAILED',
      'Vendor approval status: FAILED',
      'Delivery address validation: FAILED'
    ]
  }
};

export default function AuditPackageDetailPage({ params }: { params: { id: string } }) {
  const packageId = params.id;
  const auditPackage = mockAuditPackageDetails[packageId as keyof typeof mockAuditPackageDetails];

  if (!auditPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h1>
          <p className="text-gray-600 mb-4">The requested audit package could not be found.</p>
          <Link href="/audit-packages">
            <Button>Back to Audit Packages</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'audit_ready':
      case 'compliant':
        return 'bg-green-500';
      case 'pending_review':
        return 'bg-yellow-500';
      case 'non_compliant':
        return 'bg-red-500';
      case 'incomplete':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/audit-packages">
                <Button
                  variant="outline"
                  className="mb-4"
                >
                  ← Back to Audit Packages
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{auditPackage.requestId}</h1>
              <p className="mt-2 text-gray-600">Audit Package Details</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Package Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Package Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(auditPackage.status)}`}></div>
                <span className="font-medium">Status: {auditPackage.status.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div>
                <span className="font-medium">Audit Score: </span>
                <span className={`${auditPackage.auditScore >= 80 ? 'text-green-600' : auditPackage.auditScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {auditPackage.auditScore}/100
                </span>
              </div>
              <div>
                <span className="font-medium">Total Issues: </span>
                <span className={auditPackage.totalIssues > 0 ? 'text-red-600' : 'text-green-600'}>
                  {auditPackage.totalIssues}
                </span>
              </div>
              <div>
                <span className="font-medium">Critical Issues: </span>
                <span className={auditPackage.criticalIssues > 0 ? 'text-red-600' : 'text-green-600'}>
                  {auditPackage.criticalIssues}
                </span>
              </div>
              <div>
                <span className="font-medium">Amount: </span>
                <span>${auditPackage.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium">Cardholder: </span>
                <span>{auditPackage.cardholder}</span>
              </div>
              <div>
                <span className="font-medium">Approver: </span>
                <span>{auditPackage.approver}</span>
              </div>
              <div>
                <span className="font-medium">Vendor: </span>
                <span>{auditPackage.vendor}</span>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditPackage.documents.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${doc.includes('Missing') || doc.includes('Incomplete') || doc.includes('Invalid') || doc.includes('Pending') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={doc.includes('Missing') || doc.includes('Incomplete') || doc.includes('Invalid') || doc.includes('Pending') ? 'text-red-600' : 'text-gray-900'}>
                      {doc}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditPackage.complianceChecks.map((check, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${check.includes('FAILED') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={check.includes('FAILED') ? 'text-red-600' : 'text-gray-900'}>
                      {check}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{auditPackage.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                <p>Created: {auditPackage.createdAt}</p>
                <p>Updated: {auditPackage.updatedAt}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}