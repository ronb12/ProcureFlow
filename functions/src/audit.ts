import { getFirestore } from 'firebase-admin/firestore';
// import { AuditEvent } from './types';

const db = getFirestore();

export interface AuditEventData {
  entity: 'request' | 'approval' | 'purchase' | 'cycle';
  entityId: string;
  actorUid: string;
  action: string;
  details?: Record<string, any>;
}

export async function auditEvent(data: AuditEventData): Promise<void> {
  try {
    await db.collection('audit').add({
      entity: data.entity,
      entityId: data.entityId,
      actorUid: data.actorUid,
      action: data.action,
      details: data.details || {},
      at: new Date(),
    });
  } catch (error) {
    console.error('Error creating audit event:', error);
    // Don't throw - audit failures shouldn't break the main operation
  }
}
