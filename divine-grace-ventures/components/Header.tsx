// components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaInfoCircle, FaUserShield, FaUser, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userType, setUserType } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    // Clear any auth tokens if needed, then update context
    setUserType(null);
    router.push('/login');
  };

  return (
    <header className="bg-tranparent bg-opacity-90 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Divine Grace Ventures Logo" className="h-10 w-10 rounded-sm" />
          <span className="text-xl text-white font-bold">Divine Grace Ventures</span>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-4 justify-end">
            <li>
              <Link href="/">
                <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                  <FaHome />
                  <span>Home</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                  <FaInfoCircle />
                  <span>About</span>
                </div>
              </Link>
            </li>
            {userType === 'admin' ? (
              <>
                <li>
                  <Link href="/admin">
                    <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                      <FaUserShield />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : userType === 'user' ? (
              <>
                <li>
                  <Link href="/user">
                    <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                      <FaUser />
                      <span>Profile</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/admin/login">
                    <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                      <FaUserShield />
                      <span>Admin</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/user">
                    <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                      <FaUser />
                      <span>Login / Sign Up</span>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="text-white" />
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden">
          <ul className="flex flex-col items-end space-y-2 px-4 pt-2">
            <li>
              <Link href="/">
                <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                  <FaHome />
                  <span>Home</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                  <FaInfoCircle />
                  <span>About</span>
                </div>
              </Link>
            </li>
            {userType === 'admin' ? (
              <>
                <li>
                  <Link href="/admin">
                    <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                      <FaUserShield />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : userType === 'user' ? (
              <>
                <li>
                  <Link href="/user">
                    <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                      <FaUser />
                      <span>Profile</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/admin/login">
                    <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                      <FaUserShield />
                      <span>Admin</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/user">
                    <div className="flex items-center space-x-1 text-white font-bold hover:text-blue-500">
                      <FaUser />
                      <span>Login / Sign Up</span>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
