const admin = require('firebase-admin');

// Initialize Firebase Admin with project ID
admin.initializeApp({
  projectId: 'procureflow-demo'
});

const db = admin.firestore();

async function fixDocuments() {
  console.log('🔧 Fixing Firebase documents for procureflow-demo...');
  
  try {
    // Get all users from the users collection
    const usersSnapshot = await db.collection('users').get();
    
    console.log(`📋 Found ${usersSnapshot.size} user documents`);
    
    const updates = [];
    
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`\n👤 User: ${data.email || 'No email'} (${doc.id})`);
      console.log(`   Current role: ${data.role}`);
      
      // Determine correct role based on email
      let correctRole = data.role; // Keep current role by default
      let correctOrgId = data.orgId || 'org_cdc';
      let correctApprovalLimit = data.approvalLimit || 0;
      
      if (data.email === 'admin@procureflow.demo') {
        correctRole = 'admin';
        correctApprovalLimit = 100000;
      } else if (data.email === 'approver@procureflow.demo') {
        correctRole = 'approver';
        correctApprovalLimit = 10000;
      } else if (data.email === 'cardholder@procureflow.demo') {
        correctRole = 'cardholder';
        correctApprovalLimit = 0;
      } else if (data.email === 'auditor@procureflow.demo') {
        correctRole = 'auditor';
        correctApprovalLimit = 0;
      } else if (data.email === 'requester@procureflow.demo') {
        correctRole = 'requester';
        correctApprovalLimit = 0;
      } else if (data.email === 'test@procureflow.demo') {
        correctRole = 'requester';
        correctApprovalLimit = 5000;
      }
      
      if (correctRole !== data.role) {
        console.log(`   ✅ Will update to: ${correctRole}`);
        updates.push({
          id: doc.id,
          email: data.email,
          currentRole: data.role,
          newRole: correctRole,
          orgId: correctOrgId,
          approvalLimit: correctApprovalLimit
        });
      } else {
        console.log(`   ✅ Role is already correct`);
      }
    });
    
    console.log(`\n🔄 Updating ${updates.length} documents...`);
    
    // Update documents
    for (const update of updates) {
      try {
        await db.collection('users').doc(update.id).update({
          role: update.newRole,
          orgId: update.orgId,
          approvalLimit: update.approvalLimit,
          updatedAt: admin.firestore.Timestamp.now()
        });
        console.log(`   ✅ Updated ${update.email}: ${update.currentRole} → ${update.newRole}`);
      } catch (error) {
        console.error(`   ❌ Error updating ${update.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Document updates completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

fixDocuments().catch(console.error);
