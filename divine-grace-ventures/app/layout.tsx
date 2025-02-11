// app/layout.tsx
import '../styles/globals.css';
import type { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Divine Grace Ventures</title>
        <meta name="description" content="Modern shopping site for orders & payments" />
        <link rel="icon" href="/images/favicon.png" />        
      </head>
      {/* 
        The body uses:
          - min-h-screen: Ensure the body is at least the full height of the viewport.
          - flex flex-col: Arrange children vertically.
          - flex-grow on <main>: Allows the main content to take up remaining space,
            pushing the footer to the bottom.
          - bg-gradient-to-br from-gray-900 to-black: Applies a dark gradient background.
          - text-white: Sets the default text color to white.
      */}
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-gray-400 to-blue-900 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
