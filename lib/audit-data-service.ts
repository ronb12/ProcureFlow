// Audit Data Service - Retrieves and manages audit data from purchases

import { db } from './firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

export interface PurchasePackage {
  id: string;
  requestId: string;
  purchaseId: string;
  cardholderId: string;
  cardholderName: string;
  approverId: string;
  approverName: string;
  vendor: string;
  amount: number;
  status: 'purchased' | 'reconciled' | 'closed';
  purchaseDate: Date;
  reconciliationDate?: Date;
  documents: {
    purchaseRequest: boolean;
    approval: boolean;
    purchaseOrder: boolean;
    receipt: boolean;
    deliveryConfirmation: boolean;
    reconciliation: boolean;
  };
  complianceChecks: {
    microPurchaseLimit: boolean;
    splitPurchaseDetection: boolean;
    blockedMerchantCheck: boolean;
    vendorApproval: boolean;
    deliveryAddressValidation: boolean;
  };
  auditStatus: 'pending_audit' | 'under_review' | 'findings_issued' | 'resolved' | 'non_compliant' | 'disputed' | 'escalated';
  auditScore: number;
  totalIssues: number;
  criticalIssues: number;
  findings: AuditFinding[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditFinding {
  id: string;
  packageId: string;
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
  cardholderResponse?: CardholderResponse;
  auditorResponse?: AuditorResponse;
}

export interface CardholderResponse {
  id: string;
  findingId: string;
  cardholderId: string;
  responseType: 'acknowledge' | 'dispute' | 'resolve' | 'request_extension';
  responseText: string;
  supportingDocuments?: string[];
  createdAt: Date;
  status: 'pending_review' | 'accepted' | 'rejected' | 'needs_revision';
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

// Service class for audit data operations
export class AuditDataService {
  // Retrieve all purchase packages that need auditing
  static async getPurchasePackagesForAudit(): Promise<PurchasePackage[]> {
    try {
      // Query purchases collection for packages that need auditing
      // Priority: Reconciled purchases first (complete audit), then purchased (preliminary audit)
      const purchasesQuery = query(
        collection(db, 'purchases'),
        where('status', 'in', ['reconciled', 'purchased']),
        orderBy('status', 'desc'), // 'reconciled' comes before 'purchased' alphabetically
        orderBy('createdAt', 'desc')
      );
      const purchasesSnapshot = await getDocs(purchasesQuery);

      const packages: PurchasePackage[] = [];

      for (const purchaseDoc of purchasesSnapshot.docs) {
        const purchaseData = purchaseDoc.data();
        
        // Get related request data
        const requestDoc = await getDoc(doc(db, 'requests', purchaseData.reqId));
        const requestData = requestDoc.data();

        // Get user data for cardholder and approver
        const cardholderDoc = await getDoc(doc(db, 'users', purchaseData.cardholderId));
        const cardholderData = cardholderDoc.data();

        // Get audit findings for this package
        const findingsQuery = query(
          collection(db, 'auditFindings'),
          where('packageId', '==', purchaseDoc.id)
        );
        const findingsSnapshot = await getDocs(findingsQuery);

        const findings: AuditFinding[] = findingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          dueDate: doc.data().dueDate?.toDate(),
        })) as AuditFinding[];

        // Calculate audit status and score
        const auditStatus = this.calculateAuditStatus(purchaseData, findings);
        const auditScore = this.calculateAuditScore(purchaseData, findings);
        const totalIssues = findings.length;
        const criticalIssues = findings.filter(f => f.severity === 'critical').length;

        const packageData: PurchasePackage = {
          id: purchaseDoc.id,
          requestId: purchaseData.reqId,
          purchaseId: purchaseDoc.id,
          cardholderId: purchaseData.cardholderId,
          cardholderName: cardholderData?.name || 'Unknown',
          approverId: requestData?.approverId || '',
          approverName: requestData?.approverName || 'Unknown',
          vendor: purchaseData.merchant || requestData?.vendor || 'Unknown',
          amount: purchaseData.finalTotal || 0,
          status: purchaseData.status || 'purchased',
          purchaseDate: purchaseData.createdAt?.toDate() || new Date(),
          reconciliationDate: purchaseData.reconciliationDate?.toDate(),
          documents: {
            purchaseRequest: !!requestData,
            approval: !!purchaseData.approvalId,
            purchaseOrder: !!purchaseData.orderNumber,
            receipt: !!purchaseData.receiptUrl,
            deliveryConfirmation: !!purchaseData.deliveryConfirmation,
            reconciliation: purchaseData.status === 'reconciled'
          },
          complianceChecks: {
            microPurchaseLimit: (purchaseData.finalTotal || 0) <= 10000,
            splitPurchaseDetection: !purchaseData.suspectedSplit,
            blockedMerchantCheck: !purchaseData.blockedMerchant,
            vendorApproval: !!purchaseData.vendorApproved,
            deliveryAddressValidation: !!purchaseData.deliveryAddressValid
          },
          auditStatus,
          auditScore,
          totalIssues,
          criticalIssues,
          findings,
          createdAt: purchaseData.createdAt?.toDate() || new Date(),
          updatedAt: purchaseData.updatedAt?.toDate() || new Date()
        };

        packages.push(packageData);
      }

      return packages;
    } catch (error) {
      console.error('Error retrieving purchase packages for audit:', error);
      return [];
    }
  }

