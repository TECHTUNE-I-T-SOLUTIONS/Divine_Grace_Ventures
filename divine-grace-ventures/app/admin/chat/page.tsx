'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import AdminChatPanel from '@/components/AdminChatPanel';
import { FaUsers } from 'react-icons/fa';

const AdminChatPage = () => {
  // Create the Supabase client on the client side (for chat data)
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Fetch all registered users from your API route
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const json = await res.json();
        if (json.error) {
          console.error('Error fetching users:', json.error);
        } else {
          setUsers(json.users || []);
        }
      } catch (err: any) {
        console.error('Error fetching users:', err.message);
      }
    }
    fetchUsers();

    // Poll for new users every minute
    const interval = setInterval(fetchUsers, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close chat panel on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedUser(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper: render a chat list item
  const renderChatItem = (user: any) => {
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

  // Retrieve details for the active chat, if available
  const activeChatUser = users.find((u) => u.id === selectedUser);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar: Chats */}
      <aside className="w-1/4 bg-gray-800 p-4 text-white">
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
        {/* Always list the active chats */}
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
        <header className="bg-gray-900 p-4 shadow text-white">
          <h1 className="text-2xl font-bold">Admin Chat</h1>
          {activeChatUser && (
            <p className="mt-2 text-lg">
              {activeChatUser.username || activeChatUser.email}
            </p>
          )}
        </header>
        <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-r from-gray-600 to-purple-500">
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
