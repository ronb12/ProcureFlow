import { RequestStatus, UserRole, StateTransition } from './types';

// Define valid state transitions
export const STATE_TRANSITIONS: StateTransition[] = [
  {
    from: 'Draft',
    to: 'Submitted',
    requiredRole: ['requester', 'admin'],
    description: 'Submit request for approval',
  },
  {
    from: 'Submitted',
    to: 'AO Review',
    requiredRole: ['approver', 'admin'],
    description: 'Move to approver review',
  },
  {
    from: 'AO Review',
    to: 'Approved',
    requiredRole: ['approver', 'admin'],
    description: 'Approve request',
  },
  {
    from: 'AO Review',
    to: 'Denied',
    requiredRole: ['approver', 'admin'],
    description: 'Deny request',
  },
  {
    from: 'AO Review',
    to: 'Returned',
    requiredRole: ['approver', 'admin'],
    description: 'Return request for revision',
  },
  {
    from: 'Approved',
    to: 'Cardholder Purchasing',
    requiredRole: ['cardholder', 'admin'],
    description: 'Begin purchasing process',
  },
  {
    from: 'Cardholder Purchasing',
    to: 'Purchased',
    requiredRole: ['cardholder', 'admin'],
    description: 'Mark as purchased',
  },
  {
    from: 'Purchased',
    to: 'Reconciled',
    requiredRole: ['cardholder', 'admin'],
    description: 'Reconcile purchase',
  },
  {
    from: 'Reconciled',
    to: 'Closed',
    requiredRole: ['cardholder', 'admin'],
    description: 'Close request',
  },
  {
    from: 'Returned',
    to: 'Draft',
    requiredRole: ['requester', 'admin'],
    description: 'Return to draft for editing',
  },
  {
    from: 'Returned',
    to: 'Submitted',
    requiredRole: ['requester', 'admin'],
    description: 'Resubmit after revision',
  },
];

// Terminal states (no further transitions allowed)
export const TERMINAL_STATES: RequestStatus[] = ['Closed', 'Denied'];

// States that allow editing
export const EDITABLE_STATES: RequestStatus[] = ['Draft', 'Returned'];

// States that require approval
export const APPROVAL_REQUIRED_STATES: RequestStatus[] = [
  'Submitted',
  'AO Review',
];

// States that require cardholder action
export const CARDHOLDER_ACTION_STATES: RequestStatus[] = [
  'Cardholder Purchasing',
  'Purchased',
];

// States that are considered "active" (not terminal)
export const ACTIVE_STATES: RequestStatus[] = [
  'Draft',
  'Submitted',
  'AO Review',
  'Approved',
  'Cardholder Purchasing',
  'Purchased',
  'Reconciled',
  'Returned',
];

export class RequestStateMachine {
  // Check if transition is valid
  static isValidTransition(
    from: RequestStatus,
    to: RequestStatus,
    userRole: UserRole
  ): boolean {
    const transition = STATE_TRANSITIONS.find(
      t => t.from === from && t.to === to
    );

    if (!transition) return false;

    return transition.requiredRole.includes(userRole);
  }

  // Get all valid next states for a given current state and user role
  static getValidNextStates(
    currentState: RequestStatus,
    userRole: UserRole
  ): RequestStatus[] {
    return STATE_TRANSITIONS.filter(
      t => t.from === currentState && t.requiredRole.includes(userRole)
    ).map(t => t.to);
  }

  // Get all valid previous states for a given current state and user role
  static getValidPreviousStates(
    currentState: RequestStatus,
    userRole: UserRole
  ): RequestStatus[] {
    return STATE_TRANSITIONS.filter(
      t => t.to === currentState && t.requiredRole.includes(userRole)
    ).map(t => t.from);
  }

  // Check if state is terminal
  static isTerminalState(state: RequestStatus): boolean {
    return TERMINAL_STATES.includes(state);
  }

  // Check if state allows editing
  static isEditableState(state: RequestStatus): boolean {
    return EDITABLE_STATES.includes(state);
  }

  // Check if state requires approval
  static requiresApproval(state: RequestStatus): boolean {
    return APPROVAL_REQUIRED_STATES.includes(state);
  }

  // Check if state requires cardholder action
  static requiresCardholderAction(state: RequestStatus): boolean {
    return CARDHOLDER_ACTION_STATES.includes(state);
  }

  // Check if state is active (not terminal)
  static isActiveState(state: RequestStatus): boolean {
    return ACTIVE_STATES.includes(state);
  }

