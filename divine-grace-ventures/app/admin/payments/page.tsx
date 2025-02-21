// app/admin/payments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';
import PaymentCard from '@/components/PaymentCard';

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
          <PaymentCard key={payment.id} transaction={payment} />
        ))}
      </div>
    </div>
  );
}
