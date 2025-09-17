import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork,
  terminate,
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

// Firestore instance with proper connection management
let firestoreInstance: Firestore | null = null;
let isFirestoreInitialized = false;

export function getFirestoreInstance(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(app);
    isFirestoreInitialized = true;
  }
  return firestoreInstance;
}

export const db: Firestore = getFirestoreInstance();
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
  } catch {
    // Already connected or not in emulator mode
  }
  try {
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch {
    // Already connected or not in emulator mode
  }
  try {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch {
    // Already connected or not in emulator mode
  }
}

// Enhanced connection management with proper error handling
let connectionState = {
  isConnected: false,
  isConnecting: false,
  connectionPromise: null as Promise<void> | null,
  retryCount: 0,
  maxRetries: 3,
};

export async function ensureFirestoreConnection(): Promise<void> {
  if (connectionState.isConnected) {
    return;
  }

  if (connectionState.isConnecting && connectionState.connectionPromise) {
    await connectionState.connectionPromise;
    return;
  }

  connectionState.isConnecting = true;
  connectionState.connectionPromise = performConnection();

  try {
    await connectionState.connectionPromise;
  } finally {
    connectionState.isConnecting = false;
    connectionState.connectionPromise = null;
  }
}

async function performConnection(): Promise<void> {
  const db = getFirestoreInstance();
  
  try {
    // First, try to disable network to reset any corrupted state
    try {
      await disableNetwork(db);
    } catch (disableError) {
      // Ignore disable errors - network might already be disabled
      console.log('Network disable skipped:', disableError);
    }

    // Wait a moment before re-enabling
    await new Promise(resolve => setTimeout(resolve, 100));

    // Enable network with timeout
    await Promise.race([
      enableNetwork(db),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      )
    ]);

    console.log('Firestore connection established');
    connectionState.isConnected = true;
    connectionState.retryCount = 0;
  } catch (error) {
    console.error(`Failed to establish Firestore connection (attempt ${connectionState.retryCount + 1}/${connectionState.maxRetries}):`, error);
    
    connectionState.retryCount++;
    
    if (connectionState.retryCount < connectionState.maxRetries) {
      // Wait before retrying with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, connectionState.retryCount - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Reset connection state and retry
      connectionState.isConnected = false;
      return performConnection();
    } else {
      connectionState.isConnected = false;
      throw new Error(`Failed to establish Firestore connection after ${connectionState.maxRetries} attempts`);
    }
  }
}

export async function getFirestoreConnection(): Promise<Firestore> {
  await ensureFirestoreConnection();
  return getFirestoreInstance();
}

// Enhanced cleanup function
export async function cleanupFirebaseConnections(): Promise<void> {
  try {
    if (firestoreInstance && isFirestoreInitialized) {
      await disableNetwork(firestoreInstance);
      await terminate(firestoreInstance);
    }
  } catch (error) {
    console.error('Error during Firestore cleanup:', error);
  } finally {
    firestoreInstance = null;
    isFirestoreInitialized = false;
    connectionState = {
      isConnected: false,
      isConnecting: false,
      connectionPromise: null,
      retryCount: 0,
      maxRetries: 3,
    };
  }
}

// Reset connection state (useful for error recovery)
export function resetFirestoreConnection(): void {
  connectionState.isConnected = false;
  connectionState.isConnecting = false;
  connectionState.connectionPromise = null;
  connectionState.retryCount = 0;
}

export default app;
