'use client';

import { useEffect } from 'react';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Handle install prompt - store for custom handling
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA install prompt received, storing for custom handling');
      // Prevent the default install prompt and store for custom handling
      e.preventDefault();
      // Store the event for PWAInstallButton to use
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle app installed
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      // Clear the deferred prompt
      (window as any).deferredPrompt = null;
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }

    // Handle online/offline status
    const handleOnline = () => {
      console.log('App is online');
      // Show online indicator
    };

    const handleOffline = () => {
      console.log('App is offline');
      // Show offline indicator
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <>{children}</>;
}
