'use client';

import { useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function EmailJSInitializer() {
  useEffect(() => {
    emailjs.init({
      publicKey: "IYrZE9BIaCJQLRI9S",
    });
  }, []);

  return null;
}
