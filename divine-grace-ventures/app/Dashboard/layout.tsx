// app/dashboard/layout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // On desktop (≥768px) open sidebar by default
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
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
    </div>
  );
}
