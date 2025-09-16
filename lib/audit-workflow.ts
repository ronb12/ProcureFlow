// Comprehensive Audit Workflow for 100% Compliance

export interface AuditTrigger {
  id: string;
  triggerType: 'automatic' | 'manual' | 'scheduled' | 'risk_based';
  condition: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
}

export interface AuditRule {
  id: string;
  name: string;
  category: 'financial' | 'procedural' | 'compliance' | 'documentation';
  condition: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  autoResolve: boolean;
  requiresResponse: boolean;
  dueDays: number;
}

export interface AuditSchedule {
  id: string;
  name: string;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  triggerEvents: string[];
  auditRules: string[];
  isActive: boolean;
}

// 100% Compliance Audit Rules
export const COMPREHENSIVE_AUDIT_RULES: AuditRule[] = [
  // Financial Compliance Rules
  {
    id: 'rule-001',
    name: 'Micro-Purchase Limit Check',
    category: 'financial',
    condition: 'amount > 2000',
    severity: 'critical',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 3
  },
  {
    id: 'rule-002',
    name: 'Split Purchase Detection',
    category: 'financial',
    condition: 'multiple_purchases_same_vendor_same_day > 2000',
    severity: 'critical',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 3
  },
  {
    id: 'rule-003',
    name: 'Approval Authority Check',
    category: 'financial',
    condition: 'amount > approver_limit',
    severity: 'error',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 5
  },

  // Procedural Compliance Rules
  {
    id: 'rule-004',
    name: 'Required Documentation Check',
    category: 'procedural',
    condition: 'missing_required_documents.length > 0',
    severity: 'error',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 7
  },
  {
    id: 'rule-005',
    name: 'Vendor Approval Status',
    category: 'procedural',
    condition: 'vendor_status != "approved"',
    severity: 'warning',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 10
  },
  {
    id: 'rule-006',
    name: 'Delivery Address Validation',
    category: 'procedural',
    condition: 'delivery_address != registered_address',
    severity: 'warning',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 10
  },

  // DOD MWR Compliance Rules
  {
    id: 'rule-007',
    name: 'DOD MWR Policy Compliance',
    category: 'compliance',
    condition: 'purchase_type in blocked_categories',
    severity: 'critical',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 2
  },
  {
    id: 'rule-008',
    name: 'Cardholder Certification Check',
    category: 'compliance',
    condition: 'cardholder_certification_expired',
    severity: 'error',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 5
  },
  {
    id: 'rule-009',
    name: 'Approving Official Certification',
    category: 'compliance',
    condition: 'approver_certification_expired',
    severity: 'error',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 5
  },

  // Documentation Rules
  {
    id: 'rule-010',
    name: 'Receipt Quality Check',
    category: 'documentation',
    condition: 'receipt_quality_score < 80',
    severity: 'warning',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 14
  },
  {
    id: 'rule-011',
    name: 'Reconciliation Completeness',
    category: 'documentation',
    condition: 'reconciliation_missing_fields.length > 0',
    severity: 'warning',
    autoResolve: false,
    requiresResponse: true,
    dueDays: 14
  }
];

// Audit Triggers for 100% Coverage
export const AUDIT_TRIGGERS: AuditTrigger[] = [
  {
    id: 'trigger-001',
    triggerType: 'automatic',
    condition: 'purchase_status == "Reconciled"',
    description: 'Automatic audit when purchase is reconciled (primary trigger)',
    priority: 'critical',
    isActive: true
  },
  {
    id: 'trigger-002',
    triggerType: 'automatic',
    condition: 'purchase_status == "Purchased"',
    description: 'Preliminary audit when purchase is completed (for high-risk items)',
    priority: 'medium',
    isActive: true
  },
  {
    id: 'trigger-003',
    triggerType: 'scheduled',
    condition: 'daily_batch_audit',
    description: 'Daily batch audit of all recent purchases',
    priority: 'medium',
    isActive: true
  },
  {
    id: 'trigger-004',
    triggerType: 'risk_based',
    condition: 'amount > 1000 OR new_vendor OR high_risk_category',
    description: 'Risk-based audit for high-value or suspicious purchases',
    priority: 'critical',
    isActive: true
  },
  {
    id: 'trigger-005',
    triggerType: 'manual',
    condition: 'auditor_initiated',
    description: 'Manual audit initiated by auditor',
    priority: 'medium',
    isActive: true
  }
];

// Audit Schedules for Comprehensive Coverage
export const AUDIT_SCHEDULES: AuditSchedule[] = [
  {
    id: 'schedule-001',
    name: 'Immediate Reconciliation Audit',
    frequency: 'immediate',
    triggerEvents: ['purchase_reconciled'],
    auditRules: ['rule-001', 'rule-002', 'rule-003', 'rule-004', 'rule-005', 'rule-006', 'rule-007', 'rule-008', 'rule-009', 'rule-010', 'rule-011'],
    isActive: true
  },
  {
    id: 'schedule-002',
    name: 'High-Risk Purchase Audit',
    frequency: 'immediate',
    triggerEvents: ['high_risk_purchase_completed'],
    auditRules: ['rule-001', 'rule-002', 'rule-004', 'rule-007'],
    isActive: true
  },
  {
    id: 'schedule-003',
    name: 'Daily Reconciliation Review',
    frequency: 'daily',
    triggerEvents: ['daily_reconciliation_audit'],
    auditRules: ['rule-003', 'rule-005', 'rule-006', 'rule-008', 'rule-009'],
    isActive: true
  },
  {
    id: 'schedule-004',
    name: 'Weekly Documentation Review',
    frequency: 'weekly',
    triggerEvents: ['documentation_audit'],
    auditRules: ['rule-010', 'rule-011'],
    isActive: true
  },
  {
    id: 'schedule-005',
    name: 'Monthly Comprehensive Audit',
    frequency: 'monthly',
    triggerEvents: ['comprehensive_audit'],
    auditRules: ['rule-001', 'rule-002', 'rule-003', 'rule-004', 'rule-005', 'rule-006', 'rule-007', 'rule-008', 'rule-009', 'rule-010', 'rule-011'],
    isActive: true
  }
];

