// components/DashboardSidebar.tsx
'use client';

import Link from 'next/link';
import { FaHome, FaShoppingCart, FaListAlt, FaMoneyCheckAlt } from 'react-icons/fa';

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function DashboardSidebar({ sidebarOpen, toggleSidebar }: DashboardSidebarProps) {
  return (
    <>
      <div 
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-800 to-purple-800 p-6 
          transition-transform duration-300 z-40 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
        `}
      >
        <nav className="mt-8 space-y-4">
          <Link href="/Dashboard">
            <div onClick={() => window.innerWidth < 768 && toggleSidebar()} className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
              <FaHome size={20} />
              <span>Home</span>
            </div>
          </Link>
          <Link href="/Dashboard/orders">
            <div onClick={() => window.innerWidth < 768 && toggleSidebar()} className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
              <FaShoppingCart size={20} />
              <span>Orders</span>
            </div>
          </Link>
          <Link href="/Dashboard/transaction">
            <div onClick={() => window.innerWidth < 768 && toggleSidebar()} className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
              <FaListAlt size={20} />
              <span>Transactions</span>
            </div>
          </Link>
          <Link href="/Dashboard/payment">
            <div onClick={() => window.innerWidth < 768 && toggleSidebar()} className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
              <FaMoneyCheckAlt size={20} />
              <span>Payment Tracking</span>
            </div>
          </Link>
        </nav>
      </div>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleSidebar} />
      )}
    </>
  );
}
