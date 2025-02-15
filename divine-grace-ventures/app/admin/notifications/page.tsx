'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';


export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications');
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
  }, []);

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="bg-gray-800 p-4 rounded shadow">
            <p className="text-lg text-white">{notif.message}</p>
            <span className="text-sm text-gray-400">{new Date(notif.date).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
