// components/AddToCartModal.tsx
'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface AddToCartModalProps {
  productId: number;
  productName: string;
  productImage?: string;
  productPrice: number;
  unit: string; // e.g., "bag", "cup", etc.
  onClose: () => void;
  onAdd: (userQuantity: number, note: string) => void;
}

export default function AddToCartModal({
  productId,
  productName,
  productImage,
  productPrice,
  unit,
  onClose,
  onAdd,
}: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(quantity, note);
  };

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Modal */}
      <div className="bg-gradient-to-b from-indigo-800 to-purple-800 w-full max-w-md rounded-t-lg p-4 animate-slide-up">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg text-white font-bold">Add {productName} to Cart</h3>
          <button 
          onClick={onClose} 
          title="Close">
            <FaTimes size={20} />
          </button>
        </div>
        {productImage && (
          <div className="my-4 flex justify-center">
            <img src={productImage} alt={productName} className="h-24 w-24 object-cover rounded" />
          </div>
        )}
        <p className="text-sm text-gray-200">
          Price: ₦{productPrice} per {unit}
        </p>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Quantity ({unit})
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
      </div>
    </div>
  );
}
