const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

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

async function createUserDocument() {
  const userId = 'IVT9JIxFphZ3p7Abi37FfJpXBVt2';
  const userEmail = 'ronellbradley@gmail.com';

  try {
    console.log('Checking if user document exists...');

    // Check if document exists
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log('User document already exists:');
      console.log(JSON.stringify(userDoc.data(), null, 2));
      return;
    }

    console.log('User document does not exist. Creating...');

    // Create user document
    const userData = {
      name: 'Ronell Bradley',
      email: userEmail,
      role: 'admin',
      orgId: 'default-org',
      approvalLimit: 10000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(userRef, userData);
    console.log('User document created successfully!');
    console.log('Data:', JSON.stringify(userData, null, 2));

    // Verify the document was created
    const verifyDoc = await getDoc(userRef);
    if (verifyDoc.exists()) {
      console.log('Verification successful - document exists in Firestore');
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

