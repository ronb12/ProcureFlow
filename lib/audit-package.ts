import { z } from 'zod';
import { Request, PurchaseOrder, Purchase, Approval, Attachment } from './types';

// DOD MWR Audit Package Requirements
export const MWR_AUDIT_REQUIREMENTS = {
  // Required documents for audit package
  REQUIRED_DOCUMENTS: [
    'purchase_request',
    'approval_document',
    'purchase_order',
    'receipt',
    'delivery_confirmation',
    'reconciliation_document',
    'policy_compliance_check',
    'vendor_verification',
    'cardholder_certification',
    'approving_official_certification'
  ],

  // Document retention requirements (in years)
  RETENTION_PERIODS: {
    purchase_request: 6,
    approval_document: 6,
    purchase_order: 6,
    receipt: 6,
    delivery_confirmation: 6,
    reconciliation_document: 6,
    policy_compliance_check: 6,
    vendor_verification: 6,
    cardholder_certification: 6,
    approving_official_certification: 6
  },

  // Compliance check requirements
  COMPLIANCE_CHECKS: [
    'micro_purchase_limit',
    'split_purchase_detection',
    'blocked_merchant_check',
    'vendor_approval_status',
    'delivery_address_validation',
    'accounting_code_verification',
    'justification_adequacy',
    'receipt_legibility',
    'purchase_order_accuracy',
    'reconciliation_completeness'
  ],

  // Audit package status
  AUDIT_STATUS: {
    INCOMPLETE: 'incomplete',
    PENDING_REVIEW: 'pending_review',
    COMPLIANT: 'compliant',
    NON_COMPLIANT: 'non_compliant',
    AUDIT_READY: 'audit_ready'
  }
} as const;

