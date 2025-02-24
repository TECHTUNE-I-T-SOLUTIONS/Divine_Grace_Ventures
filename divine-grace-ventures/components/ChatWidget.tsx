'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaPaperPlane, FaImage, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function ChatWidget() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch and subscribe to messages for this user (only between the user and admin)
  useEffect(() => {
    if (!user) return;

    async function fetchMessages() {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        // Fetch messages where either (user -> admin) or (admin -> user)
        .or(`(sender_id.eq.${user.id} and receiver_id.eq.ADMIN_SUPPORT),(sender_id.eq.ADMIN_SUPPORT and receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      if (error) {
        console.error("Error fetching messages:", error.message);
      } else {
        setMessages(data || []);
      }
    }

    fetchMessages();

    // Subscribe to realtime inserts for this conversation
    const channel = supabase
      .channel(`chat_widget:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          // Listen for new messages in this conversation (both directions)
          filter: `(sender_id.eq.${user.id} and receiver_id.eq.ADMIN_SUPPORT) or (sender_id.eq.ADMIN_SUPPORT and receiver_id.eq.${user.id})`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendMessage = async () => {
    if (!user) return;
    if (!newMessage.trim() && !file) return;
    let imageUrl: string | null = null;
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);
      if (error) {
        console.error('File upload error:', error.message);
      } else {
        imageUrl = data.path;
      }
    }
    const payload = {
      sender_id: user.id,
      receiver_id: 'ADMIN_SUPPORT', // User messages go to admin support
      message: newMessage || (imageUrl ? 'Image sent' : ''),
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('chats').insert([payload]);
    if (error) console.error('Error sending message:', error.message);
    else {
      setNewMessage('');
      setFile(null);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-500 p-3 rounded-full text-white shadow-lg"
        >
          Chat
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-700 shadow-lg rounded-lg flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-blue-500 text-white">
            <span>Support Chat</span>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-r from-indigo-400 to-purple-200 rounded-lg">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 ${msg.sender_id === user.id ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block max-w-md px-4 py-2 rounded-lg ${
                      msg.sender_id === user.id
                        ? 'bg-blue-200 text-blue-900'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.image_url ? (
                      <img
                        src={supabase.storage.from('chat-images').getPublicUrl(msg.image_url).publicURL}
                        alt="sent image"
                        className="max-h-40 rounded"
                      />
                    ) : (
                      msg.message
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-4">
                No messages yet, start a conversation.
              </p>
            )}
          </div>
          <div className="p-4 border-t flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="chat-file" className="cursor-pointer text-blue-500">
              <FaImage />
            </label>
            <input
              id="chat-file"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            <button onClick={sendMessage} className="text-blue-500">
              <FaPaperPlane size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
