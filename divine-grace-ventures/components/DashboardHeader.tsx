'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import useSound from 'use-sound';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function DashboardHeader({ sidebarOpen, toggleSidebar }: DashboardHeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState<number>(0);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [prevNotificationCount, setPrevNotificationCount] = useState<number>(0);
  const [playNotification] = useSound('/sounds/notification.mp3', { volume: 0.5 });

  // Fetch cart count
  useEffect(() => {
    async function fetchCart() {
      if (user) {
        const res = await fetch(`/api/cart?user_id=${user.id}`);
        const data = await res.json();
        if (res.ok && data.cart) {
          // Adjust the calculation according to your cart schema (here using quantity)
          const total = data.cart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
          setCartCount(total);
        }
      }
    }
    fetchCart();
  }, [user]);

  // Fetch notifications count (and play sound on new notifications)
  useEffect(() => {
    async function fetchNotifications() {
      if (user) {
        const res = await fetch(`/api/notifications?user_id=${user.id}`);
        const data = await res.json();
        if (res.ok && data.notifications) {
          const newCount = data.notifications.length;
          if (newCount > prevNotificationCount) {
            playNotification();
          }
          setNotificationCount(newCount);
          setPrevNotificationCount(newCount);
        }
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user, prevNotificationCount, playNotification]);

  const handleLogout = () => {
    router.push('/');
    console.log('Logging out...');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-white md:hidden" title="Sidebar">
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <img src="/images/logo.png" alt="Logo" className="h-10 w-10 m-2 rounded-sm" />        
        <h1 className="text-2xl font-bold" title="Brand Name">Divine Grace Ventures</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/Dashboard/profile" title="Profile">
          <FaUserCircle size={28} className="cursor-pointer" />
        </Link>
        <Link href="/Dashboard/notifications">
          <div className="relative cursor-pointer" title="Notifications">
            <FaBell size={28} />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {notificationCount}
              </span>
            )}
          </div>
        </Link>
        <Link href="/Dashboard/settings" title="Settings">
          <FaCog size={28} className="cursor-pointer" />
        </Link>
        <Link href="/Dashboard/cart" title="Cart">
          <div className="relative cursor-pointer">
            <FaShoppingCart size={28} />
            {cartCount > 0 && (

              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </Link>
        <button onClick={handleLogout} className="cursor-pointer" title="Log out">
          <FaSignOutAlt size={28} />
        </button>
      </div>
    </header>
  );
}
