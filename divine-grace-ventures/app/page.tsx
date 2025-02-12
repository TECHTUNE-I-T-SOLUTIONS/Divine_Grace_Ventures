// app/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import ItemsList (client component) to disable SSR for it.
const ItemsList = dynamic(() => import('../components/ItemsList'), { ssr: false });

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Heading */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Divine Grace Ventures
        </h1>
        <p className="text-lg mb-8">
          Your modern solution for shopping groceries, making orders, and payments.
        </p>
      </div>

      {/* Items List: Displays local images with names and animations */}
      <div>
        <ItemsList />
      </div>
    </div>
  );
}
