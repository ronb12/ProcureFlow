'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/types';

export default function DebugPage() {
  const { user, loading, switchRole, debugRole } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [testMode, setTestMode] = useState(false);

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

  const roles: UserRole[] = ['requester', 'approver', 'cardholder', 'auditor', 'admin'];

  const handleSwitchRole = (role: UserRole) => {
    switchRole(role);
    addDebugInfo(`Role switched to: ${role}`);
  };

  const toggleTestMode = () => {
    setTestMode(!testMode);
    addDebugInfo(`Test mode ${!testMode ? 'enabled' : 'disabled'}`);
  };

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${info}`,
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">ProcureFlow Debug & Testing</h1>

      <div className="space-y-4">
        {/* Role Switching for Testing */}
        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">🧪 Testing Mode</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleTestMode}
                variant={testMode ? "default" : "outline"}
                size="sm"
              >
                {testMode ? "Disable" : "Enable"} Test Mode
              </Button>
              <span className="text-sm text-gray-600">
                {testMode ? "Test mode active" : "Test mode inactive"}
              </span>
            </div>
            
            {testMode && (
              <div className="space-y-2">
                <p className="text-sm text-blue-800">
                  <strong>Current Role:</strong> {debugRole || user?.role || 'None'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <Button
                      key={role}
                      onClick={() => handleSwitchRole(role)}
                      variant={debugRole === role ? "default" : "outline"}
                      size="sm"
                      className="capitalize"
                    >
                      {role}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-blue-700 mt-2">
                  💡 <strong>Testing Tip:</strong> Switch roles to test different user experiences without multiple logins!
                </div>
              </div>
            )}
          </div>
        </div>

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

        {/* Quick Testing Guide */}
        <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
          <h2 className="text-lg font-semibold mb-2 text-green-900">🚀 Quick Testing Guide</h2>
          <div className="space-y-2 text-sm text-green-800">
            <p><strong>Single Login Testing:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Login once with: <code className="bg-green-100 px-1 rounded">test@procureflow.demo</code> / <code className="bg-green-100 px-1 rounded">demo123</code></li>
              <li>Use the role switcher above to test different user experiences</li>
              <li>Navigate to different pages to see role-based features</li>
            </ul>
            
            <p className="mt-3"><strong>Test Each Role:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Requester:</strong> Create requests at <code>/requests/new</code></li>
              <li><strong>Approver:</strong> Review approvals at <code>/approvals</code></li>
              <li><strong>Cardholder:</strong> Process purchases at <code>/purchases</code></li>
              <li><strong>Auditor:</strong> Review audit packages at <code>/audit-packages</code></li>
              <li><strong>Admin:</strong> Manage system at <code>/admin</code></li>
            </ul>
          </div>
        </div>

        {/* Test User Creation */}
        {!user && (
          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
            <h2 className="text-lg font-semibold mb-2 text-yellow-900">⚠️ Test User Not Found</h2>
            <div className="space-y-2 text-sm text-yellow-800">
              <p><strong>To create the test user:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Open browser console (F12)</li>
                <li>Run this command:</li>
                <div className="bg-yellow-100 p-2 rounded mt-2">
                  <code>createUserWithEmailAndPassword(auth, &apos;test@procureflow.demo&apos;, &apos;demo123&apos;).then(user =&gt; console.log(&apos;User created:&apos;, user))</code>
                </div>
                <li>Or use the existing demo users:</li>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li><code>admin@procureflow.demo</code> / <code>demo123</code></li>
                  <li><code>requester@procureflow.demo</code> / <code>demo123</code></li>
                  <li><code>approver@procureflow.demo</code> / <code>demo123</code></li>
                  <li><code>cardholder@procureflow.demo</code> / <code>demo123</code></li>
                  <li><code>auditor@procureflow.demo</code> / <code>demo123</code></li>
                </ul>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
