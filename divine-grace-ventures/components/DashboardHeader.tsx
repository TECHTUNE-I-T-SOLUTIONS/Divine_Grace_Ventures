// components/DashboardHeader.tsx
import Link from 'next/link';
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function DashboardHeader() {
  const handleLogout = () => {
    // Implement your logout logic here (e.g., clear tokens, redirect, etc.)
    console.log('Logging out...');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg">
      <div>
        <h1 className="text-2xl font-bold">Divine Grace Ventures</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/profile">
          <FaUserCircle size={28} className="cursor-pointer" />
        </Link>
        <button className="relative">
          <FaBell size={28} className="cursor-pointer" />
          {/* Notification badge */}
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
        </button>
        <Link href="/dashboard/settings">
          <FaCog size={28} className="cursor-pointer" />
        </Link>
        <button onClick={handleLogout} className="cursor-pointer">
          <FaSignOutAlt size={28} />
        </button>
      </div>
    </header>
  );
}
