// components/Footer.tsx
'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Divine Grace Ventures. All rights reserved.</p>
      </div>
    </footer>
  );
}
