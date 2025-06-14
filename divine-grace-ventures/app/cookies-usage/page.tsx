'use client';
 
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function CookiesUsagePage() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleDownload = () => {
    if (pdfRef.current) {
      html2pdf().from(pdfRef.current).set({
        margin: 0.5,
        filename: 'Cookies-Usage.pdf',
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
        <p>This page explains how we use cookies on our website.</p>
        <h2>What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device to improve user experience.</p>
        <h2>Why We Use Cookies</h2>
        <ul>
          <li>To remember user preferences</li>
          <li>For analytics and performance monitoring</li>
        </ul>
        <h2>Managing Cookies</h2>
        <p>You can manage cookies in your browser settings. Disabling cookies may affect site functionality.</p>
      </div>
    </main>
  );
}