// Audit Workflow States
export enum AuditWorkflowState {
  PENDING_AUDIT = 'pending_audit',
  UNDER_REVIEW = 'under_review',
  FINDINGS_ISSUED = 'findings_issued',
  CARDHOLDER_RESPONSE = 'cardholder_response',
  AUDITOR_REVIEW = 'auditor_review',
  RESOLVED = 'resolved',
  NON_COMPLIANT = 'non_compliant',
  DISPUTED = 'disputed',
  ESCALATED = 'escalated'
}

// Audit Workflow Transitions
export const AUDIT_WORKFLOW_TRANSITIONS = {
  [AuditWorkflowState.PENDING_AUDIT]: [AuditWorkflowState.UNDER_REVIEW],
  [AuditWorkflowState.UNDER_REVIEW]: [AuditWorkflowState.FINDINGS_ISSUED, AuditWorkflowState.RESOLVED],
  [AuditWorkflowState.FINDINGS_ISSUED]: [AuditWorkflowState.CARDHOLDER_RESPONSE, AuditWorkflowState.ESCALATED],
  [AuditWorkflowState.CARDHOLDER_RESPONSE]: [AuditWorkflowState.AUDITOR_REVIEW, AuditWorkflowState.DISPUTED],
  [AuditWorkflowState.AUDITOR_REVIEW]: [AuditWorkflowState.RESOLVED, AuditWorkflowState.FINDINGS_ISSUED],
  [AuditWorkflowState.RESOLVED]: [],
  [AuditWorkflowState.NON_COMPLIANT]: [AuditWorkflowState.ESCALATED],
  [AuditWorkflowState.DISPUTED]: [AuditWorkflowState.AUDITOR_REVIEW, AuditWorkflowState.ESCALATED],
  [AuditWorkflowState.ESCALATED]: [AuditWorkflowState.UNDER_REVIEW, AuditWorkflowState.NON_COMPLIANT]
};

// Compliance Metrics
export interface ComplianceMetrics {
  totalPackages: number;
  auditedPackages: number;
  compliantPackages: number;
  nonCompliantPackages: number;
  pendingAudit: number;
  complianceRate: number;
  averageAuditTime: number; // in hours
  criticalFindings: number;
  resolvedFindings: number;
  openFindings: number;
}

// Helper Functions
export function calculateComplianceMetrics(packages: any[]): ComplianceMetrics {
  const totalPackages = packages.length;
  const auditedPackages = packages.filter(pkg => pkg.auditStatus !== 'pending_audit').length;
  const compliantPackages = packages.filter(pkg => pkg.auditStatus === 'resolved' && pkg.auditScore >= 80).length;
  const nonCompliantPackages = packages.filter(pkg => pkg.auditStatus === 'non_compliant').length;
  const pendingAudit = packages.filter(pkg => pkg.auditStatus === 'pending_audit').length;
  
  return {
    totalPackages,
    auditedPackages,
    compliantPackages,
    nonCompliantPackages,
    pendingAudit,
    complianceRate: totalPackages > 0 ? (compliantPackages / totalPackages) * 100 : 0,
    averageAuditTime: 24, // Mock data - would be calculated from actual audit times
    criticalFindings: packages.reduce((sum, pkg) => sum + (pkg.criticalIssues || 0), 0),
    resolvedFindings: packages.reduce((sum, pkg) => sum + (pkg.resolvedIssues || 0), 0),
    openFindings: packages.reduce((sum, pkg) => sum + (pkg.openIssues || 0), 0)
  };
}

export function shouldTriggerAudit(purchasePackage: any, triggers: AuditTrigger[]): boolean {
  return triggers.some(trigger => {
    if (!trigger.isActive) return false;
    
    switch (trigger.triggerType) {
      case 'automatic':
        return evaluateCondition(purchasePackage, trigger.condition);
      case 'risk_based':
        return evaluateRiskCondition(purchasePackage, trigger.condition);
      case 'scheduled':
        return true; // Handled by scheduler
      case 'manual':
        return false; // Only triggered by user action
      default:
        return false;
    }
  });
}

function evaluateCondition(purchasePackage: any, condition: string): boolean {
  // Simplified condition evaluation - in real app would use a proper expression evaluator
  const conditions: Record<string, boolean> = {
    'purchase_status == "Purchased"': purchasePackage.status === 'Purchased',
    'purchase_status == "Reconciled"': purchasePackage.status === 'Reconciled',
    'amount > 2000': purchasePackage.amount > 2000,
    'amount > 1000': purchasePackage.amount > 1000,
    'new_vendor': !purchasePackage.vendorApproved,
    'high_risk_category': purchasePackage.category === 'high_risk'
  };
  
  return conditions[condition] || false;
}

function evaluateRiskCondition(purchasePackage: any, condition: string): boolean {
  const riskFactors = condition.split(' OR ');
  return riskFactors.some(factor => evaluateCondition(purchasePackage, factor.trim()));
}
