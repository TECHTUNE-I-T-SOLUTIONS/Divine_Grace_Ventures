'use client';

import { useState, useEffect, useRef } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import AdminChatPanel from '@/components/AdminChatPanel';
import { FaUsers, FaBars } from 'react-icons/fa';

// Define types for the users
interface User {
  id: string;
  username: string | null;
  email: string;
  is_online: boolean;
}

const AdminChatPage = () => {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [users, setUsers] = useState<User[]>([]); // Use User[] instead of any[]
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const json = await res.json();
        setUsers(json.users || []); // Ensure the data matches the User[] type
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching users:', err.message); // Narrow down to error handling
        }
      }
    }
    fetchUsers();
    const interval = setInterval(fetchUsers, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderChatItem = (user: User) => {
    const isActive = selectedUser === user.id;
    return (
      <button
        key={user.id}
        className={`block w-full text-left p-2 my-1 rounded transition-colors ${
          isActive ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
        }`}
        onClick={() => {
          setSelectedUser(user.id);
          setShowDropdown(false);
        }}
      >
        <div className="flex items-center justify-between">
          <span>{user.username || user.email}</span>
          <span className={user.is_online ? 'text-green-400' : 'text-yellow-400'}>●</span>
        </div>
      </button>
    );
  };

  const activeChatUser = users.find((u) => u.id === selectedUser);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (Hidden on Small Screens Until Opened) */}
      <aside
        ref={sidebarRef}
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-18 left-0 h-full sm:h-auto w-[200px] sm:w-1/4 sm:w-[200px] bg-gray-800 p-4 text-white transition-transform duration-300 z-50 sm:z-20 sm:relative sm:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Chats</h2>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-white"
            title="List of Users"
          >
            <FaUsers size={30} />
          </button>
        </div>
        {showDropdown && (
          <div className="bg-gray-700 rounded shadow-lg z-10 max-h-80 overflow-y-auto mb-4">
            {users.length === 0 ? (
              <p className="p-2 text-sm">No users found.</p>
            ) : (
              users.map(renderChatItem)
            )}
          </div>
        )}
        <div className="space-y-1">
          {users.length === 0 ? (
            <p className="text-sm text-gray-400">No active chats.</p>
          ) : (
            users.map(renderChatItem)
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 p-2 shadow text-white flex mr-4 items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Hamburger Menu */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white sm:hidden">
              <FaBars size={30} />
            </button>
            <h1 className="text-xl font-bold">Admin Chat</h1>
          </div>
          {activeChatUser && <p className="mt-2 mr-4 text-sm">{activeChatUser.username || activeChatUser.email}</p>}
        </header>

        <div className="flex-1 p-2 overflow-y-auto bg-gradient-to-r from-gray-600 to-purple-500 mr-4">
          {selectedUser ? (
            <AdminChatPanel selectedUser={selectedUser} supabase={supabase} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-200">Select a chat to start conversation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;
