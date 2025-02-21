// components/NotificationCard.tsx
'use client';

interface NotificationCardProps {
  notification: {
    id: number;
    message: string;
    user_id?: string;
    email?: string;
    type?: string;
    created_at: string;
  };
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  const createdAt = new Date(notification.created_at).toLocaleString();
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow mb-2">
      <p className="text-white">{notification.message}</p>
      {notification.email && (
        <p className="text-sm text-gray-400">Email: {notification.email}</p>
      )}
      <p className="text-xs text-gray-400">Received: {createdAt}</p>
    </div>
  );
}
