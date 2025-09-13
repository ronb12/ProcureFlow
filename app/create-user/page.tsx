'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

export default function CreateUserPage() {
  const { user, loading } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [status, setStatus] = useState<string>('Checking...');
  const [userDoc, setUserDoc] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        setStatus('Firebase user found, checking Firestore document...');

        try {
          // Check if user document exists
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userRef);

          if (userDocSnap.exists()) {
            setStatus('User document exists in Firestore');
            setUserDoc(userDocSnap.data());
          } else {
            setStatus('User document does not exist, creating...');

            // Create user document
            const userData = {
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                'User',
              email: firebaseUser.email || '',
              role: 'admin',
              orgId: 'default-org',
              approvalLimit: 10000,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            };

            await setDoc(userRef, userData);
            setStatus('User document created successfully!');
            setUserDoc(userData);
          }
        } catch (error: any) {
          console.error('Error:', error);
          setStatus(`Error: ${error.message}`);
        }
      } else {
        setStatus('No Firebase user found');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Create User Document</h1>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <p className="text-gray-700">{status}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Firebase Auth</h2>
          <p>User: {firebaseUser ? 'Found' : 'Not found'}</p>
          {firebaseUser && (
            <div className="mt-2 text-sm">
              <p>UID: {firebaseUser.uid}</p>
              <p>Email: {firebaseUser.email}</p>
              <p>Display Name: {firebaseUser.displayName || 'None'}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">useAuth Hook</h2>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>User: {user ? 'Found' : 'Not found'}</p>
        </div>

        {userDoc && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">User Document</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(userDoc, null, 2)}
            </pre>
          </div>
        )}

        {user && (
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-green-800">
              Success!
            </h2>
            <p className="text-green-700">
              Your user document has been created. You can now access the
              profile page.
            </p>
            <a
              href="/profile"
              className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Profile
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
