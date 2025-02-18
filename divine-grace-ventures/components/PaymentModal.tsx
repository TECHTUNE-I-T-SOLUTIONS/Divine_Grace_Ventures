// components/PaymentModal.tsx
'use client';

import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';

interface PaymentModalProps {
  totalAmount: number;
  email: string;
  onSuccess: (reference: string, deliveryInfo: { address: string, phone: string, note?: string, delivery_date: string }) => void;
  onClose: () => void;
}

export default function PaymentModal({ totalAmount, email, onSuccess, onClose }: PaymentModalProps) {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [note, setNote] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  
  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: totalAmount * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (!deliveryAddress || !deliveryPhone || !deliveryDate) {
      alert("Please fill in delivery address, phone, and expected delivery date");
      return;
    }
    initializePayment({
      onSuccess: (reference) => {
        onSuccess(reference.reference, { address: deliveryAddress, phone: deliveryPhone, note, delivery_date: deliveryDate });
      },
      onClose,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50" onClick={onClose}>
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl text-center font-bold mb-4">Proceed to Payment</h2>
        <p className="text-center">Total Amount: ₦{totalAmount.toFixed(2)}</p>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Delivery Address</label>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full text-black border rounded p-2"
            placeholder="Enter delivery address"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Delivery Phone</label>
          <input
            type="text"
            value={deliveryPhone}
            onChange={(e) => setDeliveryPhone(e.target.value)}
            className="w-full text-black border rounded p-2"
            placeholder="Enter phone number"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-black border rounded p-2"
            placeholder="Additional instructions"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Expected Delivery Date</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full text-black border rounded p-2"
          />
        </div>
        <button onClick={handlePayment} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Pay Now
        </button>
        <button onClick={onClose} className="mt-2 ml-56 bg-green-500 text-red-500 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
