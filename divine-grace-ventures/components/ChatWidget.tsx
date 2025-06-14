'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaPaperPlane, FaImage, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'; // Import Image from next/image

interface ChatWidgetProps {
  closeChat?: () => void;
}

interface Message {
  id: number;
  user_id: number;
  admin_id: number;
  sender_role: 'user' | 'admin';
  message: string;
  image_url: string | null;
  created_at: string;
  is_read: boolean;
}



export default function ChatWidget({ closeChat }: ChatWidgetProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const adminId = 1;

  const markUnreadAdminMessagesAsRead = useCallback(async (data: Message[]) => {
    const unreadMessages = data.filter(
      (msg) => msg.user_id === adminId && !msg.is_read
    );

    if (unreadMessages.length > 0) {
      await markMessagesAsRead(unreadMessages.map((msg) => msg.id));
    }
  }, []); // Memoize this function to prevent unnecessary re-creations

  useEffect(() => {
    if (!user) return;

    async function fetchMessages() {
      if (!user) return;
      const userId = user.id;

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(
          `and(user_id.eq.${userId},admin_id.eq.${adminId}),and(user_id.eq.${adminId},admin_id.eq.${userId})`
        )
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data || []);
        markUnreadAdminMessagesAsRead(data); // Call the memoized function
      }
    }


    fetchMessages();

    const channel = supabase
      .channel(`chat_widget:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chats' },
        async (payload) => {
          const newMsg = payload.new;
          setMessages((prev) => [...prev, newMsg as Message]);

          if (newMsg.user_id === adminId && !newMsg.is_read) {
            await markMessagesAsRead([newMsg.id]);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chats' },
        (payload) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === payload.new.id ? { ...msg, ...(payload.new as Message) } : msg
            )
          );
        }
      )
      .subscribe();

    const readReceiptInterval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(readReceiptInterval);
    };
  }, [user, markUnreadAdminMessagesAsRead]); // Added markUnreadAdminMessagesAsRead to the dependencies

  const markMessagesAsRead = async (messageIds: number[]) => {
    if (!messageIds.length) return;

    const { error } = await supabase
      .from('chats')
      .update({ is_read: true })
      .in('id', messageIds);

    if (error) {
      console.error('Error marking messages as read:', error.message);
    } else {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
        )
      );
    }
  };

  const sendMessage = async () => {
    if (!user || (!newMessage.trim() && !file)) return;

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
      is_read: false,
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
              className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
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
                    <Image
                      src={supabase.storage.from('chat-images').getPublicUrl(msg.image_url).data.publicUrl}
                      alt="sent image"
                      className="max-h-40 rounded"
                      width={160} // Image optimization requires width and height
                      height={160} // Image optimization requires width and height
                    />
                  ) : (
                    msg.message
                  )}
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}{" "}
                  {msg.is_read && msg.sender_role === 'user' ? (
                    <span className="text-green-500 ml-1">✓✓</span>
                  ) : null}
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
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        <button onClick={sendMessage} className="text-blue-500">
          <FaPaperPlane size={24} />
        </button>
      </div>
    </div>
  );
}
