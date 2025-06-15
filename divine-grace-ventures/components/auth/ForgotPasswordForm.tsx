'use client';

import { useState } from 'react';
import CustomAlert from '@/components/CustomAlert';
import CustomLoader from '@/components/CustomLoader';

type Props = {
  onBackToLogin: () => void;
  onSwitchToSignup: () => void;
};

export default function ForgotPasswordForm({ onBackToLogin, onSwitchToSignup }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

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

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Unexpected response format. Please try again later.');
      }

      if (!res.ok) {
        setAlert({ type: 'error', message: data?.error || 'Failed to send reset link.' });
      } else {
        setAlert({ type: 'success', message: 'Password reset link sent to your email.' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlert({ type: 'error', message: error.message || 'An error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4 text-center">Forgot Password</h2>
      {alert && <CustomAlert type={alert.type} message={alert.message} />}
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className="block mb-1 text-white">Email</label>
          <input
            id="forgot-email"
            type="email"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        title="Reset Password">
          Reset Password
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-white">
          Remembered your password?{' '}
          <button onClick={onBackToLogin} className="text-blue-400 hover:underline" title="Login">
            Login
          </button>
        </p>
        <p className="mt-2 text-white">
          Don&apos;t have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-blue-400 hover:underline" title="Sign Up">
            Sign Up
          </button>
        </p>
      </div>

      {loading && <CustomLoader />}
    </div>
  );
}
