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

    // Create additional sample requests for admin testing
    console.log('Creating additional sample requests for admin testing...');
    const additionalRequests = [
      {
        id: 'REQ-2024-002',
        requesterId: 'requester_user',
        orgId: 'org_cdc',
        title: 'IT Equipment Purchase',
        description: 'Purchase laptops and monitors for new employees',
        vendor: 'Dell Technologies',
        vendorAddress: '123 Tech Street, Austin, TX 78701',
        vendorCity: 'Austin',
        vendorState: 'TX',
        vendorZip: '78701',
        vendorPhone: '1-800-DELL-123',
        vendorEmail: 'sales@dell.com',
        vendorTaxId: '12-3456789',
        deliveryAddress: '456 Military Base Road',
        deliveryCity: 'Base City',
        deliveryState: 'CA',
        deliveryZip: '98765',
        deliveryContact: 'John Smith',
        deliveryPhone: '555-0123',
        deliveryInstructions: 'Deliver to main entrance, call upon arrival',
        accountingCode: 'IT-001',
        needBy: new Date('2024-02-15'),
        totalEstimate: 15000.0,
        status: 'AO Review',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
        submittedAt: new Date('2024-01-11'),
        reviewedAt: new Date('2024-01-12'),
      },
      {
        id: 'REQ-2024-003',
        requesterId: 'test_user',
        orgId: 'org_cdc',
        title: 'Office Furniture',
        description: 'Ergonomic chairs and desks for office renovation',
        vendor: 'Herman Miller',
        vendorAddress: '789 Design Ave, Zeeland, MI 49464',
        vendorCity: 'Zeeland',
        vendorState: 'MI',
        vendorZip: '49464',
        vendorPhone: '1-800-HERMAN',
        vendorEmail: 'orders@hermanmiller.com',
        vendorTaxId: '98-7654321',
        deliveryAddress: '456 Military Base Road',
        deliveryCity: 'Base City',
        deliveryState: 'CA',
        deliveryZip: '98765',
        deliveryContact: 'Jane Doe',
        deliveryPhone: '555-0456',
        deliveryInstructions: 'Deliver to loading dock, use freight elevator',
        accountingCode: 'FURN-002',
        needBy: new Date('2024-03-01'),
        totalEstimate: 25000.0,
        status: 'Approved',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-14'),
        submittedAt: new Date('2024-01-09'),
        reviewedAt: new Date('2024-01-14'),
        approvedAt: new Date('2024-01-14'),
      },
      {
        id: 'REQ-2024-004',
        requesterId: 'requester_user',
        orgId: 'org_sac',
        title: 'Software Licenses',
        description: 'Annual software license renewal for development team',
        vendor: 'Microsoft Corporation',
        vendorAddress: '1 Microsoft Way, Redmond, WA 98052',
        vendorCity: 'Redmond',
        vendorState: 'WA',
        vendorZip: '98052',
        vendorPhone: '1-800-MICROSOFT',
        vendorEmail: 'licensing@microsoft.com',
        vendorTaxId: '91-1144442',
        deliveryAddress: '789 Air Force Base',
        deliveryCity: 'Air City',
        deliveryState: 'NE',
        deliveryZip: '12345',
        deliveryContact: 'Bob Johnson',
        deliveryPhone: '555-0789',
        deliveryInstructions: 'Digital delivery to IT department',
        accountingCode: 'SOFT-003',
        needBy: new Date('2024-02-28'),
        totalEstimate: 5000.0,
        status: 'Cardholder Purchasing',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-16'),
        submittedAt: new Date('2024-01-06'),
        reviewedAt: new Date('2024-01-15'),
        approvedAt: new Date('2024-01-15'),
        assignedToCardholderAt: new Date('2024-01-16'),
      },
      {
        id: 'REQ-2024-005',
        requesterId: 'test_user',
        orgId: 'org_cdc',
        title: 'Laboratory Equipment',
        description: 'Microscopes and lab supplies for research facility',
        vendor: 'Thermo Fisher Scientific',
        vendorAddress: '168 Third Avenue, Waltham, MA 02451',
        vendorCity: 'Waltham',
        vendorState: 'MA',
        vendorZip: '02451',
        vendorPhone: '1-800-874-3723',
        vendorEmail: 'orders@thermofisher.com',
        vendorTaxId: '04-2107374',
        deliveryAddress: '456 Military Base Road',
        deliveryCity: 'Base City',
        deliveryState: 'CA',
        deliveryZip: '98765',
        deliveryContact: 'Dr. Sarah Wilson',
        deliveryPhone: '555-0321',
        deliveryInstructions: 'Deliver to Building 5, Lab 3A',
        accountingCode: 'LAB-004',
        needBy: new Date('2024-02-10'),
        totalEstimate: 35000.0,
        status: 'Purchased',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-18'),
        submittedAt: new Date('2024-01-04'),
        reviewedAt: new Date('2024-01-13'),
        approvedAt: new Date('2024-01-13'),
        assignedToCardholderAt: new Date('2024-01-14'),
        purchasedAt: new Date('2024-01-18'),
      },
      {
        id: 'REQ-2024-006',
        requesterId: 'requester_user',
        orgId: 'org_sac',
        title: 'Security Equipment',
        description: 'CCTV cameras and access control systems',
        vendor: 'Axis Communications',
        vendorAddress: '300 Apollo Drive, Chelmsford, MA 01824',
        vendorCity: 'Chelmsford',
        vendorState: 'MA',
        vendorZip: '01824',
        vendorPhone: '1-978-614-2000',
        vendorEmail: 'sales@axis.com',
        vendorTaxId: '04-343-1234',
        deliveryAddress: '789 Air Force Base',
        deliveryCity: 'Air City',
        deliveryState: 'NE',
        deliveryZip: '12345',
        deliveryContact: 'Security Chief',
        deliveryPhone: '555-0654',
        deliveryInstructions: 'Deliver to security office, requires escort',
        accountingCode: 'SEC-005',
        needBy: new Date('2024-03-15'),
        totalEstimate: 12000.0,
        status: 'Reconciled',
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2024-01-20'),
        submittedAt: new Date('2023-12-21'),
        reviewedAt: new Date('2023-12-28'),
        approvedAt: new Date('2023-12-28'),
        assignedToCardholderAt: new Date('2023-12-29'),
        purchasedAt: new Date('2024-01-05'),
        reconciledAt: new Date('2024-01-20'),
      },
      {
        id: 'REQ-2024-007',
        requesterId: 'test_user',
        orgId: 'org_cdc',
        title: 'Training Materials',
        description: 'Books and online course subscriptions',
        vendor: 'Amazon Business',
        vendorAddress: '410 Terry Ave N, Seattle, WA 98109',
        vendorCity: 'Seattle',
        vendorState: 'WA',
        vendorZip: '98109',
        vendorPhone: '1-888-280-4331',
        vendorEmail: 'business@amazon.com',
        vendorTaxId: '91-1646860',
        deliveryAddress: '456 Military Base Road',
        deliveryCity: 'Base City',
        deliveryState: 'CA',
        deliveryZip: '98765',
        deliveryContact: 'Training Coordinator',
        deliveryPhone: '555-0987',
        deliveryInstructions: 'Deliver to HR department',
        accountingCode: 'TRAIN-006',
        needBy: new Date('2024-02-01'),
        totalEstimate: 2500.0,
        status: 'Closed',
        createdAt: new Date('2023-12-15'),
        updatedAt: new Date('2024-01-22'),
        submittedAt: new Date('2023-12-16'),
        reviewedAt: new Date('2023-12-20'),
        approvedAt: new Date('2023-12-20'),
        assignedToCardholderAt: new Date('2023-12-21'),
        purchasedAt: new Date('2023-12-28'),
        reconciledAt: new Date('2024-01-10'),
        closedAt: new Date('2024-01-22'),
      },
      {
        id: 'REQ-2024-008',
        requesterId: 'requester_user',
        orgId: 'org_sac',
        title: 'Maintenance Supplies',
        description: 'Cleaning supplies and maintenance tools',
        vendor: 'Grainger',
        vendorAddress: '100 Grainger Parkway, Lake Forest, IL 60045',
        vendorCity: 'Lake Forest',
        vendorState: 'IL',
        vendorZip: '60045',
        vendorPhone: '1-800-GRAINGER',
        vendorEmail: 'orders@grainger.com',
        vendorTaxId: '36-1234567',
        deliveryAddress: '789 Air Force Base',
        deliveryCity: 'Air City',
        deliveryState: 'NE',
        deliveryZip: '12345',
        deliveryContact: 'Facilities Manager',
        deliveryPhone: '555-0123',
        deliveryInstructions: 'Deliver to maintenance building',
        accountingCode: 'MAINT-007',
        needBy: new Date('2024-01-30'),
        totalEstimate: 800.0,
        status: 'Denied',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-08'),
        submittedAt: new Date('2024-01-03'),
        reviewedAt: new Date('2024-01-08'),
        deniedAt: new Date('2024-01-08'),
        denialReason: 'Budget constraints - request exceeds available funds',
      },
      {
        id: 'REQ-2024-009',
        requesterId: 'test_user',
        orgId: 'org_cdc',
        title: 'Communication Equipment',
        description: 'Two-way radios and communication accessories',
        vendor: 'Motorola Solutions',
        vendorAddress: '500 W Madison St, Chicago, IL 60661',
        vendorCity: 'Chicago',
        vendorState: 'IL',
        vendorZip: '60661',
        vendorPhone: '1-800-422-4210',
        vendorEmail: 'sales@motorolasolutions.com',
        vendorTaxId: '36-1234567',
        deliveryAddress: '456 Military Base Road',
        deliveryCity: 'Base City',
        deliveryState: 'CA',
        deliveryZip: '98765',
        deliveryContact: 'Comm Officer',
        deliveryPhone: '555-0456',
        deliveryInstructions: 'Deliver to communications center',
        accountingCode: 'COMM-008',
        needBy: new Date('2024-02-20'),
        totalEstimate: 18000.0,
        status: 'Returned',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-19'),
        submittedAt: new Date('2024-01-13'),
        reviewedAt: new Date('2024-01-18'),
        returnedAt: new Date('2024-01-19'),
        returnReason: 'Incomplete specifications - need frequency details',
      }
    ];

    for (const request of additionalRequests) {
      await db.collection('requests').doc(request.id).set(request);
      console.log(`✅ Created request: ${request.title}`);
    }

    // Create sample purchases for admin testing
    console.log('Creating sample purchases...');
    const purchases = [
      {
        id: 'PUR-2024-001',
        reqId: 'REQ-2024-005',
        cardholderId: 'cardholder_user',
        merchant: 'Thermo Fisher Scientific',
        orderNumber: 'TF-2024-001234',
        finalTotal: 35250.0,
        tax: 2820.0,
        purchasedAt: new Date('2024-01-18'),
        receiptUrl: 'gs://procureflow-demo.appspot.com/receipts/org_cdc/REQ-2024-005/receipt_001.pdf',
        receiptFileName: 'receipt_001.pdf',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      },
      {
        id: 'PUR-2024-002',
        reqId: 'REQ-2024-006',
        cardholderId: 'cardholder_user',
        merchant: 'Axis Communications',
        orderNumber: 'AX-2024-005678',
        finalTotal: 12360.0,
        tax: 988.8,
        purchasedAt: new Date('2024-01-05'),
        receiptUrl: 'gs://procureflow-demo.appspot.com/receipts/org_sac/REQ-2024-006/receipt_002.pdf',
        receiptFileName: 'receipt_002.pdf',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      {
        id: 'PUR-2024-003',
        reqId: 'REQ-2024-007',
        cardholderId: 'cardholder_user',
        merchant: 'Amazon Business',
        orderNumber: 'AMZ-2024-009876',
        finalTotal: 2625.0,
        tax: 210.0,
        purchasedAt: new Date('2023-12-28'),
        receiptUrl: 'gs://procureflow-demo.appspot.com/receipts/org_cdc/REQ-2024-007/receipt_003.pdf',
        receiptFileName: 'receipt_003.pdf',
        createdAt: new Date('2023-12-28'),
        updatedAt: new Date('2023-12-28'),
      }
    ];

    for (const purchase of purchases) {
      await db.collection('purchases').doc(purchase.id).set(purchase);
      console.log(`✅ Created purchase: ${purchase.orderNumber}`);
    }

    // Create sample purchase orders
    console.log('Creating sample purchase orders...');
    const purchaseOrders = [
      {
        id: 'PO-2024-001',
        reqId: 'REQ-2024-003',
        poNumber: 'PO-2024001',
        vendor: {
          name: 'Herman Miller',
          address: '789 Design Ave',
          city: 'Zeeland',
          state: 'MI',
          zip: '49464',
          phone: '1-800-HERMAN',
          email: 'orders@hermanmiller.com',
          taxId: '98-7654321',
        },
        cardholder: {
          id: 'cardholder_user',
          name: 'Robert Davis',
          email: 'cardholder@procureflow.demo',
          cardNumber: '****1234',
          cardType: 'Government Purchase Card',
        },
        delivery: {
          address: '456 Military Base Road',
          city: 'Base City',
          state: 'CA',
          zip: '98765',
          contactName: 'Jane Doe',
          contactPhone: '555-0456',
          specialInstructions: 'Deliver to loading dock, use freight elevator',
        },
        terms: {
          paymentTerms: 'Net 30',
          shippingTerms: 'FOB Destination',
          deliveryDate: new Date('2024-03-01'),
          warranty: '1 Year Manufacturer Warranty',
        },
        items: [
          {
            id: 'item_1',
            sku: 'HM-001',
            desc: 'Aeron Chair',
            qty: 10,
            estUnitPrice: 1200.0,
            lineTotal: 12000.0,
          },
          {
            id: 'item_2',
            sku: 'HM-002',
            desc: 'Standing Desk',
            qty: 10,
            estUnitPrice: 1200.0,
            lineTotal: 12000.0,
          }
        ],
        subtotal: 24000.0,
        tax: 1920.0,
        shipping: 1000.0,
        total: 26920.0,
        status: 'draft',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      }
    ];

    for (const po of purchaseOrders) {
      await db.collection('purchaseOrders').doc(po.id).set(po);
      console.log(`✅ Created purchase order: ${po.poNumber}`);
    }

    // Create global settings for admin testing
    console.log('Creating global settings...');
    await db.collection('settings').doc('global').set({
      microPurchaseLimit: 10000.0,
      splitPurchaseWindowDays: 30,
      blockedMerchants: ['Blocked Vendor Inc', 'Suspicious Company LLC'],
      defaultTaxRate: 0.08,
      defaultShippingRate: 0.05,
      approvalWorkflow: {
        requireApproval: true,
        autoApproveUnder: 1000.0,
        requireMultipleApprovers: 5000.0,
      },
      notificationSettings: {
        emailNotifications: true,
        smsNotifications: false,
        notificationFrequency: 'immediate',
      },
      auditSettings: {
        autoAuditThreshold: 5000.0,
        auditRetentionDays: 2555, // 7 years
        requireAuditFor: ['high_value', 'sensitive_vendor'],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Created global settings');

    // Create sample audit events for admin testing
    console.log('Creating sample audit events...');
    const auditEvents = [
      {
        id: 'audit-001',
        entity: 'request',
        entityId: 'REQ-2024-001',
        actorUid: 'admin_user',
        action: 'created',
        timestamp: new Date('2024-01-10T09:00:00Z'),
        details: {
          title: 'Office Supplies Request',
          requesterId: 'requester_user',
          totalEstimate: 2500.0,
        },
      },
      {
        id: 'audit-002',
        entity: 'request',
        entityId: 'REQ-2024-001',
        actorUid: 'approver_user',
        action: 'status_changed_to_AO Review',
        timestamp: new Date('2024-01-11T10:30:00Z'),
        details: {
          from: 'Draft',
          to: 'AO Review',
          comment: 'Request submitted for review',
        },
      },
      {
        id: 'audit-003',
        entity: 'approval',
        entityId: 'approval-001',
        actorUid: 'approver_user',
        action: 'created',
        timestamp: new Date('2024-01-12T14:15:00Z'),
        details: {
          reqId: 'REQ-2024-001',
          action: 'Approved',
          comment: 'Approved for office equipment upgrade',
        },
      },
      {
        id: 'audit-004',
        entity: 'purchase',
        entityId: 'PUR-2024-001',
        actorUid: 'cardholder_user',
        action: 'created',
        timestamp: new Date('2024-01-18T16:45:00Z'),
        details: {
          reqId: 'REQ-2024-005',
          orderNumber: 'TF-2024-001234',
          finalTotal: 35250.0,
        },
      },
      {
        id: 'audit-005',
        entity: 'user',
        entityId: 'test_user',
        actorUid: 'admin_user',
        action: 'role_updated',
        timestamp: new Date('2024-01-20T11:20:00Z'),
        details: {
          from: 'requester',
          to: 'approver',
          approvalLimit: 10000.0,
        },
      },
      {
        id: 'audit-006',
        entity: 'settings',
        entityId: 'global',
        actorUid: 'admin_user',
        action: 'updated',
        timestamp: new Date('2024-01-21T15:30:00Z'),
        details: {
          changes: ['microPurchaseLimit', 'blockedMerchants'],
          microPurchaseLimit: { from: 5000.0, to: 10000.0 },
        },
      }
    ];

    for (const event of auditEvents) {
      await db.collection('audit').doc(event.id).set(event);
      console.log(`✅ Created audit event: ${event.action}`);
    }

    // Create sample notifications for admin testing
    console.log('Creating sample notifications...');
    const notifications = [
      {
        id: 'notif-001',
        userId: 'admin_user',
        type: 'system_alert',
        title: 'High Value Purchase Detected',
        message: 'Request REQ-2024-005 exceeds micro-purchase limit ($35,000 > $10,000)',
        read: false,
        priority: 'high',
        data: {
          requestId: 'REQ-2024-005',
          amount: 35000.0,
          limit: 10000.0,
        },
        createdAt: new Date('2024-01-18T16:50:00Z'),
      },
      {
        id: 'notif-002',
        userId: 'admin_user',
        type: 'compliance_alert',
        title: 'Split Purchase Warning',
        message: 'Multiple purchases from same vendor detected within 30-day window',
        read: false,
        priority: 'medium',
        data: {
          vendor: 'Amazon Business',
          requestIds: ['REQ-2024-007', 'REQ-2024-009'],
          totalAmount: 20500.0,
        },
        createdAt: new Date('2024-01-19T09:15:00Z'),
      },
      {
        id: 'notif-003',
        userId: 'admin_user',
        type: 'user_action',
        title: 'New User Registration',
        message: 'New user test@procureflow.demo has registered and needs role assignment',
        read: true,
        priority: 'normal',
        data: {
          userId: 'test_user',
          email: 'test@procureflow.demo',
          registrationDate: '2024-01-20T08:30:00Z',
        },
        createdAt: new Date('2024-01-20T08:35:00Z'),
      },
      {
        id: 'notif-004',
        userId: 'admin_user',
        type: 'system_maintenance',
        title: 'Monthly Cycle Close Scheduled',
        message: 'Monthly cycle close will run automatically at 11:55 PM tonight',
        read: false,
        priority: 'normal',
        data: {
          scheduledTime: '2024-01-31T23:55:00Z',
          affectedCycles: ['cycle_2024_01'],
        },
        createdAt: new Date('2024-01-31T10:00:00Z'),
      },
      {
        id: 'notif-005',
        userId: 'admin_user',
        type: 'audit_complete',
        title: 'Audit Package Ready',
        message: 'Audit package for REQ-2024-001 has been completed and is ready for review',
        read: false,
        priority: 'normal',
        data: {
          packageId: 'audit-pkg-001',
          requestId: 'REQ-2024-001',
          auditScore: 95,
          issues: 0,
        },
        createdAt: new Date('2024-01-22T14:20:00Z'),
      }
    ];

    for (const notification of notifications) {
      await db.collection('notifications').doc(notification.id).set(notification);
      console.log(`✅ Created notification: ${notification.title}`);
    }

    // Create sample message threads with messages for admin testing
    console.log('Creating sample messages...');
    const adminMessages = [
      {
        id: 'msg-001',
        threadId: 'thread-001',
        senderId: 'requester_user',
        recipientId: 'approver_user',
        participants: ['requester_user', 'approver_user'],
        content: 'Hi, I submitted the office supplies request. Could you please review it when you have a chance?',
        read: true,
        createdAt: new Date('2024-01-15T09:00:00Z'),
      },
      {
        id: 'msg-002',
        threadId: 'thread-001',
        senderId: 'approver_user',
        recipientId: 'requester_user',
        participants: ['requester_user', 'approver_user'],
        content: 'I\'ve reviewed your request and approved it. It\'s been sent to the cardholder for purchasing.',
        read: true,
        createdAt: new Date('2024-01-15T10:30:00Z'),
      },
      {
        id: 'msg-003',
        threadId: 'thread-002',
        senderId: 'auditor_user',
        recipientId: 'cardholder_user',
        participants: ['auditor_user', 'cardholder_user'],
        content: 'Please review the compliance issues found in your recent purchase. There are some missing documentation requirements.',
        read: false,
        createdAt: new Date('2024-01-15T09:15:00Z'),
      },
      {
        id: 'msg-004',
        threadId: 'thread-003',
        senderId: 'admin_user',
        recipientId: 'auditor_user',
        participants: ['requester_user', 'auditor_user', 'admin_user'],
        content: 'The quarterly compliance review is scheduled for next week. Please prepare your audit reports.',
        read: true,
        createdAt: new Date('2024-01-14T16:45:00Z'),
      },
      {
        id: 'msg-005',
        threadId: 'thread-004',
        senderId: 'cardholder_user',
        recipientId: 'approver_user',
        participants: ['approver_user', 'cardholder_user'],
        content: 'The purchase order has been created successfully. I\'ll proceed with the purchase.',
        read: true,
        createdAt: new Date('2024-01-14T14:20:00Z'),
      }
    ];

    for (const message of adminMessages) {
      await db.collection('messages').doc(message.id).set(message);
      console.log(`✅ Created message in thread: ${message.threadId}`);
    }

    // Create sample message read status
    console.log('Creating message read status...');
    const adminReadStatuses = [
      {
        id: 'read-001',
        userId: 'requester_user',
        messageId: 'msg-001',
        readAt: new Date('2024-01-15T09:05:00Z'),
      },
      {
        id: 'read-002',
        userId: 'approver_user',
        messageId: 'msg-001',
        readAt: new Date('2024-01-15T09:02:00Z'),
      },
      {
        id: 'read-003',
        userId: 'approver_user',
        messageId: 'msg-002',
        readAt: new Date('2024-01-15T10:35:00Z'),
      },
      {
        id: 'read-004',
        userId: 'requester_user',
        messageId: 'msg-002',
        readAt: new Date('2024-01-15T10:32:00Z'),
      },
      {
        id: 'read-005',
        userId: 'admin_user',
        messageId: 'msg-004',
        readAt: new Date('2024-01-14T16:50:00Z'),
      }
    ];

    for (const status of adminReadStatuses) {
      await db.collection('messageReadStatus').doc(status.id).set(status);
      console.log(`✅ Created read status for message: ${status.messageId}`);
    }

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
    const additionalMessages = [
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

    for (const message of additionalMessages) {
      await db.collection('messages').doc(message.id).set(message);
      console.log(`✅ Created message: ${message.id}`);
    }

    // Create message read status
    console.log('Creating message read status...');
    const additionalReadStatuses = [
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

    for (const status of additionalReadStatuses) {
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
