'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';
import PaymentCard from '@/components/PaymentCard';

// Define a type for the payment object
interface Payment {
  id: number;
  order_id: number;
  user_id: string;
  payment_reference: string;
  payer_name: string;
  amount: number;
  delivery_address: string;
  delivery_phone: string;
  note?: string;
  payment_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]); // Specify the type as Payment[]
  const [loading, setLoading] = useState<boolean>(true); // Specify the type as boolean
  const [error, setError] = useState<string>(''); // Specify the type as string

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch('/api/admin/payments');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch payments');
        setPayments(data.payments);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Ensure we are dealing with an instance of Error
        } else {
          setError('An unknown error occurred');
        }
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
