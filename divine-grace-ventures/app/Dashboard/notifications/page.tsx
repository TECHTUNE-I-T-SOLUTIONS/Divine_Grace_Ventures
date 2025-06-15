'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';
import NotificationCard from '@/components/NotificationCard';

interface Notification {
  id: number;
  message: string;
  user_id?: string;
  email?: string;
  type?: string;
  order_id?: number;
  amount?: number;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  async function fetchNotifications() {
    try {
      // Optional: fetch session if you want to check authentication
      const sessionRes = await fetch('/api/session');
      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData.user?.id) {
        throw new Error('User not authenticated');
      }

      // Fetch notifications directly from the updated API route
      const res = await fetch('/api/notifications');
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
      setNotifications(data.notifications);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  fetchNotifications();
}, []);

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}
