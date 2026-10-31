import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const rules = readFileSync('firestore.rules', 'utf8');
const storage = readFileSync('storage.rules', 'utf8');
const cloud = readFileSync('functions/src/index.ts', 'utf8');

describe('privilege boundary regression checks', () => {
  it('limits self-service edits to profile fields', () => {
    expect(rules).toContain("hasOnly(['name', 'updatedAt'])");
    expect(rules).not.toMatch(/allow update: if isSignedIn\(\) && \(request\.auth\.uid == userId \|\| isAdmin\(\)\)/);
  });

  it('validates request ownership and tenant', () => {
    expect(rules).toContain('request.resource.data.requesterId == request.auth.uid');
    expect(rules).toContain('isSameOrg(request.resource.data.orgId)');
    expect(rules).toContain('isSameOrg(resource.data.orgId)');
  });

  it('prevents direct purchases and approvals', () => {
    for (const name of ['approvals', 'purchases', 'purchaseOrders']) {
      const block = rules.slice(rules.indexOf('match /' + name + '/'));
      expect(block.slice(0, 500)).toContain('allow write: if false;');
    }
  });

  it('does not accept attacker-supplied request update payload', () => {
    expect(cloud).not.toContain('...payload,');
    expect(cloud).toContain('db.runTransaction');
  });

  it('does not permit unrestricted storage exports', () => {
    expect(storage).toContain('allow write: if false; // Cloud Functions generate vetted exports.');
  });
});
