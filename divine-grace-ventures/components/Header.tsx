// components/Header.tsx
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaUserShield, FaUser } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Divine Grace Ventures Logo" className="h-10" />
          <span className="text-xl text-black font-bold">Divine Grace Ventures</span>
        </div>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link href="/" className="flex text-black font-bold items-center space-x-1 hover:text-blue-500">
                <FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/about" className="flex text-black font-bold items-center space-x-1 hover:text-blue-500">
                <FaInfoCircle />
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="flex text-black font-bold items-center space-x-1 hover:text-blue-500">
                <FaUserShield />
                <span>Admin</span>
              </Link>
            </li>
            <li>
              <Link href="/login" className="flex text-black font-bold items-center space-x-1 hover:text-blue-500">
                <FaUser />
                <span>Login / Sign Up</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
