'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import PaymentCard from '@/components/PaymentCard';

type Transaction = {
  id: string;
  amount: number;
  date: string;
  status: string;
  description: string;
};

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchTransactions() {
      try {
        if (!user) throw new Error('User not authenticated');
        const res = await fetch(`/api/admin/payments?user_id=${user.id}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch transactions');
        setTransactions(data.payments);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [user]);

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!user) return <div>Please log in to view your transactions.</div>;

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">My Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <PaymentCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
}
