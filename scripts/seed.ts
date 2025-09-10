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
  });
} else {
  // Use default credentials (for emulator)
  initializeApp();
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
        uid: 'admin_user',
        email: 'admin@procureflow.demo',
        name: 'System Administrator',
        role: 'admin',
        orgId: 'org_cdc',
        approvalLimit: 100000,
      },
      {
        uid: 'requester_user',
        email: 'requester@procureflow.demo',
        name: 'John Requester',
        role: 'requester',
        orgId: 'org_cdc',
        approvalLimit: 0,
      },
      {
        uid: 'approver_user',
        email: 'approver@procureflow.demo',
        name: 'Jane Approver',
        role: 'approver',
        orgId: 'org_cdc',
        approvalLimit: 10000,
      },
      {
        uid: 'cardholder_user',
        email: 'cardholder@procureflow.demo',
        name: 'Bob Cardholder',
        role: 'cardholder',
        orgId: 'org_cdc',
        approvalLimit: 0,
      },
      {
        uid: 'auditor_user',
        email: 'auditor@procureflow.demo',
        name: 'Alice Auditor',
        role: 'auditor',
        orgId: 'org_cdc',
        approvalLimit: 0,
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
    await db.collection('settings').doc('global').set({
      microPurchaseLimit: 10000,
      blockedMerchants: ['Blocked Vendor Inc.'],
      splitPurchaseWindowDays: 1,
      taxRatesByState: {
        'CA': 0.0875,
        'NY': 0.08,
        'TX': 0.0625,
        'FL': 0.06,
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
      totalEstimate: 2500.00,
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
        estUnitPrice: 150.00,
        lineTotal: 300.00,
      },
      {
        id: 'item_2',
        sku: 'HD-002',
        desc: 'Standing Desk',
        qty: 1,
        estUnitPrice: 800.00,
        lineTotal: 800.00,
      },
      {
        id: 'item_3',
        sku: 'HD-003',
        desc: 'Office Supplies Kit',
        qty: 5,
        estUnitPrice: 280.00,
        lineTotal: 1400.00,
      },
    ];

    for (const item of items) {
      await db.collection('requests').doc(requestId).collection('items').doc(item.id).set(item);
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
    await db.collection('cycles').doc(cycleId).set({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Created sample cycle');

    console.log('🎉 Data seeding completed successfully!');
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
