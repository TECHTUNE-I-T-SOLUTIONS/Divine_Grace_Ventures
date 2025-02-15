// app/page.tsx
'use client';

import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const ItemsList = dynamic(() => import('../components/ItemsList'), { ssr: false });

export default function HomePage() {
  return (
    <div className="container p-0 mx-auto px-2 py-2">
      <Header />  {/* Page-specific header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Welcome to Divine Grace Ventures
        </h1>
        <p className="text-lg mb-8 text-white">
          Your modern solution for shopping groceries, making orders, and payments.
        </p>
      </div>
      <div>
        <ItemsList />
      </div>
    </div>
  );
}
