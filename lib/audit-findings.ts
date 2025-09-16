// Audit findings and responses system

export interface AuditFinding {
  id: string;
  packageId: string;
  requestId: string;
  cardholderId: string;
  findingType: 'critical' | 'warning' | 'info';
  category: 'documentation' | 'compliance' | 'procedural' | 'financial';
  title: string;
  description: string;
  recommendation: string;
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'disputed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  auditorId: string;
  auditorName: string;
  dueDate?: Date;
  resolutionNotes?: string;
  cardholderResponse?: CardholderResponse;
  auditorResponse?: AuditorResponse;
}

export interface AuditorResponse {
  id: string;
  findingId: string;
  auditorId: string;
  responseType: 'accept' | 'reject' | 'request_more_info' | 'escalate';
  responseText: string;
  createdAt: Date;
  status: 'final' | 'pending_cardholder_response';
}

export interface CardholderResponse {
  id: string;
  findingId: string;
  cardholderId: string;
  responseType: 'acknowledge' | 'dispute' | 'resolve' | 'request_extension';
  responseText: string;
  supportingDocuments?: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'pending_review' | 'accepted' | 'rejected' | 'needs_revision';
  auditorFeedback?: string;
}

export interface AuditPackageStatus {
  packageId: string;
  requestId: string;
  cardholderId: string;
  overallStatus: 'pending_audit' | 'under_review' | 'findings_issued' | 'cardholder_response' | 'resolved' | 'disputed';
  auditScore: number;
  totalFindings: number;
  criticalFindings: number;
  openFindings: number;
  resolvedFindings: number;
  lastUpdated: Date;
  auditCompletedAt?: Date;
  responseDueDate?: Date;
}

// Mock data for demonstration
export const mockAuditFindings: AuditFinding[] = [
  {
    id: 'finding-001',
    packageId: '1',
    requestId: 'REQ-2024-001',
    cardholderId: 'cardholder1',
    findingType: 'warning',
    category: 'documentation',
    title: 'Missing Delivery Confirmation',
    description: 'The delivery confirmation document is not attached to this package.',
    recommendation: 'Please upload the delivery confirmation document or provide explanation for its absence.',
    status: 'open',
    severity: 'medium',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    auditorId: 'auditor1',
    auditorName: 'Alice Brown',
    dueDate: new Date('2024-02-01')
  },
  {
    id: 'finding-002',
    packageId: '2',
    requestId: 'REQ-2024-002',
    cardholderId: 'cardholder2',
    findingType: 'critical',
    category: 'compliance',
    title: 'Purchase Exceeds Micro-Purchase Limit',
    description: 'This purchase of $2,500 exceeds the $2,000 micro-purchase limit and requires proper justification.',
    recommendation: 'Provide justification for exceeding micro-purchase limit or split into multiple smaller purchases.',
    status: 'open',
    severity: 'critical',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    auditorId: 'auditor1',
    auditorName: 'Alice Brown',
    dueDate: new Date('2024-01-30')
  },
  {
    id: 'finding-003',
    packageId: '3',
    requestId: 'REQ-2024-003',
    cardholderId: 'cardholder3',
    findingType: 'info',
    category: 'procedural',
    title: 'Vendor Verification Needed',
    description: 'Vendor Office Depot is not in the approved vendor list.',
    recommendation: 'Complete vendor verification process or use an approved vendor.',
    status: 'resolved',
    severity: 'low',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-28'),
    auditorId: 'auditor1',
    auditorName: 'Alice Brown',
    resolutionNotes: 'Vendor verification completed and approved.',
    cardholderResponse: {
      id: 'response-001',
      findingId: 'finding-003',
      cardholderId: 'cardholder3',
      responseType: 'resolve',
      responseText: 'Completed vendor verification process. Office Depot is now approved.',
      supportingDocuments: ['vendor-verification.pdf'],
      createdAt: new Date('2024-01-27'),
      updatedAt: new Date('2024-01-27'),
      status: 'accepted',
      auditorFeedback: 'Vendor verification approved. Finding resolved.'
    },
    auditorResponse: {
      id: 'auditor-response-001',
      findingId: 'finding-003',
      auditorId: 'auditor1',
      responseType: 'accept',
      responseText: 'Vendor verification approved. Finding resolved.',
      createdAt: new Date('2024-01-28'),
      status: 'final'
    }
  }
];

export const mockAuditPackageStatuses: AuditPackageStatus[] = [
  {
    packageId: '1',
    requestId: 'REQ-2024-001',
    cardholderId: 'cardholder1',
    overallStatus: 'findings_issued',
    auditScore: 85,
    totalFindings: 1,
    criticalFindings: 0,
    openFindings: 1,
    resolvedFindings: 0,
    lastUpdated: new Date('2024-01-22'),
    auditCompletedAt: new Date('2024-01-22'),
    responseDueDate: new Date('2024-02-01')
  },
  {
    packageId: '2',
    requestId: 'REQ-2024-002',
    cardholderId: 'cardholder2',
    overallStatus: 'findings_issued',
    auditScore: 45,
    totalFindings: 1,
    criticalFindings: 1,
    openFindings: 1,
    resolvedFindings: 0,
    lastUpdated: new Date('2024-01-20'),
    auditCompletedAt: new Date('2024-01-20'),
    responseDueDate: new Date('2024-01-30')
  },
  {
    packageId: '3',
    requestId: 'REQ-2024-003',
    cardholderId: 'cardholder3',
    overallStatus: 'resolved',
    auditScore: 95,
    totalFindings: 1,
    criticalFindings: 0,
    openFindings: 0,
    resolvedFindings: 1,
    lastUpdated: new Date('2024-01-28'),
    auditCompletedAt: new Date('2024-01-25'),
    responseDueDate: new Date('2024-02-05')
  }
];

// Helper functions
export function getFindingsForPackage(packageId: string): AuditFinding[] {
  return mockAuditFindings.filter(finding => finding.packageId === packageId);
}

export function getFindingsForCardholder(cardholderId: string): AuditFinding[] {
  return mockAuditFindings.filter(finding => finding.cardholderId === cardholderId);
}

export function getPackageStatus(packageId: string): AuditPackageStatus | undefined {
  return mockAuditPackageStatuses.find(status => status.packageId === packageId);
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'open': return 'bg-red-100 text-red-800';
    case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    case 'disputed': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
