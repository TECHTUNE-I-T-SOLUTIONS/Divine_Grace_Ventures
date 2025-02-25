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
          fixed top-0 left-0 h-full w-64 bg-[linear-gradient(to_right,rgba(128,0,128,1)_0%,rgba(180,100,230,0)_100%)] opacity-90 p-6
          transition-transform duration-300 z-40 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
        `}
      >
        <nav className="mt-8">
          <Link href="/Dashboard">
            <div onClick={() => window.innerWidth < 768 && toggleSidebar()} className="flex items-center space-x-2 text-gray-200 cursor-pointer hover:text-blue-500 mb-4"
            title="Dashboard">
              <FaHome size={40} />
              <span>Home</span>
            </div>
          </Link>
          <Link href="/Dashboard/orders">
            <div onClick={() => window.innerWidth < 768 && toggleSidebar()} className="flex items-center space-x-2 cursor-pointer hover:text-blue-500 mb-4"
            title="Orders">
              <FaShoppingCart size={40} />
              <span>Orders</span>
            </div>
          </Link>
          <Link href="/Dashboard/transaction">
            <div onClick={() => window.innerWidth < 768 && toggleSidebar()} className="flex items-center space-x-2 cursor-pointer hover:text-blue-500 mb-4"
            title="Transactions">
              <FaListAlt size={40} />
              <span>Transactions</span>
            </div>
          </Link>
          <Link href="/Dashboard/payment">
            <div onClick={() => window.innerWidth < 768 && toggleSidebar()} className="flex items-center space-x-2 cursor-pointer hover:text-blue-500"
            title="Payments">
              <FaMoneyCheckAlt size={40} />
              <span>Payment Tracking</span>
            </div>
          </Link>
        </nav>
      </div>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-30 md:hidden" onClick={toggleSidebar} />
      )}
    </>
  );
}
