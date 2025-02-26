'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';
import NotificationCard from '@/components/NotificationCard';

// Define the type for a notification
interface Notification {
  id: string;
  message: string;  // You can expand this based on the actual structure of your notifications
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]); // Use the defined Notification type
  const [loading, setLoading] = useState<boolean>(true); // Specify the type of loading
  const [error, setError] = useState<string>(''); // Set error type as string

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
        setNotifications(data.notifications);
      } catch (err: unknown) {
        // Narrow down the error to be of type Error before accessing message
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
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
      <h2 className="text-3xl font-bold mb-6">Admin Notifications</h2>
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
