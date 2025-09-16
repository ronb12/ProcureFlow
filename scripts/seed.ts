import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: 'procureflow-demo',
  });
} else {
  // Use default credentials (for emulator)
  initializeApp({
    projectId: 'procureflow-demo',
  });
}

const db = getFirestore();
const auth = getAuth();

async function seedData() {
  console.log('🌱 Starting data seeding...');

  try {
    // Create organizations
    console.log('Creating organizations...');
    const orgs = [
      {
        id: 'org_cdc',
        name: 'Centers for Disease Control and Prevention',
        code: 'CDC',
      },
      {
        id: 'org_sac',
        name: 'Strategic Air Command',
        code: 'SAC',
      },
    ];

    for (const org of orgs) {
      await db.collection('orgs').doc(org.id).set({
        name: org.name,
        code: org.code,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Created organization: ${org.name}`);
    }

    // Create users
    console.log('Creating users...');
    const users = [
      {
        uid: 'test_user',
        email: 'test@procureflow.demo',
        name: 'Test User (All Roles)',
        role: 'requester', // Default role, can be switched in debug mode
        orgId: 'org_cdc',
        approvalLimit: 5000,
        phone: '555-0001',
        department: 'IT Department',
        title: 'Test User',
      },
      {
        uid: 'admin_user',
        email: 'admin@procureflow.demo',
        name: 'Sarah Johnson',
        role: 'admin',
        orgId: 'org_cdc',
        approvalLimit: 100000,
        phone: '555-0002',
        department: 'Administration',
        title: 'System Administrator',
      },
      {
        uid: 'requester_user',
        email: 'requester@procureflow.demo',
        name: 'John Smith',
        role: 'requester',
        orgId: 'org_cdc',
        approvalLimit: 0,
        phone: '555-0003',
        department: 'Operations',
        title: 'Operations Manager',
      },
      {
        uid: 'approver_user',
        email: 'approver@procureflow.demo',
        name: 'Jane Williams',
        role: 'approver',
        orgId: 'org_cdc',
        approvalLimit: 10000,
        phone: '555-0004',
        department: 'Finance',
        title: 'Finance Director',
      },
      {
        uid: 'cardholder_user',
        email: 'cardholder@procureflow.demo',
        name: 'Robert Davis',
        role: 'cardholder',
        orgId: 'org_cdc',
        approvalLimit: 0,
        phone: '555-0005',
        department: 'Procurement',
        title: 'Procurement Specialist',
      },
      {
        uid: 'auditor_user',
        email: 'auditor@procureflow.demo',
        name: 'Alice Brown',
        role: 'auditor',
        orgId: 'org_cdc',
        approvalLimit: 0,
        phone: '555-0006',
        department: 'Compliance',
        title: 'Compliance Auditor',
      },
    ];

    for (const user of users) {
      // Create user document
      await db.collection('users').doc(user.uid).set({
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        approvalLimit: user.approvalLimit,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create Firebase Auth user
      try {
        await auth.createUser({
          uid: user.uid,
          email: user.email,
          displayName: user.name,
          password: 'demo123', // Default password for demo
        });
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      } catch (error: any) {
        if (error.code === 'auth/uid-already-exists') {
          console.log(`⚠️  User already exists: ${user.name}`);
        } else {
          console.error(`❌ Error creating user ${user.name}:`, error.message);
        }
      }
    }

    // Create global settings
    console.log('Creating global settings...');
    await db
      .collection('settings')
      .doc('global')
      .set({
        microPurchaseLimit: 10000,
        blockedMerchants: ['Blocked Vendor Inc.'],
        splitPurchaseWindowDays: 1,
        taxRatesByState: {
          CA: 0.0875,
          NY: 0.08,
          TX: 0.0625,
          FL: 0.06,
        },
        updatedAt: new Date(),
      });
    console.log('✅ Created global settings');

    // Create sample request
    console.log('Creating sample request...');
    const requestId = 'sample_request_1';
    const requestData = {
      orgId: 'org_cdc',
      requesterId: 'requester_user',
      vendor: 'Home Depot',
      justification: 'Office supplies and equipment for Q1 2024',
      needBy: new Date('2024-02-15'),
      status: 'Approved',
      accountingCode: 'ACCT-001',
      suspectedSplit: false,
      totalEstimate: 2500.0,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
    };

    await db.collection('requests').doc(requestId).set(requestData);

    // Create sample items
    const items = [
      {
        id: 'item_1',
        sku: 'HD-001',
        desc: 'Office Desk Chair',
        qty: 2,
        estUnitPrice: 150.0,
        lineTotal: 300.0,
      },
      {
        id: 'item_2',
        sku: 'HD-002',
        desc: 'Standing Desk',
        qty: 1,
        estUnitPrice: 800.0,
        lineTotal: 800.0,
      },
      {
        id: 'item_3',
        sku: 'HD-003',
        desc: 'Office Supplies Kit',
        qty: 5,
        estUnitPrice: 280.0,
        lineTotal: 1400.0,
      },
    ];

    for (const item of items) {
      await db
        .collection('requests')
        .doc(requestId)
        .collection('items')
        .doc(item.id)
        .set(item);
    }

    // Create sample approval
    await db.collection('approvals').add({
      reqId: requestId,
      approverId: 'approver_user',
      action: 'Approved',
      comment: 'Approved for office equipment upgrade',
      timestamp: new Date('2024-01-12'),
    });

    console.log('✅ Created sample request with items and approval');

    // Create sample cycle
    console.log('Creating sample cycle...');
    const cycleId = 'cycle_2024_01';
    await db
      .collection('cycles')
      .doc(cycleId)
      .set({
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    console.log('✅ Created sample cycle');

    console.log('🎉 Data seeding completed successfully!');
    // Create sample audit packages
    console.log('Creating sample audit packages...');
    const auditPackages = [
      {
        id: 'audit-pkg-001',
        requestId: 'REQ-2024-001',
        poId: 'PO-2024-001',
        purchaseId: 'PUR-2024-001',
        cardholderId: 'cardholder1',
        approverId: 'approver1',
        orgId: 'org_cdc',
        status: 'audit_ready',
        auditScore: 95,
        totalIssues: 0,
        criticalIssues: 0,
        warnings: 0,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-22'),
        lastAuditedAt: new Date('2024-01-22'),
        exportUrl: '/exports/audit-package-001.zip',
        exportGeneratedAt: new Date('2024-01-22'),
        exportExpiresAt: new Date('2024-02-21')
      },
      {
        id: 'audit-pkg-002',
        requestId: 'REQ-2024-002',
        poId: 'PO-2024-002',
        purchaseId: 'PUR-2024-002',
        cardholderId: 'cardholder2',
        approverId: 'approver1',
        orgId: 'org_cdc',
        status: 'incomplete',
        auditScore: 45,
        totalIssues: 8,
        criticalIssues: 4,
        warnings: 4,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'audit-pkg-003',
        requestId: 'REQ-2024-003',
        poId: 'PO-2024-003',
        purchaseId: 'PUR-2024-003',
        cardholderId: 'cardholder3',
        approverId: 'approver2',
        orgId: 'org_sac',
        status: 'compliant',
        auditScore: 88,
        totalIssues: 0,
        criticalIssues: 0,
        warnings: 0,
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-26')
      },
      {
        id: 'audit-pkg-004',
        requestId: 'REQ-2024-004',
        poId: 'PO-2024-004',
        purchaseId: 'PUR-2024-004',
        cardholderId: 'cardholder4',
        approverId: 'approver2',
        orgId: 'org_sac',
        status: 'pending_review',
        auditScore: 75,
        totalIssues: 2,
        criticalIssues: 0,
        warnings: 2,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-27')
      },
      {
        id: 'audit-pkg-005',
        requestId: 'REQ-2024-005',
        poId: 'PO-2024-005',
        purchaseId: 'PUR-2024-005',
        cardholderId: 'cardholder5',
        approverId: 'approver3',
        orgId: 'org_cdc',
        status: 'non_compliant',
        auditScore: 25,
        totalIssues: 15,
        criticalIssues: 10,
        warnings: 5,
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-24')
      }
    ];

    for (const pkg of auditPackages) {
      await db.collection('auditPackages').doc(pkg.id).set(pkg);
      console.log(`✅ Created audit package: ${pkg.requestId}`);
    }

    // Create sample compliance checks
    console.log('Creating sample compliance checks...');
    const complianceChecks = [
      {
        id: 'check-001',
        packageId: 'audit-pkg-001',
        checkType: 'micro_purchase_limit',
        passed: true,
        details: 'Purchase within $10,000 limit',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'check-002',
        packageId: 'audit-pkg-001',
        checkType: 'split_purchase_detection',
        passed: true,
        details: 'No split purchases detected',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'check-003',
        packageId: 'audit-pkg-005',
        checkType: 'micro_purchase_limit',
        passed: false,
        details: 'Purchase exceeds micro-purchase limit',
        issues: ['Purchase exceeds $10,000 limit'],
        createdAt: new Date('2024-01-24')
      }
    ];

    for (const check of complianceChecks) {
      await db.collection('complianceChecks').doc(check.id).set(check);
      console.log(`✅ Created compliance check: ${check.checkType}`);
    }

    // Create sample message threads
    console.log('Creating sample message threads...');
    const messageThreads = [
      {
        id: 'thread-001',
        participants: ['requester_user', 'approver_user'],
        requestId: 'REQ-2024-001',
        subject: 'Office Supplies Request - REQ-2024-001',
        lastMessage: 'The approval has been processed and sent to cardholder.',
        lastMessageTime: new Date('2024-01-15T10:30:00Z'),
        unreadCount: 2,
        priority: 'normal',
        type: 'request',
        status: 'active',
        createdAt: new Date('2024-01-15T09:00:00Z'),
        updatedAt: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: 'thread-002',
        participants: ['auditor_user', 'cardholder_user'],
        requestId: 'AUDIT-2024-001',
        subject: 'Audit Findings - REQ-2024-002',
        lastMessage: 'Please review the compliance issues found in your purchase.',
        lastMessageTime: new Date('2024-01-15T09:15:00Z'),
        unreadCount: 1,
        priority: 'high',
        type: 'audit',
        status: 'active',
        createdAt: new Date('2024-01-15T08:00:00Z'),
        updatedAt: new Date('2024-01-15T09:15:00Z')
      },
      {
        id: 'thread-003',
        participants: ['requester_user', 'auditor_user', 'admin_user'],
        requestId: null,
        subject: 'General Discussion - Q1 Compliance Review',
        lastMessage: 'The quarterly compliance review is scheduled for next week.',
        lastMessageTime: new Date('2024-01-14T16:45:00Z'),
        unreadCount: 0,
        priority: 'normal',
        type: 'general',
        status: 'active',
        createdAt: new Date('2024-01-14T15:00:00Z'),
        updatedAt: new Date('2024-01-14T16:45:00Z')
      },
      {
        id: 'thread-004',
        participants: ['approver_user', 'cardholder_user'],
        requestId: 'REQ-2024-003',
        subject: 'Equipment Purchase - REQ-2024-003',
        lastMessage: 'The purchase order has been created successfully.',
        lastMessageTime: new Date('2024-01-14T14:20:00Z'),
        unreadCount: 0,
        priority: 'normal',
        type: 'request',
        status: 'resolved',
        createdAt: new Date('2024-01-14T13:00:00Z'),
        updatedAt: new Date('2024-01-14T14:20:00Z')
      }
    ];

    for (const thread of messageThreads) {
      await db.collection('messageThreads').doc(thread.id).set(thread);
      console.log(`✅ Created message thread: ${thread.subject}`);
    }

    // Create sample messages
    console.log('Creating sample messages...');
    const messages = [
      {
        id: 'msg-001',
        threadId: 'thread-001',
        senderId: 'requester_user',
        recipientId: 'approver_user',
        content: 'Hi Jane, I need approval for the office supplies request. The total amount is $1,250 and all items are within policy.',
        timestamp: new Date('2024-01-15T10:00:00Z'),
        read: false,
        type: 'text',
        attachments: [],
        createdAt: new Date('2024-01-15T10:00:00Z')
      },
      {
        id: 'msg-002',
        threadId: 'thread-001',
        senderId: 'approver_user',
        recipientId: 'requester_user',
        content: 'I\'ve reviewed your request. Everything looks good. I\'ll process the approval now.',
        timestamp: new Date('2024-01-15T10:15:00Z'),
        read: true,
        type: 'text',
        attachments: [],
        createdAt: new Date('2024-01-15T10:15:00Z')
      },
      {
        id: 'msg-003',
        threadId: 'thread-001',
        senderId: 'approver_user',
        recipientId: 'requester_user',
        content: 'The approval has been processed and sent to cardholder.',
        timestamp: new Date('2024-01-15T10:30:00Z'),
        read: false,
        type: 'text',
        attachments: [],
        createdAt: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: 'msg-004',
        threadId: 'thread-002',
        senderId: 'auditor_user',
        recipientId: 'cardholder_user',
        content: 'Please review the compliance issues found in your purchase. There are 3 critical issues that need immediate attention.',
        timestamp: new Date('2024-01-15T09:15:00Z'),
        read: false,
        type: 'text',
        attachments: ['audit-findings.pdf'],
        createdAt: new Date('2024-01-15T09:15:00Z')
      },
      {
        id: 'msg-005',
        threadId: 'thread-003',
        senderId: 'admin_user',
        recipientId: 'requester_user',
        content: 'The quarterly compliance review is scheduled for next week. Please ensure all documentation is up to date.',
        timestamp: new Date('2024-01-14T16:45:00Z'),
        read: true,
        type: 'text',
        attachments: [],
        createdAt: new Date('2024-01-14T16:45:00Z')
      }
    ];

    for (const message of messages) {
      await db.collection('messages').doc(message.id).set(message);
      console.log(`✅ Created message: ${message.id}`);
    }

    // Create message read status
    console.log('Creating message read status...');
    const readStatuses = [
      {
        id: 'read-001',
        userId: 'requester_user',
        messageId: 'msg-002',
        readAt: new Date('2024-01-15T10:20:00Z'),
        createdAt: new Date('2024-01-15T10:20:00Z')
      },
      {
        id: 'read-002',
        userId: 'admin_user',
        messageId: 'msg-005',
        readAt: new Date('2024-01-14T17:00:00Z'),
        createdAt: new Date('2024-01-14T17:00:00Z')
      }
    ];

    for (const status of readStatuses) {
      await db.collection('messageReadStatus').doc(status.id).set(status);
      console.log(`✅ Created read status: ${status.id}`);
    }

    console.log('\n📋 Demo Accounts:');
    console.log('Admin: admin@procureflow.demo / demo123');
    console.log('Requester: requester@procureflow.demo / demo123');
    console.log('Approver: approver@procureflow.demo / demo123');
    console.log('Cardholder: cardholder@procureflow.demo / demo123');
    console.log('Auditor: auditor@procureflow.demo / demo123');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedData();
