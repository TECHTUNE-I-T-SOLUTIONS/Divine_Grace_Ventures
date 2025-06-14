// app/layout.tsx

import "./globals.css";
import type { ReactNode } from 'react';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { Metadata } from "next";
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  title: "Divine Grace Ventures",
  description: "Modern site for orders & payments",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gradient-to-r from-gray-600 to-blue-900">
        <AuthProvider>
        <main className="flex-grow bg-gradient-to-r from-gray-600 to-blue-900 text-white">
          {children}
        <CookieConsent />        
        </main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
