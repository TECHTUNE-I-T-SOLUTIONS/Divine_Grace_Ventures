// components/Footer.tsx
'use client';

import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaGithub, FaStackOverflow } from 'react-icons/fa';
import { SiX } from 'react-icons/si'; // Import the X icon from react-icons/si

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Social Links Section */}
        <div className="flex flex-col items-start space-y-2">
          <h3 className="text-lg font-semibold">Our Socials</h3>
          <div className="flex space-x-6">
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
            <a href="#" aria-label="WhatsApp" className="text-2xl hover:text-green-500">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Developers Links Section */}
        <div className="flex flex-col items-start space-y-2">
          <h3 className="text-lg font-semibold">Our Developers</h3>
          <div className="flex space-x-6">
            <a href="#" aria-label="GitHub" className="text-2xl hover:text-gray-600">
              <FaGithub />
            </a>
            <a href="#" aria-label="StackOverflow" className="text-2xl hover:text-orange-600">
              <FaStackOverflow />
            </a>
          </div>
        </div>
      </div>

      {/* Cookie Notice */}
      <div className="text-sm text-gray-400 text-center mt-4">
        <p>
          We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
        </p>
      </div>

      {/* Copyright */}
      <p className="mt-6 text-sm text-center">© {new Date().getFullYear()} Divine Grace Ventures. All rights reserved.</p>
    </footer>
  );
}
