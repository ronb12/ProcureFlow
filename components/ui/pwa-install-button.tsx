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

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA install prompt received, preventing default');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
      console.log('PWA install button should now be visible');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed, hiding button');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    // Fallback: Show install button after a delay if beforeinstallprompt doesn't fire
    // This helps with debugging and ensures the button appears
    const fallbackTimer = setTimeout(() => {
      if (!showInstallButton && !deferredPrompt) {
        console.log('Fallback: Showing PWA install button after timeout');
        setShowInstallButton(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      clearTimeout(fallbackTimer);
    };
  }, [showInstallButton, deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // Debug logging
  console.log('PWAInstallButton render:', { showInstallButton, deferredPrompt: !!deferredPrompt });

  if (!showInstallButton) {
    console.log('PWA install button not showing - showInstallButton is false');
    return null;
  }

  console.log('PWA install button rendering');
  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 z-50 shadow-lg"
    >
      📱 Install App
    </Button>
  );
}
