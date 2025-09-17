'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ensureFirestoreConnection } from '@/lib/firebase';

export function ConnectionStatus() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsConnecting(true);
      // Add a small delay to prevent blocking the UI
      setTimeout(() => {
        ensureFirestoreConnection()
          .then(() => {
            setIsConnected(true);
            setIsConnecting(false);
          })
          .catch(() => {
            setIsConnected(false);
            setIsConnecting(false);
          });
      }, 100);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsConnected(false);
    };

    // Check initial connection with delay to prevent blocking initial render
    if (navigator.onLine) {
      setTimeout(handleOnline, 200);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show connection status on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (!isOnline) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm z-30">
        Offline
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm z-30">
        Connecting...
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm z-30">
        Connection Error
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm z-30">
      Connected
    </div>
  );
}