  // Get transition description
  static getTransitionDescription(
    from: RequestStatus,
    to: RequestStatus
  ): string | null {
    const transition = STATE_TRANSITIONS.find(
      t => t.from === from && t.to === to
    );
    return transition?.description || null;
  }

  // Get required roles for transition
  static getRequiredRoles(from: RequestStatus, to: RequestStatus): UserRole[] {
    const transition = STATE_TRANSITIONS.find(
      t => t.from === from && t.to === to
    );
    return transition?.requiredRole || [];
  }

  // Get workflow stage for a given state
  static getWorkflowStage(state: RequestStatus): string {
    switch (state) {
      case 'Draft':
      case 'Returned':
        return 'Preparation';
      case 'Submitted':
      case 'AO Review':
        return 'Approval';
      case 'Approved':
      case 'Cardholder Purchasing':
        return 'Purchasing';
      case 'Purchased':
      case 'Reconciled':
        return 'Reconciliation';
      case 'Closed':
        return 'Complete';
      case 'Denied':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  // Get status color for UI
  static getStatusColor(state: RequestStatus): string {
    switch (state) {
      case 'Draft':
        return 'gray';
      case 'Submitted':
        return 'blue';
      case 'AO Review':
        return 'yellow';
      case 'Approved':
        return 'green';
      case 'Cardholder Purchasing':
        return 'purple';
      case 'Purchased':
        return 'indigo';
      case 'Reconciled':
        return 'emerald';
      case 'Closed':
        return 'green';
      case 'Returned':
        return 'orange';
      case 'Denied':
        return 'red';
      default:
        return 'gray';
    }
  }

  // Get status priority for sorting
  static getStatusPriority(state: RequestStatus): number {
    const priorities: Record<RequestStatus, number> = {
      Draft: 1,
      Submitted: 2,
      'AO Review': 3,
      Approved: 4,
      'Cardholder Purchasing': 5,
      Purchased: 6,
      Reconciled: 7,
      Closed: 8,
      Returned: 9,
      Denied: 10,
    };
    return priorities[state] || 0;
  }

  // Get next required action for a given state and user role
  static getNextRequiredAction(
    state: RequestStatus,
    userRole: UserRole
  ): string | null {
    if (this.isTerminalState(state)) return null;

    switch (state) {
      case 'Draft':
        if (userRole === 'requester' || userRole === 'admin') {
          return 'Submit request for approval';
        }
        break;
      case 'Submitted':
        if (userRole === 'approver' || userRole === 'admin') {
          return 'Review and approve/deny request';
        }
        break;
      case 'AO Review':
        if (userRole === 'approver' || userRole === 'admin') {
          return 'Make approval decision';
        }
        break;
      case 'Approved':
        if (userRole === 'cardholder' || userRole === 'admin') {
          return 'Begin purchasing process';
        }
        break;
      case 'Cardholder Purchasing':
        if (userRole === 'cardholder' || userRole === 'admin') {
          return 'Complete purchase and upload receipt';
        }
        break;
      case 'Purchased':
        if (userRole === 'cardholder' || userRole === 'admin') {
          return 'Reconcile purchase';
        }
        break;
      case 'Reconciled':
        if (userRole === 'cardholder' || userRole === 'admin') {
          return 'Close request';
        }
        break;
      case 'Returned':
        if (userRole === 'requester' || userRole === 'admin') {
          return 'Revise and resubmit request';
        }
        break;
    }

    return null;
  }

  // Get all possible transitions for a given state
  static getAllPossibleTransitions(state: RequestStatus): StateTransition[] {
    return STATE_TRANSITIONS.filter(t => t.from === state);
  }

  // Validate state transition with additional context
  static validateTransition(
    from: RequestStatus,
    to: RequestStatus,
    userRole: UserRole,
    context?: {
      requestId?: string;
      userId?: string;
      orgId?: string;
      amount?: number;
      approvalLimit?: number;
    }
  ): { valid: boolean; reason?: string } {
    // Check basic transition validity
    if (!this.isValidTransition(from, to, userRole)) {
      return {
        valid: false,
        reason: `Invalid transition from ${from} to ${to} for role ${userRole}`,
      };
    }

    // Check if user can approve amount (if applicable)
    if (to === 'Approved' && context?.amount && context?.approvalLimit) {
      if (context.amount > context.approvalLimit && userRole !== 'admin') {
        return {
          valid: false,
          reason: `Amount ${context.amount} exceeds approval limit ${context.approvalLimit}`,
        };
      }
    }

    // Additional validation can be added here
    // e.g., checking if user belongs to same org, etc.

    return { valid: true };
  }
}
