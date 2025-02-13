'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomAlert from '@/components/CustomAlert';
import CustomLoader from '@/components/CustomLoader';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Failed to reset password.' });
        setLoading(false);
        return;
      }
      setAlert({ type: 'success', message: 'A new password has been sent to your email.' });
      setTimeout(() => {
        setLoading(false);
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Error resetting password.' });
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <CustomLoader />}
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {alert && <CustomAlert type={alert.type} message={alert.message} />}
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block mb-1">Email</label>
            <input
              id="forgot-email"
              type="email"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
            Reset Password
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Remembered your password?{' '}
            <a href="/login" className="text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
