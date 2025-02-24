'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaPaperPlane, FaImage, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface ChatWidgetProps {
  closeChat?: () => void;
}

export default function ChatWidget({ closeChat }: ChatWidgetProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const adminId = 1;

  useEffect(() => {
    if (!user) return;

    async function fetchMessages() {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(
          `and(user_id.eq.${user.id},admin_id.eq.${adminId})`,
          `and(user_id.eq.${adminId},admin_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data || []);

        // Mark unread messages from admin as read
        const unreadAdminMessages = data.filter(
          (msg) => msg.user_id === adminId && !msg.is_read
        );

        if (unreadAdminMessages.length > 0) {
          await markMessagesAsRead(unreadAdminMessages.map((msg) => msg.id));
        }
      }
    }

    fetchMessages();

    const channel = supabase
      .channel(`chat_widget:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `(user_id.eq.${user.id} and admin_id.eq.${adminId}) or (user_id.eq.${adminId} and admin_id.eq.${user.id})`
        },
        async (payload) => {
          setMessages((prev) => [...prev, payload.new]);

          // If a new message from the admin is received, mark it as read
          if (payload.new.user_id === adminId && !payload.new.is_read) {
            await markMessagesAsRead([payload.new.id]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markMessagesAsRead = async (messageIds: number[]) => {
    if (!messageIds || messageIds.length === 0) return;

    const { error } = await supabase
      .from('chats')
      .update({ is_read: true })
      .in('id', messageIds);

    if (error) {
      console.error('Error marking messages as read:', error.message);
    } else {
      // Update local state to reflect read status
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
        )
      );
    }
  };

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
      user_id: user.id,
      admin_id: adminId,
      sender_role: 'user',
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
    <div className="fixed bottom-4 right-4 w-80 h-96 flex flex-col bg-white dark:bg-gray-700 shadow-lg rounded-lg border border-gray-300">
      <div className="p-4 border-b flex justify-between items-center bg-blue-500 text-white rounded-lg">
        <span>Customer Support Chat</span>
        {closeChat && (
          <button onClick={closeChat}>
            <FaTimes />
          </button>
        )}
      </div>
      <div className="bg-blue-300 text-center text-blue-800 text-sm">
        <p>Admins will reply as soon as possible</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-r from-indigo-400 to-purple-200 rounded-b-lg">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="flex flex-col max-w-xs">
                <div
                  className={`px-4 py-2 rounded-lg ${
                    msg.sender_role === 'user'
                      ? 'bg-pink-900 text-gray-100 font-bold self-end'
                      : 'bg-blue-900 text-gray-100 font-bold self-start'
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
                <div className="text-xs text-gray-500 text-center mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No messages yet, start a conversation.</p>
        )}
      </div>
      <div className="p-4 border-t flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 text-black border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
}
