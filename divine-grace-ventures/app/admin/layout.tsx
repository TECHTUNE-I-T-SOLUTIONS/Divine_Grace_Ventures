'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaSignOutAlt, FaUser, FaBars, FaCommentDots } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import useSound from 'use-sound';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [prevCount, setPrevCount] = useState<number>(0);
  const [playNotification] = useSound('/sounds/notification.mp3', { volume: 0.5 });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [unreadChats, setUnreadChats] = useState<number>(0);

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/inventory', label: 'Inventory' },
    { href: '/admin/notifications', label: 'Notifications' },
    { href: '/admin/payments', label: 'Payments' },
  ];

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (res.ok && data.notifications) {
          const newCount = data.notifications.length;
          if (newCount > prevCount) {
            playNotification();
          }
          setNotificationCount(newCount);
          setPrevCount(newCount);
        }
      } catch (err: any) {
        console.error("Error fetching admin notifications:", err.message);
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [prevCount, playNotification]);

  useEffect(() => {
    async function fetchUnreadChats() {
      try {
        const res = await fetch('/api/admin/unread-chats');
        const data = await res.json();
        if (res.ok && data.unreadCount) {
          setUnreadChats(data.unreadCount);
        }
      } catch (err: any) {
        console.error("Error fetching unread chats:", err.message);
      }
    }
    fetchUnreadChats();
    const chatInterval = setInterval(fetchUnreadChats, 30000);
    return () => clearInterval(chatInterval);
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Header */}
      <header className="flex items-center justify-between bg-gray-900 p-4 shadow">
        <div className="flex items-center space-x-3">
          <button className="text-white lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars size={28} />
          </button>
          <img src="/images/logo.png" alt="Logo" className="h-10 w-10 rounded-lg" />
          <span className="text-2xl text-white font-bold">Admin Panel</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Chat Icon */}
          <Link href="/admin/chat" title="Admin-Customer Service Chat" passHref>
            <button className="relative text-white">
              <FaCommentDots size={28} />
              {unreadChats > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadChats}
                </span>
              )}
            </button>
          </Link>
          {/* Profile Icon */}
          <Link href="/admin/profile" title="Admin Profile">
            <FaUser size={28} className="cursor-pointer text-white" />
          </Link>
          {/* Logout Button */}
          <button onClick={handleLogout} className="flex items-center space-x-2 text-white hover:text-red-400">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className={`bg-gray-800 text-white p-4 ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-64'} transition-all duration-300 overflow-hidden`}>
          <nav>
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <button className={`w-full text-left px-4 py-2 rounded-full ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {link.label}
                        {link.label === 'Notifications' && notificationCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                            {notificationCount}
                          </span>
                        )}
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
