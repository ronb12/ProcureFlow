'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ensureFirestoreConnection } from '@/lib/firebase';

export function ConnectionStatus() {
  const pathname = usePathname();
  
  // Don't show connection status on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsConnecting(true);
      ensureFirestoreConnection()
        .then(() => {
          setIsConnected(true);
          setIsConnecting(false);
        })
        .catch(() => {
          setIsConnected(false);
          setIsConnecting(false);
        });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsConnected(false);
    };

    // Check initial connection
    if (navigator.onLine) {
      handleOnline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm z-50">
        Offline
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm z-50">
        Connecting...
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm z-50">
        Connection Error
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm z-50">
      Connected
    </div>
  );
}
