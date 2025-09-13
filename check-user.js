const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

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

async function checkAndCreateUser() {
  const userId = 'IVT9JIxFphZ3p7Abi37FfJpXBVt2';
  const userEmail = 'ronellbradley@gmail.com';

  try {
    console.log('Checking user document...');
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log('User document exists:', userDoc.data());
    } else {
      console.log('User document does not exist, creating...');

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
      console.log('User document created successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAndCreateUser();

