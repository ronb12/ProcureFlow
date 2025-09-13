const admin = require('firebase-admin');

// Initialize Firebase Admin with default credentials
admin.initializeApp({
  projectId: 'procureflow-demo',
});

const db = admin.firestore();

async function createUserDocument() {
  const userId = 'IVT9JIxFphZ3p7Abi37FfJpXBVt2';
  const userEmail = 'ronellbradley@gmail.com';

  try {
    console.log('Creating user document with Admin SDK...');

    // Create user document
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
    console.log('User document created successfully!');
    console.log('Data:', JSON.stringify(userData, null, 2));

    // Verify the document was created
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      console.log('Verification successful - document exists in Firestore');
      console.log('Document data:', JSON.stringify(userDoc.data(), null, 2));
    } else {
      console.log('ERROR: Document was not created');
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

createUserDocument();

