'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-300 p-4 shadow-lg rounded-lg max-w-md mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
      <p className="text-sm text-gray-700">
        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
      </p>
      <button
        onClick={acceptCookies}
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Accept
      </button>
    </div>
  );
}
