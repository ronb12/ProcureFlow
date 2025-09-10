import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { PWAProvider } from './pwa-provider';
import { PWAInstallButton } from '@/components/ui/pwa-install-button';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProcureFlow - MWR Purchase Card Management',
  description: 'From request to receipt—audited, automated, on time.',
  keywords: ['procurement', 'mwr', 'purchase card', 'workflow', 'approval'],
  authors: [{ name: 'Bradley Virtual Solutions, LLC' }],
  manifest: '/manifest.json?v=2',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ProcureFlow - MWR Purchase Card Management',
    description: 'From request to receipt—audited, automated, on time.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: false, // Don't index for security
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PWAProvider>
          <Providers>
            {children}
            <PWAInstallButton />
          </Providers>
        </PWAProvider>
      </body>
    </html>
  );
}
