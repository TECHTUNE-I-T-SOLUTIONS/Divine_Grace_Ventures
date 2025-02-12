// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserShield } from 'react-icons/fa';

function AdminLoginForm({ onSwitchView }: { onSwitchView: (view: 'forgot') => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your admin login logic here (e.g., using Supabase to authenticate against the admins table)
    console.log('Admin login:', email, password);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
      <form onSubmit={handleAdminLogin} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="block mb-1">Email</label>
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
          <label htmlFor="admin-password" className="block mb-1">Password</label>
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
          <button
            className="text-blue-400 hover:underline"
            onClick={() => onSwitchView('forgot')}
          >
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
}

function AdminForgotPasswordForm({ onSwitchView }: { onSwitchView: (view: 'login') => void }) {
  const [email, setEmail] = useState('');

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your forgot password logic here (e.g., sending an OTP or reset link)
    console.log('Admin forgot password for:', email);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
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
          <button
            className="text-blue-400 hover:underline"
            onClick={() => onSwitchView('login')}
          >
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

  const handleClose = () => {
    // Navigate back without reloading the underlying page
    router.back();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        {/* Optional: You can add an admin icon above the close button */}
        <div className="absolute top-2 right-2">
          <button className="text-white text-xl" onClick={handleClose}>
            &times;
          </button>
        </div>
        {activeView === 'login' && (
          <AdminLoginForm onSwitchView={(view) => setActiveView(view)} />
        )}
        {activeView === 'forgot' && (
          <AdminForgotPasswordForm onSwitchView={(view) => setActiveView(view)} />
        )}
      </div>
    </div>
  );
}
