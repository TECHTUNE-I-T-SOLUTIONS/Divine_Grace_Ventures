'use client';

import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function PrivacyPolicyPage() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleDownload = () => {
    if (pdfRef.current) {
      html2pdf().from(pdfRef.current).set({
        margin: 0.5,
        filename: 'Privacy-Policy.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4', orientation: 'portrait' },
      }).save();
    }
  };

  return (
    <main className="bg-gray-900 max-w-4xl mx-auto px-4 py-12 mt-8 rounded-2xl">
      {/* Top bar with back button and download */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </button>

        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>

      {/* Page content */}
      <div ref={pdfRef} className="prose prose-sm sm:prose lg:prose-lg">
        <p>This privacy policy explains how we collect, use, and protect your information when you use our website.</p>
        <h2>Information We Collect</h2>
        <ul>
          <li>Personal identification information (Name, email address, phone number, etc.)</li>
        </ul>
        <h2>How We Use Your Information</h2>
        <p>We use the information to improve your experience, provide customer support, and communicate updates.</p>
        <h2>Your Data Rights</h2>
        <p>You have the right to access, modify, or request deletion of your data.</p>
        <p>Contact us for any privacy-related questions.</p>
      </div>
    </main>
  );
}
