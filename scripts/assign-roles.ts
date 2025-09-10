import { initializeApp, cert } from 'firebase-admin/app';
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

const auth = getAuth();

interface RoleAssignment {
  uid: string;
  role: string;
  orgId: string;
  approvalLimit?: number;
}

async function assignRoles() {
  console.log('🔐 Starting role assignment...');

  const roleAssignments: RoleAssignment[] = [
    {
      uid: 'admin_user',
      role: 'admin',
      orgId: 'org_cdc',
      approvalLimit: 100000,
    },
    {
      uid: 'requester_user',
      role: 'requester',
      orgId: 'org_cdc',
      approvalLimit: 0,
    },
    {
      uid: 'approver_user',
      role: 'approver',
      orgId: 'org_cdc',
      approvalLimit: 10000,
    },
    {
      uid: 'cardholder_user',
      role: 'cardholder',
      orgId: 'org_cdc',
      approvalLimit: 0,
    },
    {
      uid: 'auditor_user',
      role: 'auditor',
      orgId: 'org_cdc',
      approvalLimit: 0,
    },
  ];

  try {
    for (const assignment of roleAssignments) {
      try {
        // Set custom claims
        await auth.setCustomUserClaims(assignment.uid, {
          role: assignment.role,
          orgId: assignment.orgId,
          approvalLimit: assignment.approvalLimit || 0,
        });

        console.log(`✅ Assigned role ${assignment.role} to user ${assignment.uid}`);
      } catch (error: any) {
        console.error(`❌ Error assigning role to ${assignment.uid}:`, error.message);
      }
    }

    console.log('🎉 Role assignment completed!');
    console.log('\n📋 Custom Claims Set:');
    roleAssignments.forEach(assignment => {
      console.log(`${assignment.uid}: ${assignment.role} (${assignment.orgId}) - Limit: $${assignment.approvalLimit}`);
    });

  } catch (error) {
    console.error('❌ Error assigning roles:', error);
    process.exit(1);
  }
}

// Run the role assignment function
assignRoles();
