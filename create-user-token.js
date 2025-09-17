const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
const { getAuth, signInWithCustomToken } = require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyB2LeC0_Zewi_DWdGqD7HjlqrsYypo7TnE',
  authDomain: 'procureflow-demo.firebaseapp.com',
  projectId: 'procureflow-demo',
  storageBucket: 'procureflow-demo.firebasestorage.app',
  messagingSenderId: '140102454715',
  appId: '1:140102454715:web:13d55b4d495db8a7fd089e',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function createUserDocument() {
  const userId = 'IVT9JIxFphZ3p7Abi37FfJpXBVt2';
  const userEmail = 'ronellbradley@gmail.com';

  try {
    console.log('Creating user document...');

    // Create user document directly (this should work with the current rules)
    const userData = {
      name: 'Ronell Bradley',
      email: userEmail,
      role: 'admin',
      orgId: 'default-org',
      approvalLimit: 10000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userData);

    console.log('User document created successfully!');
    console.log('Data:', JSON.stringify(userData, null, 2));

    // Verify the document was created
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
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


