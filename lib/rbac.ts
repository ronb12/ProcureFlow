import { User, UserRole, RequestStatus } from './types';

// Role-based access control utilities
export class RBAC {
  // Check if user can perform action on resource
  static canAccess(
    user: User | null,
    resource: string,
    action: string
  ): boolean {
    if (!user) return false;

    // Admin can do everything
    if (user.role === 'admin') return true;

    // Define permissions by role and resource
    const permissions: Record<string, Record<string, UserRole[]>> = {
      users: {
        read: ['admin'],
        write: ['admin'],
        delete: ['admin'],
      },
      orgs: {
        read: ['admin', 'approver', 'cardholder', 'auditor'],
        write: ['admin'],
        delete: ['admin'],
      },
      settings: {
        read: ['admin', 'approver', 'cardholder'],
        write: ['admin'],
      },
      requests: {
        create: ['requester', 'admin'], // Removed approver, cardholder, auditor for separation of duties
        read: ['requester', 'approver', 'cardholder', 'auditor', 'admin'],
        update: ['requester', 'approver', 'cardholder', 'admin'],
        delete: ['admin'],
      },
      approvals: {
        create: ['approver', 'admin'],
        read: ['approver', 'admin'],
        update: ['admin'],
        delete: ['admin'],
      },
      purchases: {
        create: ['cardholder', 'admin'],
        read: ['cardholder', 'admin'],
        update: ['cardholder', 'admin'],
        delete: ['admin'],
      },
      attachments: {
        create: ['requester', 'approver', 'cardholder', 'auditor', 'admin'],
        read: ['requester', 'approver', 'cardholder', 'auditor', 'admin'],
        update: ['admin'],
        delete: ['admin'],
      },
      cycles: {
        create: ['admin', 'cardholder'],
        read: ['requester', 'approver', 'cardholder', 'auditor', 'admin'],
        update: ['admin', 'cardholder'],
        delete: ['admin'],
      },
      audit: {
        read: ['auditor', 'admin'],
        create: [], // Only server-side functions
        update: [], // Immutable
        delete: [], // Immutable
      },
      exports: {
        create: ['admin', 'cardholder'],
        read: ['admin', 'cardholder'],
        download: ['admin', 'cardholder'],
      },
      vendors: {
        create: ['admin', 'cardholder'],
        read: ['admin', 'cardholder', 'approver', 'requester'],
        update: ['admin', 'cardholder'],
        delete: ['admin'],
        verify: ['admin', 'cardholder'],
      },
    };

    const resourcePermissions = permissions[resource];
    if (!resourcePermissions) return false;

    const actionPermissions = resourcePermissions[action];
    if (!actionPermissions) return false;

    return actionPermissions.includes(user.role);
  }

  // Check if user can edit request based on status
  static canEditRequest(
    user: User | null,
    requestStatus: RequestStatus
  ): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;

    // Only requester can edit in Draft or Returned status
    if (user.role === 'requester') {
      return ['Draft', 'Returned'].includes(requestStatus);
    }

