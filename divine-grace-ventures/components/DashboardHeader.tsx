// components/DashboardHeader.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function DashboardHeader({ sidebarOpen, toggleSidebar }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic (clear tokens, etc.)
    router.push('/');
    console.log('Logging out...');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg">
      <div className="flex items-center">
        {/* Toggle button visible only on mobile */}
        <button onClick={toggleSidebar} className="mr-4 text-white md:hidden">
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <h1 className="text-2xl font-bold">Divine Grace Ventures</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/Dashboard/profile">
          <FaUserCircle size={28} className="cursor-pointer" />
        </Link>
        <button className="relative">
          <FaBell size={28} className="cursor-pointer" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
        </button>
        <Link href="/Dashboard/settings">
          <FaCog size={28} className="cursor-pointer" />
        </Link>
        <button onClick={handleLogout} className="cursor-pointer">
          <FaSignOutAlt size={28} />
        </button>
      </div>
    </header>
  );
}
