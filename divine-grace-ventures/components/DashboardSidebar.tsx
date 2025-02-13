// components/DashboardSidebar.tsx
import Link from 'next/link';
import { FaHome, FaShoppingCart, FaListAlt, FaMoneyCheckAlt } from 'react-icons/fa';

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-800 to-purple-800 p-6">
      <nav className="space-y-4">
        <Link href="/dashboard">
          <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <FaHome size={20} />
            <span>Home</span>
          </div>
        </Link>
        <Link href="/dashboard/orders">
          <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <FaShoppingCart size={20} />
            <span>Orders</span>
          </div>
        </Link>
        <Link href="/dashboard/transactions">
          <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <FaListAlt size={20} />
            <span>Transactions</span>
          </div>
        </Link>
        <Link href="/dashboard/payment">
          <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <FaMoneyCheckAlt size={20} />
            <span>Payment Tracking</span>
          </div>
        </Link>
      </nav>
    </aside>
  );
}
