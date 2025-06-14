// components/Footer.tsx
'use client';

import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaGithub, FaStackOverflow } from 'react-icons/fa';
import { SiX } from 'react-icons/si'; // Import the X icon from react-icons/si
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Social Links Section */}
        <div className="ml-4 flex flex-col items-start space-y-2">
          <h3 className="text-lg font-semibold">Our Socials</h3>
          <div className="flex space-x-3">
            <a href="#" aria-label="Facebook" className="text-2xl hover:text-blue-600">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Instagram" className="text-2xl hover:text-pink-600">
              <FaInstagram />
            </a>
            <a href="#" aria-label="X" className="text-2xl hover:text-blue-400">
              <SiX /> {/* Using SiX for the X logo */}
            </a>
            <a href="#" aria-label="TikTok" className="text-2xl hover:text-black">
              <FaTiktok />
            </a>
            <a href="https://wa.me/2348144409511" aria-label="WhatsApp" className="text-2xl hover:text-green-500">
              <FaWhatsapp />
            </a>
          </div> 
        </div>

        {/* Developers Links Section */}
        <div className="mr-4 flex flex-col items-start space-y-2">
          <h3 className="text-lg font-semibold">Our Developer</h3>
          <div className="flex space-x-3">
            <a href="https://github.com/TECHTUNE-I-T-SOLUTIONS" aria-label="GitHub" className="text-2xl hover:text-gray-600">
              <FaGithub />
            </a>
            <a href="https://stackoverflow.com/users/28175898/prince-techtune" aria-label="StackOverflow" className="text-2xl hover:text-orange-600">
              <FaStackOverflow />
            </a>
          </div>
        </div>
      </div>

      {/* Cookie Notice */}
      <div className="text-sm text-gray-400 m-2 text-center mt-4">
        <p>
          We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
        </p>
        <div className="flex flex-col items-center justify-between space-y-2 p-2">
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="text-sm text-gray-100 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/cookies-usage" className="text-sm text-gray-100 hover:underline">
              Cookies Usage
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="mt-6 text-sm text-center">© {new Date().getFullYear()} Divine Grace Ventures. All rights reserved.</p>
    </footer>
  );
}
