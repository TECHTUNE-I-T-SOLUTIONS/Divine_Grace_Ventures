// app/admin/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/admin" className="hover:underline">Dashboard</Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/orders" className="hover:underline">Orders</Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/inventory" className="hover:underline">Inventory</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}
