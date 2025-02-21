// app/Dashboard/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import NotificationCard from '@/components/NotificationCard';

export default function UserNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNotifications() {
      try {
        if (!user) throw new Error("User not authenticated");
        // Optionally, filter notifications for the current user by passing a query parameter
        const res = await fetch(`/api/notifications?user_id=${user.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
        setNotifications(data.notifications);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [user]);

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!user) return <div>Please log in to view your notifications.</div>;

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">My Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))
      )}
    </div>
  );
}
