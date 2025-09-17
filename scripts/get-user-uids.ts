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

async function getUserUIDs() {
  console.log('🔍 Fetching all users...');

  try {
    const listUsersResult = await auth.listUsers();

    console.log(`\n📋 Found ${listUsersResult.users.length} users:\n`);

    listUsersResult.users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Display Name: ${user.displayName || 'Not set'}`);
      console.log(`   Created: ${user.metadata.creationTime}`);
      console.log(
        `   Last Sign In: ${user.metadata.lastSignInTime || 'Never'}`
      );
      console.log('   ---');
    });

    console.log('\n💡 Copy the UIDs you need for role assignment!');
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    process.exit(1);
  }
}

// Run the function
getUserUIDs();


