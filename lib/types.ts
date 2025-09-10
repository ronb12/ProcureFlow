import { z } from 'zod';

// User roles
export type UserRole = 'requester' | 'approver' | 'cardholder' | 'auditor' | 'admin';

// Request status types
export type RequestStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'AO Review' 
  | 'Approved' 
  | 'Cardholder Purchasing' 
  | 'Purchased' 
  | 'Reconciled' 
  | 'Closed' 
  | 'Returned' 
  | 'Denied';

// Approval action types
export type ApprovalAction = 'Approved' | 'Denied' | 'Returned';

// Cycle status types
export type CycleStatus = 'open' | 'closed';

// Entity types for audit
export type AuditEntity = 'request' | 'approval' | 'purchase' | 'cycle';

// User schema
export const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['requester', 'approver', 'cardholder', 'auditor', 'admin']),
  orgId: z.string().min(1, 'Organization ID is required'),
  approvalLimit: z.number().min(0).optional(),
});

export type User = z.infer<typeof UserSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Organization schema
export const OrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  code: z.string().min(1, 'Organization code is required'),
});

export type Organization = z.infer<typeof OrganizationSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Global settings schema
export const GlobalSettingsSchema = z.object({
  microPurchaseLimit: z.number().min(0, 'Micro purchase limit must be non-negative'),
  blockedMerchants: z.array(z.string()).default([]),
  splitPurchaseWindowDays: z.number().min(0).default(1),
  taxRatesByState: z.record(z.string(), z.number()).optional(),
});

export type GlobalSettings = z.infer<typeof GlobalSettingsSchema> & {
  id: string;
  updatedAt: Date;
};

// Request item schema
export const RequestItemSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  desc: z.string().min(1, 'Description is required'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
  estUnitPrice: z.number().min(0, 'Unit price must be non-negative'),
});

export type RequestItem = z.infer<typeof RequestItemSchema> & {
  id: string;
  lineTotal: number; // Calculated field
};

// Request schema
export const RequestSchema = z.object({
  orgId: z.string().min(1, 'Organization ID is required'),
  requesterId: z.string().min(1, 'Requester ID is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  justification: z.string().min(1, 'Justification is required'),
  needBy: z.date(),
  status: z.enum([
    'Draft',
    'Submitted',
    'AO Review',
    'Approved',
    'Cardholder Purchasing',
    'Purchased',
    'Reconciled',
    'Closed',
    'Returned',
    'Denied'
  ]),
  accountingCode: z.string().min(1, 'Accounting code is required'),
  suspectedSplit: z.boolean().default(false),
  totalEstimate: z.number().min(0).default(0),
});

export type Request = z.infer<typeof RequestSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  items: RequestItem[];
};

// Approval schema
export const ApprovalSchema = z.object({
  reqId: z.string().min(1, 'Request ID is required'),
  approverId: z.string().min(1, 'Approver ID is required'),
  action: z.enum(['Approved', 'Denied', 'Returned']),
  comment: z.string().optional(),
});

export type Approval = z.infer<typeof ApprovalSchema> & {
  id: string;
  timestamp: Date;
};

// Purchase schema
export const PurchaseSchema = z.object({
  reqId: z.string().min(1, 'Request ID is required'),
  cardholderId: z.string().min(1, 'Cardholder ID is required'),
  merchant: z.string().min(1, 'Merchant is required'),
  orderNumber: z.string().min(1, 'Order number is required'),
  finalTotal: z.number().min(0, 'Final total must be non-negative'),
  tax: z.number().min(0, 'Tax must be non-negative'),
  purchasedAt: z.date(),
  receiptUrl: z.string().url().optional(),
  receiptFileName: z.string().optional(),
});

export type Purchase = z.infer<typeof PurchaseSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Attachment schema
export const AttachmentSchema = z.object({
  entityType: z.enum(['request', 'purchase']),
  entityId: z.string().min(1, 'Entity ID is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Invalid file URL'),
  uploadedBy: z.string().min(1, 'Uploader ID is required'),
});

export type Attachment = z.infer<typeof AttachmentSchema> & {
  id: string;
  uploadedAt: Date;
};

// Cycle schema
export const CycleSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(['open', 'closed']),
});

export type Cycle = z.infer<typeof CycleSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Audit event schema
export const AuditEventSchema = z.object({
  entity: z.enum(['request', 'approval', 'purchase', 'cycle']),
  entityId: z.string().min(1, 'Entity ID is required'),
  actorUid: z.string().min(1, 'Actor UID is required'),
  action: z.string().min(1, 'Action is required'),
  details: z.record(z.any()).optional(),
});

export type AuditEvent = z.infer<typeof AuditEventSchema> & {
  id: string;
  at: Date;
};

// Form schemas
export const CreateRequestSchema = z.object({
  vendor: z.string().min(1, 'Vendor is required'),
  justification: z.string().min(1, 'Justification is required'),
  needBy: z.date(),
  accountingCode: z.string().min(1, 'Accounting code is required'),
  items: z.array(RequestItemSchema).min(1, 'At least one item is required'),
});

export type CreateRequestData = z.infer<typeof CreateRequestSchema>;

export const UpdateRequestSchema = CreateRequestSchema.partial();

export type UpdateRequestData = z.infer<typeof UpdateRequestSchema>;

export const CreateApprovalSchema = z.object({
  reqId: z.string().min(1, 'Request ID is required'),
  action: z.enum(['Approved', 'Denied', 'Returned']),
  comment: z.string().optional(),
});

export type CreateApprovalData = z.infer<typeof CreateApprovalSchema>;

export const CreatePurchaseSchema = z.object({
  reqId: z.string().min(1, 'Request ID is required'),
  merchant: z.string().min(1, 'Merchant is required'),
  orderNumber: z.string().min(1, 'Order number is required'),
  finalTotal: z.number().min(0, 'Final total must be non-negative'),
  tax: z.number().min(0, 'Tax must be non-negative'),
  purchasedAt: z.date(),
  receiptFile: z.instanceof(File).optional(),
});

export type CreatePurchaseData = z.infer<typeof CreatePurchaseSchema>;

// State machine types
export interface StateTransition {
  from: RequestStatus;
  to: RequestStatus;
  requiredRole: UserRole[];
  description: string;
}

// Policy check types
export interface PolicyCheck {
  type: 'micro_purchase_limit' | 'blocked_merchant' | 'split_purchase';
  severity: 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
}

// Export types
export interface ExportData {
  requestId: string;
  vendor: string;
  orderNumber: string;
  finalTotal: number;
  tax: number;
  accountingCode: string;
  purchasedAt: Date;
  receiptUrl?: string;
}

// Dashboard stats types
export interface DashboardStats {
  myRequests: {
    total: number;
    draft: number;
    submitted: number;
    inReview: number;
    approved: number;
    purchased: number;
    reconciled: number;
  };
  pendingApprovals: number;
  cardholderQueue: number;
  reconciliationStatus: {
    open: number;
    closed: number;
    missingReceipts: number;
  };
}
