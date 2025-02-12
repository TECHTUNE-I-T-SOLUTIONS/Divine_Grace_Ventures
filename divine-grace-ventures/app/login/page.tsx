// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function LoginForm({ onSwitchView }: { onSwitchView: (view: 'signup' | 'forgot') => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Logging in with:', email, password);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
          <button className="text-blue-400 hover:underline" onClick={() => onSwitchView('signup')}>
            Sign Up
          </button>
        </p>
        <p className="mt-2">
          <button className="text-blue-400 hover:underline" onClick={() => onSwitchView('forgot')}>
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
}

function SignupForm({ onSwitchView }: { onSwitchView: (view: 'login' | 'forgot') => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Add your sign-up logic here
    console.log('Signing up with:', email, password);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="block mb-1">Email</label>
          <input
            id="signup-email"
            type="email"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="block mb-1">Password</label>
          <input
            id="signup-password"
            type="password"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="signup-confirm-password" className="block mb-1">Confirm Password</label>
          <input
            id="signup-confirm-password"
            type="password"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Sign Up
        </button>
      </form>
      <div className="mt-4 text-center">
        <p>
          Already have an account?{' '}
          <button className="text-blue-400 hover:underline" onClick={() => onSwitchView('login')}>
            Login
          </button>
        </p>
        <p className="mt-2">
          <button className="text-blue-400 hover:underline" onClick={() => onSwitchView('forgot')}>
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onSwitchView }: { onSwitchView: (view: 'login' | 'signup') => void }) {
  const [email, setEmail] = useState('');

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your forgot password logic here
    console.log('Reset password for:', email);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
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
          <button className="text-blue-400 hover:underline" onClick={() => onSwitchView('login')}>
            Login
          </button>
        </p>
        <p className="mt-2">
          Don't have an account?{' '}
          <button className="text-blue-400 hover:underline" onClick={() => onSwitchView('signup')}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'login' | 'signup' | 'forgot'>('login');

  const handleClose = () => {
    // Navigate back without reloading the underlying page
    router.back();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-white text-xl"
          onClick={handleClose}
        >
          &times;
        </button>
        {activeView === 'login' && (
          <LoginForm onSwitchView={(view) => setActiveView(view)} />
        )}
        {activeView === 'signup' && (
          <SignupForm onSwitchView={(view) => setActiveView(view)} />
        )}
        {activeView === 'forgot' && (
          <ForgotPasswordForm onSwitchView={(view) => setActiveView(view)} />
        )}
      </div>
    </div>
  );
}
