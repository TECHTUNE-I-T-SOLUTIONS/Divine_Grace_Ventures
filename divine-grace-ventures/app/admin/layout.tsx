// app/(admin)/layout.tsx
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on /admin/login, do not render the full admin layout
  if (pathname === '/admin/login') {
    return <div className="min-h-screen">{children}</div>;
  }

  // Navigation links array
  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/inventory', label: 'Inventory' },
    { href: '/admin/notifications', label: 'Notifications' },
    { href: '/admin/payments', label: 'Payments' },
  ];

  const handleLogout = () => {
    // Add your logout logic here (clearing tokens, etc.)
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Header */}
      <header className="flex items-center justify-between bg-gray-900 p-4 shadow">
        <div className="flex items-center space-x-3">
          <img src="/images/logo.png" alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="text-2xl text-white font-bold">Admin Panel</span>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center space-x-2 text-white hover:text-red-400"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </header>
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-gray-800 text-white p-4">
          <nav>
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-full ${
                          isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                        }`}
                      >
                        {link.label}
                      </button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        {/* Main Content */}
        <div className="flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}
