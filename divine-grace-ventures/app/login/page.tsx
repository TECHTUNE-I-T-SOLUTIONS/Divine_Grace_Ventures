'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomAlert from '@/components/CustomAlert';
import CustomLoader from '@/components/CustomLoader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Login failed.' });
        setLoading(false);
        return;
      }
      setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Login error' });
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <CustomLoader />}
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {alert && <CustomAlert type={alert.type} message={alert.message} />}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block mb-1">Password</label>
            <input
              id="login-password"
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <a href="/login/signup" className="text-blue-400 hover:underline">
              Sign Up
            </a>
          </p>
          <p className="mt-2">
            Forgot Password?{' '}
            <a href="/login/forgot" className="text-blue-400 hover:underline">
              Reset Here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
