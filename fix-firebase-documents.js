const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  // Use default credentials (for emulator or if running in Firebase environment)
  admin.initializeApp();
}

const db = admin.firestore();

async function fixFirebaseDocuments() {
  console.log('🔧 Fixing Firebase database documents...');
  
  try {
    // Define the correct user data for demo users
    const demoUsers = [
            {
              email: 'admin@procureflow.demo',
              role: 'admin',
              orgId: 'org_cdc',
              approvalLimit: 100000,
        name: 'Sarah Johnson',
        phone: '555-0002',
        department: 'Administration',
        title: 'System Administrator'
            },
            {
              email: 'approver@procureflow.demo',
              role: 'approver',
              orgId: 'org_cdc',
              approvalLimit: 10000,
        name: 'Jane Williams',
        phone: '555-0004',
        department: 'Finance',
        title: 'Finance Director'
            },
            {
              email: 'cardholder@procureflow.demo',
              role: 'cardholder',
              orgId: 'org_cdc',
              approvalLimit: 0,
        name: 'Robert Davis',
        phone: '555-0005',
        department: 'Procurement',
        title: 'Procurement Specialist'
            },
            {
              email: 'auditor@procureflow.demo',
              role: 'auditor',
              orgId: 'org_cdc',
              approvalLimit: 0,
        name: 'Alice Brown',
        phone: '555-0006',
        department: 'Compliance',
        title: 'Compliance Auditor'
            },
            {
              email: 'requester@procureflow.demo',
              role: 'requester',
              orgId: 'org_cdc',
              approvalLimit: 0,
        name: 'John Smith',
        phone: '555-0003',
        department: 'Operations',
        title: 'Operations Manager'
            },
            {
              email: 'test@procureflow.demo',
              role: 'requester',
              orgId: 'org_cdc',
              approvalLimit: 5000,
        name: 'Test User (All Roles)',
        phone: '555-0001',
        department: 'IT Department',
        title: 'Test User'
            }
          ];
          
    console.log('📋 Updating demo user documents...');
          
    for (const userData of demoUsers) {
            try {
        // Find the user document by email
              const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', userData.email).get();
        
        if (snapshot.empty) {
          console.log(`❌ No user found with email: ${userData.email}`);
          continue;
        }
        
        // Update each user document
        for (const doc of snapshot.docs) {
          const docData = doc.data();
          console.log(`📝 Updating user ${userData.email} (${doc.id}):`);
          console.log(`   Current role: ${docData.role}`);
          console.log(`   New role: ${userData.role}`);
          
          await doc.ref.update({
                  role: userData.role,
                  orgId: userData.orgId,
                  approvalLimit: userData.approvalLimit,
                  name: userData.name,
            phone: userData.phone,
            department: userData.department,
            title: userData.title,
            updatedAt: admin.firestore.Timestamp.now()
          });
          
          console.log(`   ✅ Updated successfully`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${userData.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Firebase documents update completed!');
    console.log('\n📋 Summary of changes:');
    demoUsers.forEach(user => {
      console.log(`   ${user.email} → ${user.role} (${user.orgId}) - Limit: $${user.approvalLimit}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing Firebase documents:', error);
  } finally {
    process.exit(0);
  }
}

fixFirebaseDocuments().catch(console.error);