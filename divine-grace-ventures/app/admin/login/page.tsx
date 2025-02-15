// app/(admin)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserShield } from 'react-icons/fa';
import CustomLoader from '@/components/CustomLoader';
import CustomAlert from '@/components/CustomAlert';

function AdminLoginForm({ onSwitchView, setLoading }: { onSwitchView: (view: 'forgot') => void; setLoading: (value: boolean) => void; }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/login', {
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
      setAlert({ type: 'success', message: 'Admin login successful! Redirecting...' });
      setTimeout(() => {
        setLoading(false);
        router.push('/admin'); // Redirect to admin dashboard
      }, 2000);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Login error' });
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4 text-center">Admin Login</h2>
      {alert && <CustomAlert type={alert.type} message={alert.message} />}
      <form onSubmit={handleAdminLogin} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="block text-white mb-1">Email</label>
          <input
            id="admin-email"
            type="email"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-white mb-1">Password</label>
          <input
            id="admin-password"
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
          <button className="text-blue-400 hover:underline" onClick={() => onSwitchView('forgot')}>
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
}

function AdminForgotPasswordForm({ onSwitchView, setLoading }: { onSwitchView: (view: 'login') => void; setLoading: (value: boolean) => void; }) {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/forgot', {
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
      setAlert({ type: 'success', message: 'Reset instructions sent to your email.' });
      setLoading(false);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Error resetting password.' });
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      {alert && <CustomAlert type={alert.type} message={alert.message} />}
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div>
          <label htmlFor="admin-forgot-email" className="block mb-1">Email</label>
          <input
            id="admin-forgot-email"
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
          <button className="text-blue-400 hover:underline" onClick={() => onSwitchView('login')}>
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'login' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      {loading && <CustomLoader />}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <div className="absolute top-2 right-2">
            <button className="text-white text-xl" onClick={handleClose}>
              &times;
            </button>
          </div>
          {activeView === 'login' && (
            <AdminLoginForm onSwitchView={(view) => setActiveView(view)} setLoading={setLoading} />
          )}
          {activeView === 'forgot' && (
            <AdminForgotPasswordForm onSwitchView={(view) => setActiveView(view)} setLoading={setLoading} />
          )}
        </div>
      </div>
    </>
  );
}