// Audit Package Schema
export const AuditPackageSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  poId: z.string().min(1, 'Purchase Order ID is required'),
  purchaseId: z.string().min(1, 'Purchase ID is required'),
  cardholderId: z.string().min(1, 'Cardholder ID is required'),
  approverId: z.string().min(1, 'Approver ID is required'),
  orgId: z.string().min(1, 'Organization ID is required'),
  
  // Document status tracking
  documents: z.object({
    purchase_request: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    }),
    approval_document: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    }),
    purchase_order: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    }),
    receipt: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    }),
    delivery_confirmation: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    }),
    reconciliation_document: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    }),
    policy_compliance_check: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    }),
    vendor_verification: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    }),
    cardholder_certification: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    }),
    approving_official_certification: z.object({
      present: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      fileUrl: z.string().optional(),
      lastUpdated: z.date(),
      issues: z.array(z.string()).default([])
    })
  }),

  // Compliance check results
  complianceChecks: z.object({
    micro_purchase_limit: z.object({
      passed: z.boolean(),
      value: z.number(),
      limit: z.number(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    }),
    split_purchase_detection: z.object({
      passed: z.boolean(),
      detected: z.boolean(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    }),
    blocked_merchant_check: z.object({
      passed: z.boolean(),
      blocked: z.boolean(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    }),
    vendor_approval_status: z.object({
      passed: z.boolean(),
      approved: z.boolean(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    }),
    delivery_address_validation: z.object({
      passed: z.boolean(),
      valid: z.boolean(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    }),
    accounting_code_verification: z.object({
      passed: z.boolean(),
      valid: z.boolean(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    }),
    justification_adequacy: z.object({
      passed: z.boolean(),
      adequate: z.boolean(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    }),
    receipt_legibility: z.object({
      passed: z.boolean(),
      legible: z.boolean(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    }),
    purchase_order_accuracy: z.object({
      passed: z.boolean(),
      accurate: z.boolean(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    }),
    reconciliation_completeness: z.object({
      passed: z.boolean(),
      complete: z.boolean(),
      compliant: z.boolean(),
      issues: z.array(z.string()).default([])
    })
  }),

  // Overall audit package status
  status: z.enum([
    'incomplete',
    'pending_review',
    'compliant',
    'non_compliant',
    'audit_ready'
  ]),

  // Audit package metadata
  createdAt: z.date(),
  updatedAt: z.date(),
  lastAuditedAt: z.date().optional(),
  auditScore: z.number().min(0).max(100).optional(),
  totalIssues: z.number().min(0).default(0),
  criticalIssues: z.number().min(0).default(0),
  warnings: z.number().min(0).default(0),

  // Audit package export
  exportUrl: z.string().optional(),
  exportGeneratedAt: z.date().optional(),
  exportExpiresAt: z.date().optional()
});

export type AuditPackage = z.infer<typeof AuditPackageSchema>;

// Audit Package Builder Class
export class AuditPackageBuilder {
  private auditPackage: Partial<AuditPackage>;

  constructor(requestId: string, poId: string, purchaseId: string) {
    this.auditPackage = {
      requestId,
      poId,
      purchaseId,
      documents: {} as any,
      complianceChecks: {} as any,
      status: 'incomplete',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalIssues: 0,
      criticalIssues: 0,
      warnings: 0
    };
  }

  // Add document to audit package
  addDocument(
    documentType: keyof typeof MWR_AUDIT_REQUIREMENTS.REQUIRED_DOCUMENTS,
    fileUrl: string,
    isComplete: boolean = true,
    isCompliant: boolean = true,
    issues: string[] = []
  ): this {
    (this.auditPackage.documents as any)[documentType] = {
      present: true,
      complete: isComplete,
      compliant: isCompliant,
      fileUrl,
      lastUpdated: new Date(),
      issues
    };
    return this;
  }

  // Add compliance check result
  addComplianceCheck(
    checkType: keyof typeof MWR_AUDIT_REQUIREMENTS.COMPLIANCE_CHECKS,
    result: {
      passed: boolean;
      compliant: boolean;
      issues: string[];
      [key: string]: any;
    }
  ): this {
    (this.auditPackage.complianceChecks as any)[checkType] = {
      ...result,
      issues: result.issues || []
    };
    return this;
  }

  // Calculate audit score
  calculateAuditScore(): number {
    if (!this.auditPackage.documents || !this.auditPackage.complianceChecks) {
      return 0;
    }

    const documentScore = Object.values(this.auditPackage.documents).reduce((score, doc) => {
      if (!doc.present) return score;
      if (doc.compliant) return score + 10;
      if (doc.complete) return score + 5;
      return score;
    }, 0);

    const complianceScore = Object.values(this.auditPackage.complianceChecks).reduce((score, check) => {
      if (check.compliant) return score + 10;
      if (check.passed) return score + 5;
      return score;
    }, 0);

    return Math.min(100, documentScore + complianceScore);
  }

  // Count issues
  countIssues(): { total: number; critical: number; warnings: number } {
    let total = 0;
    let critical = 0;
    let warnings = 0;

    // Count document issues
    if (this.auditPackage.documents) {
      Object.values(this.auditPackage.documents).forEach(doc => {
        total += doc.issues.length;
        if (!doc.present) critical++;
        if (!doc.compliant) critical++;
        if (!doc.complete) warnings++;
      });
    }

    // Count compliance issues
    if (this.auditPackage.complianceChecks) {
      Object.values(this.auditPackage.complianceChecks).forEach(check => {
        total += check.issues.length;
        if (!check.compliant) critical++;
        if (!check.passed) warnings++;
      });
    }

    return { total, critical, warnings };
  }

  // Determine audit package status
  determineStatus(): AuditPackage['status'] {
    const { total, critical } = this.countIssues();
    const score = this.calculateAuditScore();

    if (critical > 0) return 'non_compliant';
    if (total > 0) return 'pending_review';
    if (score >= 90) return 'audit_ready';
    if (score >= 70) return 'compliant';
    return 'incomplete';
  }

  // Build final audit package
  build(): AuditPackage {
    const { total, critical, warnings } = this.countIssues();
    const score = this.calculateAuditScore();
    const status = this.determineStatus();

    this.auditPackage.totalIssues = total;
    this.auditPackage.criticalIssues = critical;
    this.auditPackage.warnings = warnings;
    this.auditPackage.auditScore = score;
    this.auditPackage.status = status;
    this.auditPackage.updatedAt = new Date();

    return this.auditPackage as AuditPackage;
  }
}

// Audit Package Validator
export class AuditPackageValidator {
  static validateAuditPackage(auditPackage: AuditPackage): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check required documents
    Object.entries(auditPackage.documents).forEach(([docType, doc]) => {
      if (!doc.present) {
        issues.push(`Missing required document: ${docType}`);
        recommendations.push(`Upload ${docType} document`);
      }
      if (!doc.complete) {
        issues.push(`Incomplete document: ${docType}`);
        recommendations.push(`Complete ${docType} document`);
      }
      if (!doc.compliant) {
        issues.push(`Non-compliant document: ${docType}`);
        recommendations.push(`Fix compliance issues in ${docType}`);
      }
    });

    // Check compliance checks
    Object.entries(auditPackage.complianceChecks).forEach(([checkType, check]) => {
      if (!check.compliant) {
        issues.push(`Compliance check failed: ${checkType}`);
        recommendations.push(`Address ${checkType} compliance issues`);
      }
      if (check.issues.length > 0) {
        issues.push(...check.issues);
      }
    });

    // Check overall status
    if (auditPackage.status === 'non_compliant') {
      issues.push('Audit package is non-compliant');
      recommendations.push('Address all critical issues before proceeding');
    }

    if (auditPackage.status === 'incomplete') {
      issues.push('Audit package is incomplete');
      recommendations.push('Complete all required documents and checks');
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }
}

// Audit Package Exporter
export class AuditPackageExporter {
  static generateAuditPackage(auditPackage: AuditPackage): {
    packageUrl: string;
    expiresAt: Date;
  } {
    // Generate comprehensive audit package
    const packageData = {
      auditPackageId: auditPackage.requestId,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: auditPackage.status,
      score: auditPackage.auditScore,
      issues: auditPackage.totalIssues,
      criticalIssues: auditPackage.criticalIssues,
      warnings: auditPackage.warnings,
      documents: auditPackage.documents,
      complianceChecks: auditPackage.complianceChecks,
      metadata: {
        requestId: auditPackage.requestId,
        poId: auditPackage.poId,
        purchaseId: auditPackage.purchaseId,
        cardholderId: auditPackage.cardholderId,
        approverId: auditPackage.approverId,
        orgId: auditPackage.orgId
      }
    };

    // In a real implementation, this would generate a ZIP file with all documents
    // and return a signed URL for download
    const packageUrl = `gs://audit-packages/${auditPackage.requestId}/audit-package-${Date.now()}.zip`;
    
    return {
      packageUrl,
      expiresAt: packageData.expiresAt
    };
  }
}

// MWR Policy Compliance Checker
export class MWRPolicyComplianceChecker {
  static checkMicroPurchaseLimit(amount: number, limit: number): {
    passed: boolean;
    compliant: boolean;
    issues: string[];
    amount: number;
    limit: number;
  } {
    const passed = amount <= limit;
    const compliant = passed;
    const issues: string[] = [];

    if (!passed) {
      issues.push(`Amount $${amount} exceeds micro purchase limit $${limit}`);
    }

    return { passed, compliant, issues, amount, limit };
  }

  static checkSplitPurchase(requests: Request[], timeWindowDays: number = 1): {
    passed: boolean;
    detected: boolean;
    compliant: boolean;
    issues: string[];
  } {
    // Check for potential split purchases within time window
    const recentRequests = requests.filter(req => {
      const daysDiff = (Date.now() - req.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= timeWindowDays;
    });

    const totalAmount = recentRequests.reduce((sum, req) => sum + req.totalEstimate, 0);
    const detected = recentRequests.length > 1 && totalAmount > 3000; // MWR threshold
    const passed = !detected;
    const compliant = passed;
    const issues: string[] = [];

    if (detected) {
      issues.push(`Potential split purchase detected: ${recentRequests.length} requests totaling $${totalAmount} within ${timeWindowDays} day(s)`);
    }

    return { passed, detected, compliant, issues };
  }

  static checkBlockedMerchant(vendor: string, blockedMerchants: string[]): {
    passed: boolean;
    blocked: boolean;
    compliant: boolean;
    issues: string[];
  } {
    const blocked = blockedMerchants.some(blocked => 
      vendor.toLowerCase().includes(blocked.toLowerCase())
    );
    const passed = !blocked;
    const compliant = passed;
    const issues: string[] = [];

    if (blocked) {
      issues.push(`Vendor "${vendor}" is on blocked merchants list`);
    }

    return { passed, blocked, compliant, issues };
  }

  static checkVendorApproval(vendor: string, approvedVendors: string[]): {
    passed: boolean;
    approved: boolean;
    compliant: boolean;
    issues: string[];
  } {
    const approved = approvedVendors.includes(vendor);
    const passed = approved;
    const compliant = passed;
    const issues: string[] = [];

    if (!approved) {
      issues.push(`Vendor "${vendor}" is not on approved vendors list`);
    }

    return { passed, approved, compliant, issues };
  }

  static checkDeliveryAddress(address: string, orgAddresses: string[]): {
    passed: boolean;
    valid: boolean;
    compliant: boolean;
    issues: string[];
  } {
    const valid = orgAddresses.some(orgAddr => 
      address.toLowerCase().includes(orgAddr.toLowerCase())
    );
    const passed = valid;
    const compliant = passed;
    const issues: string[] = [];

    if (!valid) {
      issues.push(`Delivery address "${address}" is not a valid organization address`);
    }

    return { passed, valid, compliant, issues };
  }

  static checkAccountingCode(code: string, validCodes: string[]): {
    passed: boolean;
    valid: boolean;
    compliant: boolean;
    issues: string[];
  } {
    const valid = validCodes.includes(code);
    const passed = valid;
    const compliant = passed;
    const issues: string[] = [];

    if (!valid) {
      issues.push(`Accounting code "${code}" is not valid`);
    }

    return { passed, valid, compliant, issues };
  }

  static checkJustificationAdequacy(justification: string): {
    passed: boolean;
    adequate: boolean;
    compliant: boolean;
    issues: string[];
  } {
    const adequate = justification.length >= 50 && justification.trim().length > 0;
    const passed = adequate;
    const compliant = passed;
    const issues: string[] = [];

    if (!adequate) {
      issues.push(`Justification is inadequate: minimum 50 characters required`);
    }

    return { passed, adequate, compliant, issues };
  }

  static checkReceiptLegibility(receiptUrl: string): {
    passed: boolean;
    legible: boolean;
    compliant: boolean;
    issues: string[];
  } {
    // In a real implementation, this would use OCR or image analysis
    const legible = receiptUrl.length > 0; // Placeholder
    const passed = legible;
    const compliant = passed;
    const issues: string[] = [];

    if (!legible) {
      issues.push(`Receipt is not legible or readable`);
    }

    return { passed, legible, compliant, issues };
  }

  static checkPurchaseOrderAccuracy(po: PurchaseOrder, request: Request): {
    passed: boolean;
    accurate: boolean;
    compliant: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check vendor match
    if (po.vendor.name !== request.vendor) {
      issues.push(`PO vendor "${po.vendor.name}" does not match request vendor "${request.vendor}"`);
    }

    // Check total amount match
    if (Math.abs(po.total - request.totalEstimate) > 0.01) {
      issues.push(`PO total $${po.total} does not match request total $${request.totalEstimate}`);
    }

    // Check items match
    if (po.items.length !== request.items.length) {
      issues.push(`PO has ${po.items.length} items but request has ${request.items.length} items`);
    }

    const accurate = issues.length === 0;
    const passed = accurate;
    const compliant = passed;

    return { passed, accurate, compliant, issues };
  }

  static checkReconciliationCompleteness(purchase: Purchase, receiptUrl: string): {
    passed: boolean;
    complete: boolean;
    compliant: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    if (!receiptUrl) {
      issues.push('Receipt is missing');
    }

    if (!purchase.finalTotal || purchase.finalTotal <= 0) {
      issues.push('Final total is missing or invalid');
    }

    if (!purchase.purchasedAt) {
      issues.push('Purchase date is missing');
    }

    const complete = issues.length === 0;
    const passed = complete;
    const compliant = passed;

    return { passed, complete, compliant, issues };
  }
}
