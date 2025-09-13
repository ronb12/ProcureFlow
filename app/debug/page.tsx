'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function DebugPage() {
  const { user, loading } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const addDebugInfo = (info: string) => {
      setDebugInfo(prev => [
        ...prev,
        `${new Date().toLocaleTimeString()}: ${info}`,
      ]);
    };

    addDebugInfo('Debug page loaded');
    addDebugInfo(
      `useAuth - Loading: ${loading}, User: ${user ? 'Found' : 'Not found'}`
    );

    if (user) {
      addDebugInfo(`User details: ${JSON.stringify(user, null, 2)}`);
    }

    // Check Firebase auth directly
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      addDebugInfo(
        `Firebase auth state changed: ${firebaseUser ? 'User found' : 'No user'}`
      );
      if (firebaseUser) {
        addDebugInfo(
          `Firebase user: ${JSON.stringify(
            {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            },
            null,
            2
          )}`
        );
      }
      setFirebaseUser(firebaseUser);
    });

    return unsubscribe;
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">useAuth Hook</h2>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>User: {user ? 'Found' : 'Not found'}</p>
          {user && (
            <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Firebase Auth Direct</h2>
          <p>User: {firebaseUser ? 'Found' : 'Not found'}</p>
          {firebaseUser && (
            <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
              {JSON.stringify(
                {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                },
                null,
                2
              )}
            </pre>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Debug Log</h2>
          <div className="max-h-64 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="text-sm text-gray-600 mb-1">
                {info}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
