// app/dashboard/layout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import ChatWidget from '@/components/ChatWidget';
import { FaComments } from 'react-icons/fa';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // On desktop (≥768px) open sidebar by default
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleChat = () => {
    setChatOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <DashboardHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden md:block h-84 w-46">
          <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        {/* Main Content */}
        <main className="flex-1 p-6">
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
        <div className="fixed bottom-16 right-6 z-50 bg-white rounded-lg shadow-lg w-80 p-4">
          <ChatWidget closeChat={toggleChat} />
        </div>
      )}
    </div>
  );
}
