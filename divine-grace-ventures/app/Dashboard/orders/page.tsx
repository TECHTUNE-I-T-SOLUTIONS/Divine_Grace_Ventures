'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';
import OrderCard, { Order } from '@/components/OrderCard';
import { useAuth } from '@/context/AuthContext';

interface OrderItem {
  products: {
    name: string;
  };
  // Define other fields if necessary
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_at');

  useEffect(() => {
    async function fetchOrders() {
      try {
        if (!user) throw new Error("User not authenticated");
        const res = await fetch(`/api/orders?user_id=${user.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
        setOrders(data.orders);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  // Filter orders by search (search within order items' names)
  const filteredOrders = orders.filter((order) =>
    order.order_items.some((item: OrderItem) =>
      (item.products.name || '').toLowerCase().includes(search.toLowerCase())
    )
  );

  // Sort orders by created_at or total amount
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sort === 'total') return a.total - b.total;
    // Default sort by date descending
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!user) return <div>Please log in to view your orders.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search orders..."
          className="p-2 border rounded mb-2 md:mb-0 bg-blue-100 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded bg-blue-100 text-black"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="created_at">Sort by Date</option>
          <option value="total">Sort by Total</option>
        </select>
      </div>
      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
