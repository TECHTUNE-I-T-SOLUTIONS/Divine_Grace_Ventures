// app/dashboard/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import PaymentModal from '@/components/PaymentModal';

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [editItem, setEditItem] = useState<any>(null);
  const [updatedQuantity, setUpdatedQuantity] = useState(0);
  const [updatedNote, setUpdatedNote] = useState('');

  useEffect(() => {
    async function fetchCart() {
      try {
        if (!user) throw new Error("User not authenticated");
        const res = await fetch(`/api/cart?user_id=${user.id}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch cart');
        setCartItems(data.cart);
        const total = data.cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        setTotalAmount(total);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [user]);

  const handleRemoveItem = async (id: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove item');
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Remove cart error:', error.message);
    }
  };

  const handleEditItem = (item: any) => {
    setEditItem(item);
    setUpdatedQuantity(item.quantity);
    setUpdatedNote(item.note || '');
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: editItem.id, quantity: updatedQuantity, note: updatedNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update item');
      setCartItems(cartItems.map(item => item.id === editItem.id ? { ...item, quantity: updatedQuantity, note: updatedNote } : item));
      setEditItem(null);
    } catch (error: any) {
      console.error('Edit cart error:', error.message);
    }
  };

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!user) return <div>Please log in to view the cart.</div>;

  return (
    <div className="p-4 bg-gradient-to-b from-gray-800 to-purple-600">
      <h1 className="text-3xl font-bold mb-4">My Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item: any) => (
            <li key={item.id} className="flex items-center justify-between p-2 bg-white rounded shadow mb-2">
              <img src={item.products.image} alt={item.products.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex flex-col flex-grow ml-4">
                <p className="font-bold">{item.products.name}</p>
                <p className="text-sm">Price: ₦{item.price}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
                <p className="text-sm">Unit: {item.unit}</p>
                {item.note && <p className="text-sm">Note: {item.note}</p>}
              </div>
              <button onClick={() => handleEditItem(item)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
              <button onClick={() => handleRemoveItem(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <>
          <div className="mt-4">
            <p className="font-bold">Total Amount: ₦{totalAmount.toFixed(2)}</p>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Proceed to Checkout
          </button>
        </>
      )}
      {showPaymentModal && user && (
        <PaymentModal
          totalAmount={totalAmount}
          email={user.email}
          onSuccess={() => setShowPaymentModal(false)}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
