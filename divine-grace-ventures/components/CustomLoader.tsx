// components/CustomLoader.tsx
'use client';

import { useEffect, useState } from 'react';

export default function CustomLoader() {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const letters = ['D', 'G', 'V']; // Move the letters array inside useEffect
    const interval = setInterval(() => {
      setDisplayText((prev) => {
        if (prev === '') return letters[0];
        if (prev === letters[0]) return letters[0] + letters[1];
        if (prev === letters[0] + letters[1]) return letters.join('');
        return '';
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);  // No need to include letters in the dependency array

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-40">
      <div className="text-5xl font-extrabold text-white animate-pulse">
        {displayText}
      </div>
    </div>
  );
}
