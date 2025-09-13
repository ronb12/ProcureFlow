const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = {
  // You'll need to download the service account key from Firebase Console
  // For now, let's use the default credentials
};

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'procureflow-demo',
});

const db = admin.firestore();

async function createUser() {
  const userId = 'IVT9JIxFphZ3p7Abi37FfJpXBVt2';
  const userEmail = 'ronellbradley@gmail.com';

  try {
    console.log('Creating user document...');

    const userData = {
      name: 'Ronell Bradley',
      email: userEmail,
      role: 'admin',
      orgId: 'default-org',
      approvalLimit: 10000,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await db.collection('users').doc(userId).set(userData);
    console.log('User document created successfully');

    // Verify the document was created
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      console.log('User document verified:', userDoc.data());
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

createUser();

