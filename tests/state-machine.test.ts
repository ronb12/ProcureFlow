import { describe, expect, it } from 'vitest';
import { RequestStateMachine } from '../lib/state-machine';

describe('procurement authorization', () => {
  it('forbids requester approval and cardholder approval', () => {
    expect(RequestStateMachine.isValidTransition('AO Review', 'Approved', 'requester')).toBe(false);
    expect(RequestStateMachine.isValidTransition('AO Review', 'Approved', 'cardholder')).toBe(false);
  });

  it('rejects approvals above the approver limit', () => {
    expect(RequestStateMachine.validateTransition('AO Review', 'Approved', 'approver', {
      amount: 5001, approvalLimit: 5000,
    }).valid).toBe(false);
  });

  it('rejects approvals with a missing limit', () => {
    expect(RequestStateMachine.validateTransition('AO Review', 'Approved', 'approver', {
      amount: 100,
    }).valid).toBe(false);
  });

  it('permits a properly authorized approval', () => {
    expect(RequestStateMachine.validateTransition('AO Review', 'Approved', 'approver', {
      amount: 500, approvalLimit: 5000,
    }).valid).toBe(true);
  });

  it('prevents terminal state changes', () => {
    expect(RequestStateMachine.getValidNextStates('Denied', 'admin')).toEqual([]);
    expect(RequestStateMachine.getValidNextStates('Closed', 'admin')).toEqual([]);
  });
});
