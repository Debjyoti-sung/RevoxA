import React from 'react';
import AppLayout from '../components/AppLayout';
import './globals.css';

export const metadata = {
  title: 'REVOXA — Enterprise Memory Intelligence Platform',
  description: 'AI-driven long-term feedback memory, semantic clustering, and product recommendations powered by REVOXA.',
  applicationName: 'REVOXA',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'REVOXA — Enterprise Memory Intelligence Platform',
    description: 'AI-driven long-term feedback memory, semantic clustering, and product recommendations.',
    siteName: 'REVOXA',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'REVOXA Logo' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REVOXA — Enterprise Memory Intelligence Platform',
    description: 'AI-driven long-term feedback memory, semantic clustering, and product recommendations.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-primaryText font-sans min-h-screen">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
