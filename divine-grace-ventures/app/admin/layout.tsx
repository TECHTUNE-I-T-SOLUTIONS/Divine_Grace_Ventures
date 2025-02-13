// app/admin/layout.tsx
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // When on /admin/login, show only the login content (without sidebar)
  if (pathname === '/admin/login') {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-6">
          <h3 className="text-2xl font-bold">Admin Panel</h3>
        </div>
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
            <li className="mb-2">
              <Link href="/admin/notifications" className="hover:underline">Notifications</Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/payments" className="hover:underline">Payments</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
