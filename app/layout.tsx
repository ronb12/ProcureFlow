import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProcureFlow - MWR Purchase Card Management',
  description: 'From request to receipt—audited, automated, on time.',
  keywords: ['procurement', 'mwr', 'purchase card', 'workflow', 'approval'],
  authors: [{ name: 'Bradley Virtual Solutions, LLC' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
  manifest: '/manifest.json',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
