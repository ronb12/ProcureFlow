const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: 'service_account',
  project_id: 'procureflow-demo',
  private_key_id: 'your-private-key-id',
  private_key: 'your-private-key',
  client_email:
    'firebase-adminsdk-xxxxx@procureflow-demo.iam.gserviceaccount.com',
  client_id: 'your-client-id',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40procureflow-demo.iam.gserviceaccount.com',
};

// For now, let's try using the default credentials
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'procureflow-demo',
  });
} catch (error) {
  console.log('Error initializing admin app:', error.message);
  console.log('Trying with explicit credentials...');

  // Try with explicit credentials
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'procureflow-demo',
  });
}

const db = admin.firestore();

async function createUserDocument() {
  try {
    const userId = 'IVT9JIxFphZ3p7Abi37FfJpXBVt2';
    const userEmail = 'ronellbradley@gmail.com';

    console.log('Creating user document for:', userId, userEmail);

    const userData = {
      name: 'Ronell Bradley',
      email: userEmail,
      role: 'admin',
      orgId: 'default-org',
      approvalLimit: 1000000,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await db.collection('users').doc(userId).set(userData);

    console.log('✅ User document created successfully!');
    console.log('User data:', userData);

    // Verify the document was created
    const doc = await db.collection('users').doc(userId).get();
    if (doc.exists) {
      console.log('✅ Document verified in Firestore');
      console.log('Document data:', doc.data());
    } else {
      console.log('❌ Document not found after creation');
    }
  } catch (error) {
    console.error('❌ Error creating user document:', error);
  } finally {
    process.exit(0);
  }
}

createUserDocument();


