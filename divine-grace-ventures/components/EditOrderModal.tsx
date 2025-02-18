// components/EditOrderModal.tsx
'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface Order {
  id: number;
  delivery_date: string; // ISO format date string
  // other order fields if needed
}

interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onUpdate: (updatedOrder: Order) => void;
}

export default function EditOrderModal({ order, onClose, onUpdate }: EditOrderModalProps) {
  const [deliveryDate, setDeliveryDate] = useState(order.delivery_date);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, delivery_date: deliveryDate }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update order');
        setLoading(false);
        return;
      }
      onUpdate(data.data);
      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error updating order');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
            <FaTimes size={20} />
          </button>
          <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block mb-1">Delivery Date</label>
              <input
                type="date"
                value={deliveryDate.substring(0, 10)}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {loading ? 'Updating...' : 'Update Order'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
