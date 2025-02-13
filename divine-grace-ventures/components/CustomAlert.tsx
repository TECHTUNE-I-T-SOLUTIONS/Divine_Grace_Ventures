// components/CustomAlert.tsx
'use client';

import { useEffect, useState } from 'react';
import { Alert as NextAlert } from '@nextui-org/react';
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

  return (
    <div className="fixed top-4 right-4 z-50">
      <NextAlert
        color={type}
        variant="shadow"
        css={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          background: type === 'success' ? '#28a745' :
                      type === 'error' ? '#dc3545' :
                      type === 'warning' ? '#ffc107' : '#17a2b8',
          color: 'white'
        }}
      >
        {icon}
        <span>{message}</span>
      </NextAlert>
    </div>
  );
}
