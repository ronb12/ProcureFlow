import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import {
  getStorage,
  FirebaseStorage,
  connectStorageEmulator,
} from 'firebase/storage';
import {
  getFunctions,
  Functions,
  connectFunctionsEmulator,
} from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyB2LeC0_Zewi_DWdGqD7HjlqrsYypo7TnE',
  authDomain: 'procureflow-demo.firebaseapp.com',
  projectId: 'procureflow-demo',
  storageBucket: 'procureflow-demo.firebasestorage.app',
  messagingSenderId: '140102454715',
  appId: '1:140102454715:web:13d55b4d495db8a7fd089e',
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app);

// Connect to emulators in development (only when explicitly enabled)
if (process.env.NODE_ENV === 'development' && 
    typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  // Only connect to emulators on client side when explicitly enabled
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
  // Skip emulator connection checks for static export
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // Already connected or not in emulator mode
  }
  try {
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    // Already connected or not in emulator mode
  }
  try {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (error) {
    // Already connected or not in emulator mode
  }
}

export default app;
