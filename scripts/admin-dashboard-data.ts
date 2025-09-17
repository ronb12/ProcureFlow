import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

async function createAdminDashboardData() {
  console.log('📊 Creating comprehensive admin dashboard data...');

  try {
    // Create additional organizations for multi-tenant testing
    console.log('Creating additional organizations...');
    const additionalOrgs = [
      {
        id: 'org_navy',
        name: 'United States Navy',
        code: 'NAVY',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'org_army',
        name: 'United States Army',
        code: 'ARMY',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'org_marines',
        name: 'United States Marine Corps',
        code: 'MARINES',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    for (const org of additionalOrgs) {
      await db.collection('orgs').doc(org.id).set(org);
      console.log(`✅ Created organization: ${org.name}`);
    }

    // Create additional users across different organizations
    console.log('Creating additional users...');
    const additionalUsers = [
      {
        id: 'navy_admin',
        name: 'Captain James Kirk',
        email: 'james.kirk@navy.mil',
        role: 'admin',
        orgId: 'org_navy',
        approvalLimit: 100000,
        phone: '555-1001',
        department: 'Command',
        title: 'Commanding Officer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'army_requester',
        name: 'Sergeant John Doe',
        email: 'john.doe@army.mil',
        role: 'requester',
        orgId: 'org_army',
        approvalLimit: 0,
        phone: '555-1002',
        department: 'Logistics',
        title: 'Logistics Specialist',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'marines_approver',
        name: 'Major Jane Smith',
        email: 'jane.smith@marines.mil',
        role: 'approver',
        orgId: 'org_marines',
        approvalLimit: 25000,
        phone: '555-1003',
        department: 'Finance',
        title: 'Finance Officer',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    for (const user of additionalUsers) {
      await db.collection('users').doc(user.id).set(user);
      console.log(`✅ Created user: ${user.name}`);
    }

    // Create comprehensive request data across all statuses and organizations
    console.log('Creating comprehensive request data...');
    const comprehensiveRequests = [
      // High-value requests for admin testing
      {
        id: 'REQ-2024-HV-001',
        requesterId: 'navy_admin',
        orgId: 'org_navy',
        title: 'Aircraft Maintenance Equipment',
        description: 'Specialized tools and equipment for aircraft maintenance',
        vendor: 'Boeing Defense',
        vendorAddress: '100 Boeing Way, Seattle, WA 98124',
        vendorCity: 'Seattle',
        vendorState: 'WA',
        vendorZip: '98124',
        vendorPhone: '1-206-655-2121',
        vendorEmail: 'defense@boeing.com',
        vendorTaxId: '91-1234567',
        deliveryAddress: 'Naval Air Station',
        deliveryCity: 'Pensacola',
        deliveryState: 'FL',
        deliveryZip: '32508',
        deliveryContact: 'Maintenance Chief',
        deliveryPhone: '555-2001',
        deliveryInstructions: 'Deliver to Hangar 3, requires security clearance',
        accountingCode: 'AIRCRAFT-001',
        needBy: new Date('2024-03-15'),
        totalEstimate: 125000.0,
        status: 'AO Review',
        priority: 'high',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-26'),
        submittedAt: new Date('2024-01-26'),
        reviewedAt: new Date('2024-01-26'),
      },
      {
        id: 'REQ-2024-HV-002',
        requesterId: 'army_requester',
        orgId: 'org_army',
        title: 'Military Vehicle Parts',
        description: 'Replacement parts for military vehicles',
        vendor: 'General Dynamics',
        vendorAddress: '2941 Fairview Park Drive, Falls Church, VA 22042',
        vendorCity: 'Falls Church',
        vendorState: 'VA',
        vendorZip: '22042',
        vendorPhone: '1-703-876-3000',
        vendorEmail: 'sales@gd.com',
        vendorTaxId: '54-1234567',
        deliveryAddress: 'Army Base',
        deliveryCity: 'Fort Hood',
        deliveryState: 'TX',
        deliveryZip: '76544',
        deliveryContact: 'Supply Officer',
        deliveryPhone: '555-2002',
        deliveryInstructions: 'Deliver to motor pool, use main gate',
        accountingCode: 'VEHICLE-002',
        needBy: new Date('2024-02-28'),
        totalEstimate: 75000.0,
        status: 'Approved',
        priority: 'medium',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-24'),
        submittedAt: new Date('2024-01-21'),
        reviewedAt: new Date('2024-01-23'),
        approvedAt: new Date('2024-01-24'),
      },
      // Compliance testing requests
      {
        id: 'REQ-2024-COMP-001',
        requesterId: 'test_user',
        orgId: 'org_cdc',
        title: 'Suspicious Vendor Test',
        description: 'Test request from blocked vendor',
        vendor: 'Blocked Vendor Inc',
        vendorAddress: '123 Suspicious St',
        vendorCity: 'Suspicious City',
        vendorState: 'SC',
        vendorZip: '12345',
        vendorPhone: '555-9999',
        vendorEmail: 'suspicious@blocked.com',
        vendorTaxId: '99-9999999',
        deliveryAddress: '456 Military Base Road',
        deliveryCity: 'Base City',
        deliveryState: 'CA',
        deliveryZip: '98765',
        deliveryContact: 'Test User',
        deliveryPhone: '555-0001',
        deliveryInstructions: 'Test delivery',
        accountingCode: 'TEST-001',
        needBy: new Date('2024-02-01'),
        totalEstimate: 5000.0,
        status: 'Denied',
        priority: 'low',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-23'),
        submittedAt: new Date('2024-01-22'),
        reviewedAt: new Date('2024-01-23'),
        deniedAt: new Date('2024-01-23'),
        denialReason: 'Vendor is on blocked list',
      },
      // Split purchase testing
      {
        id: 'REQ-2024-SPLIT-001',
        requesterId: 'requester_user',
        orgId: 'org_cdc',
        title: 'Split Purchase Test 1',
        description: 'First part of split purchase',
        vendor: 'Test Split Vendor',
        vendorAddress: '456 Split Ave',
        vendorCity: 'Split City',
        vendorState: 'SP',
        vendorZip: '54321',
        vendorPhone: '555-8888',
        vendorEmail: 'split@test.com',
        vendorTaxId: '88-8888888',
        deliveryAddress: '456 Military Base Road',
        deliveryCity: 'Base City',
        deliveryState: 'CA',
        deliveryZip: '98765',
        deliveryContact: 'Test User',
        deliveryPhone: '555-0003',
        deliveryInstructions: 'Test delivery',
        accountingCode: 'SPLIT-001',
        needBy: new Date('2024-02-05'),
        totalEstimate: 6000.0,
        status: 'Purchased',
        priority: 'medium',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        submittedAt: new Date('2024-01-16'),
        reviewedAt: new Date('2024-01-18'),
        approvedAt: new Date('2024-01-18'),
        assignedToCardholderAt: new Date('2024-01-19'),
        purchasedAt: new Date('2024-01-20'),
      },
      {
        id: 'REQ-2024-SPLIT-002',
        requesterId: 'requester_user',
        orgId: 'org_cdc',
        title: 'Split Purchase Test 2',
        description: 'Second part of split purchase',
        vendor: 'Test Split Vendor',
        vendorAddress: '456 Split Ave',
        vendorCity: 'Split City',
        vendorState: 'SP',
        vendorZip: '54321',
        vendorPhone: '555-8888',
        vendorEmail: 'split@test.com',
        vendorTaxId: '88-8888888',
        deliveryAddress: '456 Military Base Road',
        deliveryCity: 'Base City',
        deliveryState: 'CA',
        deliveryZip: '98765',
        deliveryContact: 'Test User',
        deliveryPhone: '555-0003',
        deliveryInstructions: 'Test delivery',
        accountingCode: 'SPLIT-002',
        needBy: new Date('2024-02-10'),
        totalEstimate: 7000.0,
        status: 'AO Review',
        priority: 'medium',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-26'),
        submittedAt: new Date('2024-01-26'),
        reviewedAt: new Date('2024-01-26'),
      }
    ];

    for (const request of comprehensiveRequests) {
      await db.collection('requests').doc(request.id).set(request);
      console.log(`✅ Created request: ${request.title}`);
    }

    // Create comprehensive audit data
    console.log('Creating comprehensive audit data...');
    const auditEvents = [
      {
        id: 'audit-admin-001',
        entity: 'user',
        entityId: 'navy_admin',
        actorUid: 'admin_user',
        action: 'created',
        timestamp: new Date('2024-01-25T10:00:00Z'),
        details: {
          name: 'Captain James Kirk',
          email: 'james.kirk@navy.mil',
          role: 'admin',
          orgId: 'org_navy',
        },
      },
      {
        id: 'audit-admin-002',
        entity: 'request',
        entityId: 'REQ-2024-HV-001',
        actorUid: 'navy_admin',
        action: 'created',
        timestamp: new Date('2024-01-25T11:00:00Z'),
        details: {
          title: 'Aircraft Maintenance Equipment',
          totalEstimate: 125000.0,
          priority: 'high',
        },
      },
      {
        id: 'audit-admin-003',
        entity: 'settings',
        entityId: 'global',
        actorUid: 'admin_user',
        action: 'updated',
        timestamp: new Date('2024-01-26T14:30:00Z'),
        details: {
          changes: ['blockedMerchants'],
          addedVendors: ['Blocked Vendor Inc', 'Suspicious Company LLC'],
        },
      },
      {
        id: 'audit-admin-004',
        entity: 'request',
        entityId: 'REQ-2024-COMP-001',
        actorUid: 'approver_user',
        action: 'denied',
        timestamp: new Date('2024-01-23T16:45:00Z'),
        details: {
          reason: 'Vendor is on blocked list',
          vendor: 'Blocked Vendor Inc',
        },
      }
    ];

    for (const event of auditEvents) {
      await db.collection('audit').doc(event.id).set(event);
      console.log(`✅ Created audit event: ${event.action}`);
    }

    // Create system metrics for admin dashboard
    console.log('Creating system metrics...');
    const systemMetrics = {
      id: 'metrics_2024_01',
      period: '2024-01',
      totalRequests: 15,
      totalValue: 285000.0,
      averageProcessingTime: 2.5, // days
      approvalRate: 0.87,
      complianceScore: 0.92,
      activeUsers: 8,
      organizations: 4,
      topVendors: [
        { name: 'Dell Technologies', count: 3, value: 45000.0 },
        { name: 'Herman Miller', count: 2, value: 50000.0 },
        { name: 'Microsoft Corporation', count: 2, value: 10000.0 },
        { name: 'Thermo Fisher Scientific', count: 1, value: 35000.0 },
        { name: 'Boeing Defense', count: 1, value: 125000.0 }
      ],
      statusBreakdown: {
        'Draft': 2,
        'Submitted': 1,
        'AO Review': 3,
        'Approved': 2,
        'Cardholder Purchasing': 1,
        'Purchased': 3,
        'Reconciled': 1,
        'Closed': 1,
        'Denied': 1,
        'Returned': 0
      },
      monthlyTrends: [
        { month: '2023-10', requests: 12, value: 180000.0 },
        { month: '2023-11', requests: 15, value: 220000.0 },
        { month: '2023-12', requests: 18, value: 250000.0 },
        { month: '2024-01', requests: 15, value: 285000.0 }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('systemMetrics').doc(systemMetrics.id).set(systemMetrics);
    console.log('✅ Created system metrics');

    // Create admin-specific notifications
    console.log('Creating admin notifications...');
    const adminNotifications = [
      {
        id: 'admin-notif-001',
        userId: 'admin_user',
        type: 'system_alert',
        title: 'High Value Request Alert',
        message: 'Request REQ-2024-HV-001 exceeds $100,000 threshold',
        read: false,
        priority: 'high',
        data: {
          requestId: 'REQ-2024-HV-001',
          amount: 125000.0,
          threshold: 100000.0,
        },
        createdAt: new Date('2024-01-25T11:05:00Z'),
      },
      {
        id: 'admin-notif-002',
        userId: 'admin_user',
        type: 'compliance_alert',
        title: 'Split Purchase Detected',
        message: 'Potential split purchases detected from Test Split Vendor',
        read: false,
        priority: 'medium',
        data: {
          vendor: 'Test Split Vendor',
          requestIds: ['REQ-2024-SPLIT-001', 'REQ-2024-SPLIT-002'],
          totalAmount: 13000.0,
          window: '30 days',
        },
        createdAt: new Date('2024-01-26T09:30:00Z'),
      },
      {
        id: 'admin-notif-003',
        userId: 'admin_user',
        type: 'user_management',
        title: 'New Organization Created',
        message: 'New organization "United States Navy" has been added to the system',
        read: true,
        priority: 'normal',
        data: {
          orgId: 'org_navy',
          orgName: 'United States Navy',
          createdBy: 'admin_user',
        },
        createdAt: new Date('2024-01-25T10:15:00Z'),
      }
    ];

    for (const notification of adminNotifications) {
      await db.collection('notifications').doc(notification.id).set(notification);
      console.log(`✅ Created admin notification: ${notification.title}`);
    }

    console.log('🎉 Admin dashboard data creation completed successfully!');
    console.log('\n📊 Admin Dashboard Data Summary:');
    console.log('- 4 Organizations (CDC, SAC, Navy, Army, Marines)');
    console.log('- 8 Users across different roles and organizations');
    console.log('- 15+ Requests in various statuses');
    console.log('- 6+ Audit events for compliance tracking');
    console.log('- System metrics for analytics');
    console.log('- Admin-specific notifications');
    console.log('- Split purchase test data');
    console.log('- High-value request test data');
    console.log('- Compliance testing data');

  } catch (error) {
    console.error('❌ Error creating admin dashboard data:', error);
    process.exit(1);
  }
}

// Run the function
createAdminDashboardData()
  .then(() => {
    console.log('✅ Admin dashboard data creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Admin dashboard data creation failed:', error);
    process.exit(1);
  });
