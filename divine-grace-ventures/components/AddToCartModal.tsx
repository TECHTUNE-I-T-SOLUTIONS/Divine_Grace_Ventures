// components/AddToCartModal.tsx
'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Product } from './ProductCard';
import CustomAlert from '@/components/CustomAlert';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'; // Import Image component from Next.js for optimization

interface AddToCartModalProps {
  product: Product;
  onClose: () => void;
  onAdd: (userQuantity: number, note: string) => void;
}

export default function AddToCartModal({ product, onClose, onAdd }: AddToCartModalProps) {
  const { user } = useAuth(); // Get the logged-in user's details
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call the onAdd callback (e.g. to update cart state)
    onAdd(quantity, note);

    // Prepare a custom HTML notification message
    const emailHtml = `
      <div style="text-align: center; padding: 20px; background: #f8f8f8; font-family: sans-serif;">
        <img src="https://divinegraceventures.vercel.app/logo.png" alt="Divine Grace Ventures" style="max-width: 150px; margin-bottom: 20px;" />
        <h1 style="color: #333;">Item Added to Cart</h1>
        <p style="font-size: 16px;">The product <strong>${product.name}</strong> has been added to your cart.</p>
        <a href="https://divinegraceventures.vercel.app/cart" style="padding: 10px 20px; background: #0070f3; color: #fff; text-decoration: none; border-radius: 5px;">View Cart</a>
      </div>
    `;

    // Send a notification email to the logged-in user (if available)
    if (user?.email) {
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: emailHtml,
            type: 'product_carted',
            email: user.email,
          }),
        });
        setAlert({ type: 'success', message: 'Item added to cart. A notification has been sent to your email.' });
      } catch {
        setAlert({ type: 'error', message: 'Item added to cart but failed to send notification.' });
      }
    } else {
      setAlert({ type: 'info', message: 'Item added to cart.' });
    }
  };

  // Compute imageSrc: if product.image is not a full URL, generate one via the proxy endpoint.
  const imageSrc =
    product.image && !product.image.startsWith('http')
      ? `/api/proxy-image?filePath=${encodeURIComponent(product.image)}`
      : product.image || '';

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Modal */}
      <div className="bg-gradient-to-b from-indigo-800 to-purple-800 w-full max-w-md rounded-t-lg p-4 animate-slide-up">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg text-white font-bold">Add {product.name} to Cart</h3>
          <button onClick={onClose} title="Close">
            <FaTimes size={20} className="text-white" />
          </button>
        </div>
        {imageSrc && (
          <div className="my-4 flex justify-center">
            <Image
              src={imageSrc}
              alt={product.name}
              width={96} // Set width and height for proper optimization
              height={96}
              className="object-cover rounded"
            />
          </div>
        )}
        <p className="text-sm text-gray-200">
          Price: ₦{product.price} (Pack, Bag, Sack)
        </p>
        {product.unit_price && (
          <p className="text-sm text-gray-300">
            Unit Price: ₦{product.unit_price}
            {product.unit ? ` per ${product.unit}` : ''}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Quantity (How many... Packs, Bags, Sacks?)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              className="mt-1 text-black block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special instructions?"
              className="mt-1 text-black block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <button
            type="submit"
            title="Add to Cart"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </form>
        {alert && <CustomAlert type={alert.type} message={alert.message} />}
      </div>
    </div>
  );
}
