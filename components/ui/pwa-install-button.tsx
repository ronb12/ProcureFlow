'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    let fallbackTimer: NodeJS.Timeout;

    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setShowInstallButton(false);
        return true;
      }
      return false;
    };

    // Check on mount
    if (checkIfInstalled()) return;

    // Check if deferred prompt is already available from PWAProvider
    const checkDeferredPrompt = () => {
      const globalPrompt = (window as any).deferredPrompt;
      if (globalPrompt && !deferredPrompt) {
        setDeferredPrompt(globalPrompt as BeforeInstallPromptEvent);
        setShowInstallButton(true);
        console.log(
          'PWA install button should now be visible (from global prompt)'
        );
        // Clear the interval once we have the prompt
        if (checkInterval) {
          clearInterval(checkInterval);
        }
      }
    };

    // Check immediately
    checkDeferredPrompt();

    const handleAppInstalled = () => {
      console.log('PWA app installed');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Check periodically if app is installed or if deferred prompt becomes available
    // Only run if we don't already have a prompt
    if (!deferredPrompt) {
      checkInterval = setInterval(() => {
        if (checkIfInstalled()) {
          clearInterval(checkInterval);
          return;
        }
        checkDeferredPrompt();
      }, 2000); // Increased interval to reduce spam
    }

    // Fallback: Show install button after a delay if beforeinstallprompt doesn't fire
    fallbackTimer = setTimeout(() => {
      setShowInstallButton(prev => {
        if (!prev && !deferredPrompt && !isInstalled) {
          console.log('PWA install button fallback - showing button');
          return true;
        }
        return prev;
      });
    }, 10000); // Increased delay

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []); // Empty dependency array to prevent infinite loops

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    try {
      console.log('Prompting user to install PWA');
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User choice: ${outcome}`);

      // Clear the deferred prompt so it can only be used once
      setDeferredPrompt(null);
      setShowInstallButton(false);

      // If user accepted, the appinstalled event will fire
      if (outcome === 'accepted') {
        console.log('User accepted PWA installation');
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  console.log(
    `PWAInstallButton render: {showInstallButton: ${showInstallButton}, deferredPrompt: ${!!deferredPrompt}}`
  );

  if (!showInstallButton) {
    return null;
  }

  console.log('PWA install button rendering');

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 z-50 shadow-lg bg-white hover:bg-gray-50 border-blue-300 text-blue-700 hover:text-blue-800"
    >
      📱 Install App
    </Button>
  );
}