  // Calculate audit status based on package data and findings
  private static calculateAuditStatus(purchaseData: any, findings: AuditFinding[]): 'pending_audit' | 'under_review' | 'findings_issued' | 'resolved' | 'non_compliant' | 'disputed' | 'escalated' {
    if (findings.length === 0) {
      return 'pending_audit';
    }
    
    const openFindings = findings.filter(f => f.status === 'open');
    const resolvedFindings = findings.filter(f => f.status === 'resolved');
    
    if (openFindings.length === 0) {
      return 'resolved';
    }
    
    if (openFindings.some(f => f.severity === 'critical')) {
      return 'non_compliant';
    }
    
    return 'findings_issued';
  }

  // Calculate audit score based on compliance checks and findings
  private static calculateAuditScore(purchaseData: any, findings: AuditFinding[]): number {
    let score = 100;
    
    // Deduct points for compliance issues
    const complianceChecks = {
      microPurchaseLimit: (purchaseData.finalTotal || 0) <= 10000,
      splitPurchaseDetection: !purchaseData.suspectedSplit,
      blockedMerchantCheck: !purchaseData.blockedMerchant,
      vendorApproval: !!purchaseData.vendorApproved,
      deliveryAddressValidation: !!purchaseData.deliveryAddressValid
    };
    
    Object.values(complianceChecks).forEach(check => {
      if (!check) score -= 20;
    });
    
    // Deduct points for findings
    findings.forEach(finding => {
      switch (finding.severity) {
        case 'critical': score -= 30; break;
        case 'high': score -= 20; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }
    });
    
    return Math.max(0, score);
  }

  // Create audit finding
  static async createAuditFinding(finding: Omit<AuditFinding, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const findingData = {
        ...finding,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'auditFindings'), findingData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating audit finding:', error);
      throw error;
    }
  }

  // Update audit finding
  static async updateAuditFinding(findingId: string, updates: Partial<AuditFinding>): Promise<void> {
    try {
      await updateDoc(doc(db, 'auditFindings', findingId), {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating audit finding:', error);
      throw error;
    }
  }

  // Add cardholder response to finding
  static async addCardholderResponse(findingId: string, response: Omit<CardholderResponse, 'id' | 'createdAt'>): Promise<string> {
    try {
      const responseData = {
        ...response,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'cardholderResponses'), responseData);
      
      // Update finding status
      await this.updateAuditFinding(findingId, {
        status: 'acknowledged',
        cardholderResponse: {
          id: docRef.id,
          ...responseData
        }
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding cardholder response:', error);
      throw error;
    }
  }

  // Add auditor response to finding
  static async addAuditorResponse(findingId: string, response: Omit<AuditorResponse, 'id' | 'createdAt'>): Promise<string> {
    try {
      const responseData = {
        ...response,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'auditorResponses'), responseData);
      
      // Update finding status based on response type
      let newStatus = 'open';
      if (response.responseType === 'accept') {
        newStatus = 'resolved';
      } else if (response.responseType === 'reject') {
        newStatus = 'open';
      } else if (response.responseType === 'escalate') {
        newStatus = 'escalated';
      }
      
      await this.updateAuditFinding(findingId, {
        status: newStatus as any,
        auditorResponse: {
          id: docRef.id,
          ...responseData
        }
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding auditor response:', error);
      throw error;
    }
  }

  // Get audit findings for a specific cardholder
  static async getAuditFindingsForCardholder(cardholderId: string): Promise<AuditFinding[]> {
    try {
      const findingsQuery = query(
        collection(db, 'auditFindings'),
        where('cardholderId', '==', cardholderId),
        orderBy('createdAt', 'desc')
      );
      const findingsSnapshot = await getDocs(findingsQuery);

      return findingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        dueDate: doc.data().dueDate?.toDate(),
      })) as AuditFinding[];
    } catch (error) {
      console.error('Error retrieving audit findings for cardholder:', error);
      return [];
    }
  }
}
