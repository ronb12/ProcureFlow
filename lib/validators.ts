import { z } from 'zod';
import {
  RequestItemSchema,
  CreateRequestSchema,
  CreateApprovalSchema,
  CreatePurchaseSchema,
} from './types';

// Money input validation
export const MoneyInputSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Invalid money format')
  .transform(val => parseFloat(val))
  .refine(val => val >= 0, 'Amount must be non-negative');

// SKU validation
export const SKUSchema = z
  .string()
  .min(1, 'SKU is required')
  .max(50, 'SKU must be 50 characters or less')
  .regex(
    /^[A-Z0-9-_]+$/,
    'SKU must contain only uppercase letters, numbers, hyphens, and underscores'
  );

// Accounting code validation
export const AccountingCodeSchema = z
  .string()
  .min(1, 'Accounting code is required')
  .max(20, 'Accounting code must be 20 characters or less')
  .regex(
    /^[A-Z0-9-]+$/,
    'Accounting code must contain only uppercase letters, numbers, and hyphens'
  );

// Vendor validation with common vendors
export const VendorSchema = z
  .string()
  .min(1, 'Vendor is required')
  .max(100, 'Vendor name must be 100 characters or less');

// Enhanced request item schema with SKU validation
export const ValidatedRequestItemSchema = RequestItemSchema.extend({
  sku: SKUSchema,
});

// Enhanced create request schema
export const ValidatedCreateRequestSchema = CreateRequestSchema.extend({
  accountingCode: AccountingCodeSchema,
  vendor: VendorSchema,
  items: z
    .array(ValidatedRequestItemSchema)
    .min(1, 'At least one item is required'),
});

// File upload validation
export const FileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      file => file.size <= 10 * 1024 * 1024,
      'File size must be less than 10MB'
    )
    .refine(
      file =>
        ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(
          file.type
        ),
      'File must be an image (JPEG, PNG, GIF) or PDF'
    ),
  description: z.string().optional(),
});

// Receipt file validation
export const ReceiptFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      file => file.size <= 5 * 1024 * 1024,
      'Receipt file must be less than 5MB'
    )
    .refine(
      file =>
        ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(
          file.type
        ),
      'Receipt must be an image (JPEG, PNG, GIF) or PDF'
    ),
});

// Date validation for need-by dates
export const NeedByDateSchema = z
  .date()
  .refine(date => date >= new Date(), 'Need-by date must be in the future')
  .refine(date => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return date <= oneYearFromNow;
  }, 'Need-by date must be within one year');

// Enhanced create request with date validation
export const ValidatedCreateRequestWithDateSchema =
  ValidatedCreateRequestSchema.extend({
    needBy: NeedByDateSchema,
  });

// Search and filter schemas
export const RequestFilterSchema = z.object({
  status: z.array(z.string()).optional(),
  vendor: z.string().optional(),
  requesterId: z.string().optional(),
  orgId: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
});

export type RequestFilter = z.infer<typeof RequestFilterSchema>;

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// User role validation
export const UserRoleSchema = z.enum([
  'requester',
  'approver',
  'cardholder',
  'auditor',
  'admin',
]);

// Organization validation
export const OrganizationCodeSchema = z
  .string()
  .min(2, 'Organization code must be at least 2 characters')
  .max(10, 'Organization code must be 10 characters or less')
  .regex(
    /^[A-Z0-9]+$/,
    'Organization code must contain only uppercase letters and numbers'
  );

// Email validation
export const EmailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email must be 255 characters or less');

// Name validation
export const NameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters');

// Approval limit validation
export const ApprovalLimitSchema = z
  .number()
  .min(0, 'Approval limit must be non-negative')
  .max(1000000, 'Approval limit must be less than $1,000,000');

// Settings validation
export const MicroPurchaseLimitSchema = z
  .number()
  .min(0, 'Micro purchase limit must be non-negative')
  .max(100000, 'Micro purchase limit must be less than $100,000');

export const SplitPurchaseWindowSchema = z
  .number()
  .min(0, 'Split purchase window must be non-negative')
  .max(30, 'Split purchase window must be 30 days or less');

// Tax rate validation
export const TaxRateSchema = z
  .number()
  .min(0, 'Tax rate must be non-negative')
  .max(1, 'Tax rate must be 1.0 (100%) or less');

// State code validation (US states)
export const StateCodeSchema = z
  .string()
  .length(2, 'State code must be 2 characters')
  .regex(/^[A-Z]{2}$/, 'State code must be uppercase letters');

// Enhanced settings schema
export const ValidatedGlobalSettingsSchema = z.object({
  microPurchaseLimit: MicroPurchaseLimitSchema,
  blockedMerchants: z
    .array(z.string().min(1, 'Merchant name cannot be empty'))
    .default([]),
  splitPurchaseWindowDays: SplitPurchaseWindowSchema.default(1),
  taxRatesByState: z.record(StateCodeSchema, TaxRateSchema).optional(),
});

// User creation/update schemas
export const CreateUserSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  role: UserRoleSchema,
  orgId: z.string().min(1, 'Organization ID is required'),
  approvalLimit: ApprovalLimitSchema.optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial().omit({
  email: true,
});

// Organization creation/update schemas
export const CreateOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization name is required')
    .max(100, 'Organization name must be 100 characters or less'),
  code: OrganizationCodeSchema,
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

// Export validation
export const ExportCycleSchema = z.object({
  cycleId: z.string().min(1, 'Cycle ID is required'),
  format: z.enum(['csv', 'zip']).default('csv'),
});

// Notification preferences
export const NotificationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(false),
  statusChanges: z.boolean().default(true),
  approvals: z.boolean().default(true),
  purchases: z.boolean().default(true),
});

export type NotificationPreferences = z.infer<
  typeof NotificationPreferencesSchema
>;

// API response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Paginated response schema
export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export type PaginatedResponse<T = any> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
