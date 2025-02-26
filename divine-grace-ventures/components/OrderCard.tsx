'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface OrderItem {
  product_id: number;
  name: string;
  image?: string;
  user_quantity?: number;
  quantity?: number;
  unit?: string;
  price: number;
}

export interface Order {
  id: number;
  user_id: string;
  order_items: OrderItem[] | string; // Could be an array or a JSON string; we’ll parse if needed
  total: number;
  delivery_address: string;
  delivery_phone: string;
  payer_name: string;
  note?: string;
  status: string; // e.g., 'pending' or 'delivered'
  created_at: string;
  updated_at: string;
  // This flag tells the card that it’s being viewed by an admin
  adminView?: boolean;
}

interface OrderCardProps {
  order: Order;
  // Optional callback for when admin updates the status
  onStatusUpdate?: (orderId: number, newStatus: string) => void;
}

export default function OrderCard({ order, onStatusUpdate }: OrderCardProps) {
  const [status, setStatus] = useState(order.status);

  // Ensure order_items is parsed as an array
  const orderItems: OrderItem[] =
    Array.isArray(order.order_items)
      ? order.order_items
      : JSON.parse(order.order_items as string);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order status');
      setStatus(newStatus);
      if (onStatusUpdate) onStatusUpdate(order.id, newStatus);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Status update error:', error.message);
      } else {
        console.error('Unknown error during status update');
      }
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-gradient-to-r from-indigo-500 to-purple-900 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Order #{order.id}</h3>
        <p className="text-sm text-gray-300">
          Placed on: {new Date(order.created_at).toLocaleString()}
        </p>
      </div>
      <p className="text-sm text-gray-300">Total: ₦{order.total.toFixed(2)}</p>
      <p className="text-sm text-gray-300">Delivery Address: {order.delivery_address}</p>
      <p className="text-sm text-gray-300">Delivery Phone: {order.delivery_phone}</p>
      <p className="text-sm text-gray-300">Status: {status}</p>
      <div className="mt-2">
        <h4 className="text-white font-bold">Items:</h4>
        <div className="space-y-2">
          {orderItems.map((item) => {
            // Generate signed URL if item.image is a file path
            const itemImageSrc =
              item.image && !item.image.startsWith('http')
                ? `/api/proxy-image?filePath=${encodeURIComponent(item.image)}`
                : item.image || '';
            return (
              <div key={item.product_id} className="flex items-center space-x-2">
                {itemImageSrc && (
                  <Image
                    src={itemImageSrc}
                    alt={item.name}
                    width={48} // Adjust the width and height as needed
                    height={48} // Adjust the width and height as needed
                    className="object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="text-xs text-gray-300">
                    {item.user_quantity || item.quantity} {item.unit || 'unit'} @ ₦{item.price} each
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {order.adminView && status !== 'delivered' && (
        <div className="mt-2">
          <button
            onClick={() => handleStatusUpdate('delivered')}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Mark as Delivered
          </button>
        </div>
      )}
    </div>
  );
}
