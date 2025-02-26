'use client';

import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image'; // Import Image from next/image

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    // Add logout logic here (clear tokens, etc.)
    router.push('/admin/login');
  };

  return (
    <header className="flex items-center justify-between bg-gray-800 bg-opacity-90 p-4 rounded-b-lg shadow-lg">
      <div className="flex items-center space-x-3">
        <Image 
          src="/images/logo.png" 
          alt="Logo" 
          className="h-10 w-10 rounded-full" 
          width={40} // Add width and height for optimization
          height={40} // Add width and height for optimization
        />
        <span className="text-2xl text-white font-bold">Divine Grace Ventures Admin</span>
      </div>
      <button onClick={handleLogout} className="flex items-center text-white hover:text-red-400">
        <FaSignOutAlt className="mr-2" />
        Logout
      </button>
    </header>
  );
}
