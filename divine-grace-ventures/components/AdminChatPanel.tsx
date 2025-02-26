'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import CustomLoader from '@/components/CustomLoader';
import { useAuth } from '@/context/AuthContext';

interface AdminChatPanelProps {
  selectedUser: string; // User's UUID
  supabase: any;
  onClose: () => void;
}

export default function AdminChatPanel({ selectedUser, supabase, onClose }: AdminChatPanelProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const adminId = user?.id;

  useEffect(() => {
    if (!adminId) {
      console.error("Error: Admin user ID is missing.");
      return;
    }

    async function fetchMessages() {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('admin_id', adminId)
        .eq('user_id', selectedUser)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    }

    async function updateReadReceipts() {
      await supabase
        .from('chats')
        .update({ is_read: true })
        .eq('admin_id', adminId)
        .eq('user_id', selectedUser)
        .eq('is_read', false);
    }

    fetchMessages();
    updateReadReceipts();

    const channel = supabase
      .channel(`chat:${adminId}:${selectedUser}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `admin_id.eq.${adminId} and user_id.eq.${selectedUser}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    const intervalId = setInterval(() => {
      fetchMessages();
      updateReadReceipts();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, [selectedUser, supabase, adminId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Enter') {
        sendMessage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!adminId) {
      console.error("Error: Admin user ID is missing.");
      return;
    }

    const payload = {
      admin_id: adminId,
      user_id: selectedUser,
      sender_role: 'admin',
      message: newMessage,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('chats').insert([payload]);
    if (error) {
      console.error('Error sending message:', error.message);
    } else {
      setNewMessage('');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-r from-gray-700 to-purple-600 rounded-lg shadow p-4">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-r from-indigo-400 to-purple-200 rounded-lg"
      >
        {loading ? (
          <CustomLoader />
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className={`p-2 ${msg.sender_role === 'admin' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block max-w-md px-4 py-2 rounded-lg ${msg.sender_role === 'admin' ? 'bg-blue-900 text-gray-100 font-bold' : 'bg-pink-900 text-gray-100 font-bold'}`}
              >
                {msg.message} {msg.is_read && msg.sender_role === 'admin' && <span className="ml-1 text-green-400">✔️</span>}
              </div>
              <p className="text-xs text-gray-900 mt-1">{formatTimestamp(msg.created_at)}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No messages yet, start a conversation.</p>
        )}
      </div>
      <div className="p-4 border-t border-gray-300">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={sendMessage} className="text-blue-500 p-2 hover:text-blue-600">
            <FaPaperPlane size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
