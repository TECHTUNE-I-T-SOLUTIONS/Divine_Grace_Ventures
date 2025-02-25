'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { useAuth } from '@/context/AuthContext';
import { FaBars, FaSignOutAlt, FaUser, FaBell, FaCommentDots, FaRegCommentAlt, FaTachometerAlt, FaBoxOpen, FaClipboardList, FaCreditCard, FaTimes } from 'react-icons/fa';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [prevCount, setPrevCount] = useState<number>(0);
  const [playNotification] = useSound('/sounds/notification.mp3', { volume: 0.5 });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [unreadChats, setUnreadChats] = useState<number>(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: <FaTachometerAlt size={20} /> },
    { href: '/admin/orders', label: 'Orders', icon: <FaBoxOpen size={20} /> },
    { href: '/admin/inventory', label: 'Inventory', icon: <FaClipboardList size={20} /> },
    { href: '/admin/notifications', label: 'Notifications', icon: <FaBell size={20} /> },
    { href: '/admin/payments', label: 'Payments', icon: <FaCreditCard size={20} /> },
  ];
  // Fetch notifications and unread chats
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default context menu
    setMenuPosition({ top: e.clientY, left: e.clientX });
    setShowMenu(true); // Show the custom menu
  };

  const handleClick = () => {
    setShowMenu(false); // Hide the menu when clicking elsewhere
  };

  // When logout button is clicked, show confirmation dialog
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // When confirmed, call the logout API and redirect
  const confirmLogout = async () => {
    try {
      await fetch('/api/auth/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user?.id })
      });
      setShowLogoutConfirm(false);
      router.push('/');
    } catch (error: any) {
      console.error("Logout error:", error.message);
      setShowLogoutConfirm(false);
    }
  };

  // Cancel logout confirmation
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const contextLinks = [
    { text: 'Dashboard', href: '/admin' },
    { text: 'Orders', href: '/admin/orders' },
    { text: 'Inventory', href: '/admin/inventory' },
    { text: 'Notifications', href: '/admin/notifications' },
    { text: 'Payments', href: '/admin/payments' },
    { text: 'Logout', action: handleLogoutClick },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col" onClick={handleClick} onContextMenu={handleContextMenu}>
        {/* Admin Header */}
        <header className="flex items-center justify-between bg-gray-900 p-4 shadow">
          <div className="flex items-center space-x-1">
            <button className="text-white lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars size={24} />
            </button>
            <img src="/images/logo.png" alt="Logo" className="h-8 w-8 rounded-lg" />
            <span className="text-sm text-white font-bold">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/admin/CreateAlert" title="Manage Alerts" passHref>
              <button className="relative text-white">
                <FaBell size={24} />
              </button>
            </Link>
            {/* Feedback Icon */}
            <Link href="/admin/feedback" title="Admin-Feedback" passHref>
              <button className="relative text-white">
                <FaRegCommentAlt size={24} />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
            </Link>
            {/* Chat Icon */}
            <Link href="/admin/chat" title="Admin-Customer Service Chat" passHref>
              <button className="relative text-white">
                <FaCommentDots size={24} />
                {unreadChats > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadChats}
                  </span>
                )}
              </button>
            </Link>
            {/* Profile Icon */}
            <Link href="/admin/profile" title="Admin Profile">
              <button className="relative text-white">
                <FaUser size={24} className="cursor-pointer text-white" />
              </button>
            </Link>
            {/* Logout Button with confirmation */}
            <button onClick={handleLogoutClick} className="flex items-center -mt-1 space-x-2 text-white hover:text-red-400" title="Logout">
              <FaSignOutAlt size={24} />
              <span>Logout</span>
            </button>
          </div>
        </header>
        <div className="flex flex-1">
          {/* Sidebar Navigation */}
      {/* Sidebar Navigation (Responsive) */}
          <aside className={`fixed pt-16 top-0 left-0 h-full bg-[linear-gradient(to_right,rgba(128,0,128,1)_0%,rgba(180,100,230,0)_100%)] opacity-90 text-white p-6 transition-all duration-300 transform z-50
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
            lg:translate-x-0 h-full lg:w-64 lg:relative h-full`}>
            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white lg:hidden">
              <FaTimes size={24} />
            </button> 
            <nav>
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link href={link.href}>
                        <button
                          className={`w-full flex items-center space-x-2 px-4 py-2 rounded-full ${
                            isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                          }`}
                        >
                          {link.icon}
                          <span>{link.label}</span>
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
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-30 md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          )}

          {/* Main Content */}
          <div className="flex-1 p-4">{children}</div>
          
          {/* Right-click Context Menu */}
          {showMenu && (
            <div className="absolute z-50 bg-white shadow-lg rounded-md" style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}>
              <ul className="space-y-2 p-3">
                {contextLinks.map((link, index) => (
                  <li key={index} className="cursor-pointer hover:text-blue-500">
                    {link.href ? (
                      <Link href={link.href}>{link.text}</Link>
                    ) : (
                      <button onClick={link.action}>{link.text}</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-purple-800 rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-xl text-center text-white font-bold mb-4">Confirm Logout</h2>
                <p className="mb-4 text-red-300 text-center font-bold">Are you sure you want to log out?</p>
                <div className="flex justify-end space-x-36">
                  <button 
                    onClick={cancelLogout}
                    className=" px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
