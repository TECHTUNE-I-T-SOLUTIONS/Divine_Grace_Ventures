'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CustomLoader from '@/components/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import PaymentModal from '@/components/PaymentModal';

interface CartItem {
  id: number;
  price: number;
  user_quantity: number;
  note?: string;
  unit: string;
  products: {
    image: string;
    name: string;
  };
}

interface DeliveryInfo {
  address: string;
  phone: string;
  payer_name: string;
  note?: string;
}

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [editItem, setEditItem] = useState<CartItem | null>(null);
  const [updatedQuantity, setUpdatedQuantity] = useState<number>(0);
  const [updatedNote, setUpdatedNote] = useState<string>('');

  useEffect(() => {
    async function fetchCart() {
      try {
        if (!user) throw new Error("User not authenticated");
        const res = await fetch(`/api/cart?user_id=${user.id}`, { credentials: 'include' });
        const data: { cart: CartItem[] } = await res.json();
        if (!res.ok) throw new Error(data.cart ? 'Failed to fetch cart' : '');

        const updatedCart = data.cart.map((item) => ({
          ...item,
          products: {
            ...item.products,
            image: item.products.image.startsWith('http')
              ? item.products.image
              : `/api/proxy-image?filePath=${encodeURIComponent(item.products.image)}`,
          },
        }));

        setCartItems(updatedCart);
        setTotalAmount(updatedCart.reduce((acc, item) => acc + item.price * item.user_quantity, 0));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
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

      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setTotalAmount((prev) => {
        const removedItem = cartItems.find((item) => item.id === id);
        return removedItem ? prev - removedItem.price : prev;
      });
    } catch (error: unknown) {
      console.error('Remove cart error:', error);
    }
  };

  const handleEditItem = (item: CartItem) => {
    setEditItem(item);
    setUpdatedQuantity(item.user_quantity);
    setUpdatedNote(item.note || '');
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: editItem?.id, user_quantity: updatedQuantity, note: updatedNote }),
      });
      if (!res.ok) throw new Error('Failed to update item');

      setCartItems((prev) =>
        prev.map((item) => (item.id === editItem?.id ? { ...item, user_quantity: updatedQuantity, note: updatedNote } : item))
      );
      setTotalAmount(cartItems.reduce((acc, item) => acc + item.price * (item.id === editItem?.id ? updatedQuantity : item.user_quantity), 0));
      setEditItem(null);
    } catch (error: unknown) {
      console.error('Edit cart error:', error);
    }
  };
  
  const handleCheckoutSuccess = async (reference: string, deliveryInfo: DeliveryInfo) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          user_id: user?.id, 
          cart: cartItems, 
          payment_reference: reference,
          delivery_address: deliveryInfo.address,
          delivery_phone: deliveryInfo.phone,
          payer_name: deliveryInfo.payer_name,
          note: deliveryInfo.note
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');
      console.log('Order created:', data);
      setCartItems([]);
      setTotalAmount(0);
      setShowPaymentModal(false);
      // Optionally, redirect to the orders page:
      // router.push('/Dashboard/orders');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Order creation error:', error.message);
      } else {
        console.error('Unknown error occurred during order creation');
      }
    }
  };

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!user) return <div>Please log in to view the cart.</div>;

  return (
    <div className="p-4 bg-gradient-to-b from-gray-800 to-purple-600 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-white">My Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-white">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item: CartItem) => (
            <li key={item.id} className="flex items-center justify-between p-4 bg-white rounded shadow">
              <Image src={item.products.image} alt={item.products.name} width={64} height={64} className="rounded" />
              <div className="flex-grow ml-4">
                <p className="font-bold text-black">{item.products.name}</p>
                <p className="text-sm text-gray-600">Price: ₦{item.price}</p>
                <p className="text-sm text-gray-600">Quantity: {item.user_quantity}</p>
                <p className="text-sm text-gray-600">Unit: {item.unit}</p>
                {item.note && <p className="text-sm text-gray-600">Note: {item.note}</p>}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditItem(item)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" title="Edit Item">
                  Edit
                </button>
                <button onClick={() => handleRemoveItem(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" title="Remove Item">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <div className="mt-6">
          <p className="font-bold text-white">Total Amount: ₦{totalAmount.toFixed(2)}</p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            title="Proceed to Checkout"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
      {showPaymentModal && user && (
        <PaymentModal
          totalAmount={totalAmount}
          email={user.email}
          orderId={0} // Pass a placeholder or generated orderId if available
          onSuccess={handleCheckoutSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
      {editItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setEditItem(null)}></div>
          <div className="bg-white rounded-lg p-6 z-60">
            <h3 className="text-xl font-bold mb-4">Edit Cart Item</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={updatedQuantity}
                onChange={(e) => setUpdatedQuantity(Number(e.target.value))}
                min={1}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Note</label>
              <textarea
                value={updatedNote}
                onChange={(e) => setUpdatedNote(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Any special instructions?"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditItem(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
