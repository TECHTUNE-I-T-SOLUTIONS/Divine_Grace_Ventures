// components/PaymentModal.tsx
'use client';

import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import useSound from 'use-sound';
import CustomAlert from '@/components/CustomAlert';

interface PaymentModalProps {
  totalAmount: number;
  email: string;
  orderId: number; // new prop for order id
  onSuccess: (reference: string, deliveryInfo: { address: string; phone: string; payer_name: string; note?: string }) => void;
  onClose: () => void;
}

export default function PaymentModal({ totalAmount, email, orderId, onSuccess, onClose }: PaymentModalProps) {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [payerName, setPayerName] = useState('');
  const [note, setNote] = useState('');
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  // Use a sound file located in your public folder (e.g., public/sounds/success.mp3)
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: totalAmount * 100, // Paystack expects the amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (!deliveryAddress || !deliveryPhone || !payerName) {
      setAlertMessage({ type: 'error', message: "Please fill in your delivery address, phone number, and your name." });
      return;
    }
    initializePayment({
      onSuccess: async (reference) => {
        playSuccess();
        setAlertMessage({ type: 'success', message: "Payment successful!" });
        // Post a notification about the successful payment, including order id and amount.
        try {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `Payment successful for Order ${orderId}. Reference: ${reference.reference}`,
              type: 'payment',
              email,         // optionally include user id if available
              order_id: orderId,
              amount: totalAmount
            }),
          });
        } catch (error) {
          console.error("Notification error:", error);
        }
        // Call the parent's onSuccess callback with delivery info
        onSuccess(reference.reference, {
          address: deliveryAddress,
          phone: deliveryPhone,
          payer_name: payerName,
          note,
        });
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
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            className="w-full text-black border rounded p-2"
            placeholder="Enter your name"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Note (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any special instructions?"
            className="w-full text-black border rounded p-2"
          />
        </div>
        <p className="mt-4 text-center text-sm text-gray-300">
          Delivery may take at least 5 days. Our admin will contact you for further details.
        </p>
        {alertMessage && <CustomAlert type={alertMessage.type} message={alertMessage.message} />}
        <button onClick={handlePayment} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Pay Now
        </button>
        <button onClick={onClose} className="mt-2 ml-56 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