    // Other roles can't edit requests directly
    return false;
  }

  // Check if user can approve request
  static canApproveRequest(
    user: User | null,
    requestStatus: RequestStatus
  ): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;

    // Only approvers can approve during AO Review
    if (user.role === 'approver' && requestStatus === 'AO Review') {
      return true;
    }

    return false;
  }

  // Check if user can purchase request
  static canPurchaseRequest(
    user: User | null,
    requestStatus: RequestStatus
  ): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;

    // Only cardholders can purchase during Cardholder Purchasing
    if (
      user.role === 'cardholder' &&
      requestStatus === 'Cardholder Purchasing'
    ) {
      return true;
    }

    return false;
  }

  // Check if user can reconcile request
  static canReconcileRequest(
    user: User | null,
    requestStatus: RequestStatus
  ): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;

    // Only cardholders can reconcile during Purchased status
    if (user.role === 'cardholder' && requestStatus === 'Purchased') {
      return true;
    }

    return false;
  }

  // Check if user can view organization data
  static canViewOrg(user: User | null, orgId: string): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;

    return user.orgId === orgId;
  }

  // Check if user can manage users in organization
  static canManageOrgUsers(user: User | null, orgId: string): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;

    // Only admin can manage users
    return false;
  }

  // Check if user can view audit logs
  static canViewAudit(user: User | null): boolean {
    if (!user) return false;
    return ['auditor', 'admin'].includes(user.role);
  }

  // Check if user can export data
  static canExport(user: User | null): boolean {
    if (!user) return false;
    return ['admin', 'cardholder'].includes(user.role);
  }

  // Check if user can access admin settings
  static canAccessAdminSettings(user: User | null): boolean {
    if (!user) return false;
    return user.role === 'admin';
  }

  // Get user's accessible request statuses for filtering
  static getAccessibleRequestStatuses(user: User | null): RequestStatus[] {
    if (!user) return [];

    const allStatuses: RequestStatus[] = [
      'Draft',
      'Submitted',
      'AO Review',
      'Approved',
      'Cardholder Purchasing',
      'Purchased',
      'Reconciled',
      'Closed',
      'Returned',
      'Denied',
    ];

    // Admin can see all statuses
    if (user.role === 'admin') return allStatuses;

    // Role-specific accessible statuses
    switch (user.role) {
      case 'requester':
        return [
          'Draft',
          'Submitted',
          'AO Review',
          'Approved',
          'Cardholder Purchasing',
          'Purchased',
          'Reconciled',
          'Closed',
          'Returned',
          'Denied',
        ];
      case 'approver':
        return [
          'Submitted',
          'AO Review',
          'Approved',
          'Cardholder Purchasing',
          'Purchased',
          'Reconciled',
          'Closed',
          'Returned',
          'Denied',
        ];
      case 'cardholder':
        return [
          'Approved',
          'Cardholder Purchasing',
          'Purchased',
          'Reconciled',
          'Closed',
        ];
      case 'auditor':
        return ['Purchased', 'Reconciled', 'Closed'];
      default:
        return [];
    }
  }

  // Get user's dashboard sections
  static getDashboardSections(user: User | null): string[] {
    if (!user) return [];

    const sections: Record<UserRole, string[]> = {
      requester: ['myRequests', 'recentActivity'],
      approver: ['pendingApprovals', 'myRequests', 'recentActivity'],
      cardholder: [
        'cardholderQueue',
        'recentPurchases',
        'reconciliationStatus',
      ],
      auditor: ['auditLogs', 'reconciliationStatus', 'complianceReports'],
      admin: [
        'allRequests',
        'userManagement',
        'systemSettings',
        'auditLogs',
        'reports',
      ],
    };

    return sections[user.role] || [];
  }

  // Check if user can perform bulk actions
  static canPerformBulkActions(user: User | null, action: string): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;

    switch (action) {
      case 'approve':
      case 'deny':
      case 'return':
        return user.role === 'approver';
      case 'purchase':
        return user.role === 'cardholder';
      case 'reconcile':
        return user.role === 'cardholder';
      default:
        return false;
    }
  }

  // Get user's approval limit for amount checking
  static getApprovalLimit(user: User | null): number {
    if (!user) return 0;
    if (user.role === 'admin') return Infinity;
    return user.approvalLimit || 0;
  }

  // Check if user can approve specific amount
  static canApproveAmount(user: User | null, amount: number): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role !== 'approver') return false;

    const limit = RBAC.getApprovalLimit(user);
    return amount <= limit;
  }

  // Get user's organization context
  static getUserOrgContext(user: User | null): {
    orgId: string;
    canManageOrg: boolean;
  } {
    if (!user) return { orgId: '', canManageOrg: false };

    return {
      orgId: user.orgId,
      canManageOrg: user.role === 'admin',
    };
  }

  // Check if user can access specific request
  static canAccessRequest(
    user: User | null,
    request: { orgId: string; requesterId: string; status: RequestStatus }
  ): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;

    // Must belong to same organization
    if (user.orgId !== request.orgId) return false;

    // Role-specific access rules
    switch (user.role) {
      case 'requester':
        return user.id === request.requesterId;
      case 'approver':
        return [
          'Submitted',
          'AO Review',
          'Approved',
          'Cardholder Purchasing',
          'Purchased',
          'Reconciled',
          'Closed',
          'Returned',
          'Denied',
        ].includes(request.status);
      case 'cardholder':
        return [
          'Approved',
          'Cardholder Purchasing',
          'Purchased',
          'Reconciled',
          'Closed',
        ].includes(request.status);
      case 'auditor':
        return ['Purchased', 'Reconciled', 'Closed'].includes(request.status);
      default:
        return false;
    }
  }
}
