// components/PaymentCard.tsx
'use client';

interface PaymentCardProps {
  transaction: {
    id: number;
    order_id: number;
    user_id: string;
    payment_reference: string;
    payer_name: string;
    amount: number;
    delivery_address: string;
    delivery_phone: string;
    note?: string;
    payment_date?: string; // May be null; fallback to created_at if so
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export default function PaymentCard({ transaction }: PaymentCardProps) {
  // Use payment_date if available; otherwise fallback to created_at
  const dateToUse = transaction.payment_date || transaction.created_at;
  const paymentDate = new Date(dateToUse);
  const paymentDateString = isNaN(paymentDate.getTime())
    ? "N/A"
    : paymentDate.toLocaleString();

  const createdAt = new Date(transaction.created_at);
  const createdAtString = isNaN(createdAt.getTime())
    ? "N/A"
    : createdAt.toLocaleString();

  const updatedAt = new Date(transaction.updated_at);
  const updatedAtString = isNaN(updatedAt.getTime())
    ? "N/A"
    : updatedAt.toLocaleString();

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-bold">Transaction #{transaction.id}</h3>
      <p className="text-sm text-gray-300">
        <span className="font-semibold">Order ID:</span> {transaction.order_id}
      </p>
      <p className="text-sm text-gray-300">
        <span className="font-semibold">User ID:</span> {transaction.user_id}
      </p>
      <p className="text-sm text-gray-300">
        <span className="font-semibold">Payer Name:</span> {transaction.payer_name}
      </p>
      <p className="text-sm text-gray-300">
        <span className="font-semibold">Amount:</span> ₦{transaction.amount.toFixed(2)}
      </p>
      <p className="text-sm text-gray-300">
        <span className="font-semibold">Payment Reference:</span> {transaction.payment_reference}
      </p>
      <p className="text-sm text-gray-300">
        <span className="font-semibold">Status:</span> {transaction.status}
      </p>
      <p className="text-xs text-gray-400">
        <span className="font-semibold">Payment Date:</span> {paymentDateString}
      </p>
      <p className="text-xs text-gray-400">
        <span className="font-semibold">Delivery Address:</span> {transaction.delivery_address}
      </p>
      <p className="text-xs text-gray-400">
        <span className="font-semibold">Delivery Phone:</span> {transaction.delivery_phone}
      </p>
      {transaction.note && (
        <p className="text-xs text-gray-400">
          <span className="font-semibold">Note:</span> {transaction.note}
        </p>
      )}
      <p className="text-xs text-gray-400">
        <span className="font-semibold">Created At:</span> {createdAtString}
      </p>
      <p className="text-xs text-gray-400">
        <span className="font-semibold">Updated At:</span> {updatedAtString}
      </p>
    </div>
  );
}
