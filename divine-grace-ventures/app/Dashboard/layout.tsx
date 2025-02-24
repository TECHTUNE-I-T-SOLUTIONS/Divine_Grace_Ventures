// app/dashboard/layout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import ChatWidget from '@/components/ChatWidget';
import { FaComments } from 'react-icons/fa';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // On desktop (≥768px) open sidebar by default
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }

    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('contextmenu', handleRightClick);

    return () => {
      window.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleChat = () => {
    setChatOpen((prev) => !prev);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative">
      {/* Header */}
      <DashboardHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden md:block h-84 w-46">
          <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        {/* Main Content */}
        <main className="flex-1 p-6" onClick={closeContextMenu}>
          {children}
        </main>
      </div>
      
      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      )}
      
      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-blue-500 p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <FaComments size={24} className="text-white" />
        </button>
      </div>
      
      {/* Chat Panel */}
      {chatOpen && (
        <div className="fixed bottom-16 right-6 z-50 bg-transparent rounded-lg shadow-lg w-80 p-4">
          <ChatWidget closeChat={toggleChat} />
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-white text-black rounded shadow-lg p-2"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={closeContextMenu}
        >
          <ul className="space-y-2">
            <li>
              <Link href="/Dashboard/profile">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Profile</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard/settings">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Settings</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard/cart">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Cart</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Home</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard/orders">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Orders</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard/transaction">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Transactions</button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
