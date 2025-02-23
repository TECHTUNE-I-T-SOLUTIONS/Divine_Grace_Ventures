'use client';

import { useState, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import CustomLoader from '@/components/CustomLoader';
import { useAuth } from '@/context/AuthContext';

interface AdminChatPanelProps {
  selectedUser: string; // This is the user's UUID
  supabase: any;
}

export default function AdminChatPanel({ selectedUser, supabase }: AdminChatPanelProps) {
  const { user } = useAuth(); // Admin's auth info (admin.id is an integer)
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Debug: log admin info
  useEffect(() => {
    console.log("Admin User Object:", user);
    console.log("Admin User ID (Integer):", user?.id);
  }, [user]);

  // Fetch conversation messages (both directions)
  useEffect(() => {
    async function fetchMessages() {
      if (!user?.id) {
        console.error("Error: Admin user ID is missing.");
        return;
      }
      setLoading(true);

      // Combine conditions: either (admin -> selected user) OR (selected user -> admin)
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`(sender_id.eq.${user.id} and receiver_id.eq.${selectedUser}),(sender_id.eq.${selectedUser} and receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        console.log("Fetched Messages:", data);
        setMessages(data || []);
      }
      setLoading(false);
    }

    fetchMessages();

    // Set up realtime subscriptions for both directions
    const channel = supabase.channel(`chat:${selectedUser}`);

    // When a message is sent from the selected user to the admin:
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chats',
        filter: `sender_id.eq.${selectedUser} and receiver_id.eq.${user?.id}`
      },
      (payload) => {
        console.log("New Incoming Message:", payload.new);
        setMessages((prev) => [...prev, payload.new]);
      }
    );

    // When a message is sent from the admin to the selected user:
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chats',
        filter: `sender_id.eq.${user?.id} and receiver_id.eq.${selectedUser}`
      },
      (payload) => {
        console.log("New Outgoing Message:", payload.new);
        setMessages((prev) => [...prev, payload.new]);
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, supabase, user]);

  // Send a new message from admin to the selected user
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!user?.id) {
      console.error("Error: Admin user ID is missing. Cannot send message.");
      return;
    }

    const payload = {
      sender_id: user.id, // Admin's integer id
      receiver_id: selectedUser, // User's UUID
      message: newMessage,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    console.log("Sending Message Payload:", payload);

    const { error } = await supabase.from('chats').insert([payload]);

    if (error) {
      console.error('Error sending message:', error.message);
    } else {
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-r from-gray-700 to-purple-600 rounded-lg shadow p-4">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-r from-indigo-400 to-purple-200 rounded-lg">
        {loading ? (
          <CustomLoader />
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 ${msg.sender_id === user?.id ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-md px-4 py-2 rounded-lg ${
                  msg.sender_id === user?.id
                    ? 'bg-blue-200 text-blue-900'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No messages yet, start a conversation.
          </p>
        )}
      </div>
      <div className="p-4 border-t border-gray-300">
        <div className="flex items-center space-x-2">
          <input
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
