'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaUserShield, FaUser, FaBars } from 'react-icons/fa';
import Image from 'next/image'; // Import Image from next/image

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-transparent bg-opacity-90 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <Image 
            src="/images/logo.png" 
            alt="Divine Grace Ventures Logo" 
            width={40} 
            height={40} 
            className="rounded-sm" 
          />
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
            <li>
              <Link href="/adminLogin">
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
            <li>
              <Link href="/adminLogin">
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
          </ul>
        </nav>
      )}
    </header>
  );
}
