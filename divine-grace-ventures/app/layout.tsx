// app/layout.tsx
'use client';

import '../styles/globals.css';
import type { ReactNode } from 'react';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Divine Grace Ventures</title>
        <meta name="description" content="Modern site for orders & payments" />
        {/* Link to favicon */}
        <link rel="icon" href="/images/icon.png" />
      </head>
      <body className="flex flex-col min-h-screen bg-gradient-to-r from-gray-500 to-blue-900">
        <AuthProvider>
          <main className="flex-grow">{children}</main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
