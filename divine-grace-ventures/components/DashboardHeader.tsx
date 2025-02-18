// components/DashboardHeader.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function DashboardHeader({ sidebarOpen, toggleSidebar }: DashboardHeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    async function fetchCart() {
      if (user) {
        const res = await fetch(`/api/cart?user_id=${user.id}`);
        const data = await res.json();
        if (res.ok && data.cart) {
          const total = data.cart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
          setCartCount(total);
        }
      }
    }
    fetchCart();
  }, [user]);

  const handleLogout = () => {
    router.push('/');
    console.log('Logging out...');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-white md:hidden"
        title="Sidebar">
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <h1 className="text-2xl font-bold"
        title="Brand Name">Divine Grace Ventures</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/Dashboard/profile"
        title="Profile">
          <FaUserCircle size={28} className="cursor-pointer" />
        </Link>
        <button className="relative"
        title="Notifications">
          <FaBell size={28} className="cursor-pointer" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
        </button>
        <Link href="/Dashboard/settings">
          <FaCog size={28} className="cursor-pointer"
          title="Settings"
           />
        </Link>
        <Link href="/Dashboard/cart">
          <div className="relative cursor-pointer"
          title="Cart">
            <FaShoppingCart size={28} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-900 bg-transparent rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </Link>
        <button onClick={handleLogout} className="cursor-pointer"
        title="Log out">
          <FaSignOutAlt size={28} />
        </button>
      </div>
    </header>
  );
}
