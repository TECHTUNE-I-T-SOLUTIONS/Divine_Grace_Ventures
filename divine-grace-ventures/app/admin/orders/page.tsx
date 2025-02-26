'use client';

import { useState, useEffect } from 'react';
import OrderCard, { Order } from '@/components/OrderCard';
import CustomLoader from '@/components/CustomLoader';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]); // Use the Order type for the orders
  const [loading, setLoading] = useState<boolean>(true); // Specify the type of loading as boolean
  const [error, setError] = useState<string>(''); // Set error type as string

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Fetch all orders from your API endpoint (ensure it returns { orders: [...] })
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
        setOrders(data.orders);
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
    fetchOrders();
  }, []);

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={{ ...order, adminView: true }} />
          ))}
        </div>
      )}
    </div>
  );
}
