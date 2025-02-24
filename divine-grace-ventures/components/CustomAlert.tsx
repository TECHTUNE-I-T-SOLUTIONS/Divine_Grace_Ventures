// components/CustomAlert.tsx
'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

type AlertProps = {
  type: 'error' | 'success' | 'info' | 'warning';
  message: string;
};

export default function CustomAlert({ type, message }: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  let icon;
  switch (type) {
    case 'success':
      icon = <FaCheckCircle className="mr-2" />;
      break;
    case 'error':
      icon = <FaTimesCircle className="mr-2" />;
      break;
    case 'warning':
      icon = <FaExclamationTriangle className="mr-2" />;
      break;
    default:
      icon = <FaInfoCircle className="mr-2" />;
  }

  // Determine background color based on alert type
  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : type === 'warning'
      ? 'bg-yellow-500'
      : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 px-4 py-3 ${bgColor} rounded-lg text-white shadow-lg animate-fade-in-out z-50`}>
      <div className="flex items-center">
        {icon}
        <span>{message}</span>
      </div>
    </div>
  );
}
