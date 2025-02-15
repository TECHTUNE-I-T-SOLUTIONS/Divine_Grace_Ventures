// app/admin/payments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch('/api/admin/payments');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch payments');
        setPayments(data.payments);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Payments</h2>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-gray-800 p-4 rounded-xl shadow break-words">
            <p className="text-lg">Order ID: {payment.order_id}</p>
            <p className="text-lg">Amount: ${payment.amount}</p>
            <p className="text-lg">Status: {payment.status}</p>
            <p className="text-sm text-gray-400">
              Date: {new Date(payment.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
