// app/user/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import CustomAlert from '@/components/CustomAlert';
import CustomLoader from '@/components/CustomLoader';
import { FaTimes } from 'react-icons/fa';

export default function AuthPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Closes the modal (here, by navigating away)
  const handleClose = () => {
    router.push('/');
  };

  // If you click outside the modal, close it
  const handleOverlayClick = () => {
    handleClose();
  };

  // Prevent clicks inside modal from closing it
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // --- API Functions ---
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
        router.push('/Dashboard');
      }, 2000);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Login error' });
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!recaptchaToken) {
      setAlert({ type: 'error', message: 'Please complete the reCAPTCHA.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username: email.split('@')[0],
          password,
          recaptchaToken,
          phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Failed to send OTP.' });
        setLoading(false);
        return;
      }
      setAlert({ type: 'info', message: 'OTP sent to your email/phone.' });
      setOtpSent(true);
      // Automatically switch to OTP view
      setActiveView('otp');
      setLoading(false);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Error sending OTP.' });
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (password !== confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (!otp) {
      setAlert({ type: 'error', message: 'Please enter the OTP sent to you.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'OTP verification failed.' });
        setLoading(false);
        return;
      }
      // OTP is verified successfully; hide OTP modal and switch to login view
      setAlert({ type: 'success', message: 'Signup successful! Please login.' });
      setActiveView('login');
      setOtpSent(false);
      setLoading(false);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Signup error.' });
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setAlert({ type: 'error', message: 'Please enter your email first.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend OTP.');
      }

      setAlert({ type: 'success', message: 'A new OTP has been sent to your email.' });
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Error resending OTP.' });
    } finally {
      setLoading(false);
    }
  };

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
        setActiveView('login');
      }, 2000);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Error resetting password.' });
      setLoading(false);
    }
  };

  // --- Render Functions ---
  const renderCloseButton = () => (
    <button className="absolute top-2 right-2 text-white" onClick={handleClose}>
      <FaTimes size={20} />
    </button>
  );

  const renderLogin = () => (
    <div className="relative">
      {renderCloseButton()}
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Login</h2>
      {alert && <CustomAlert type={alert.type} message={alert.message} />}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block mb-1 text-white">Email</label>
          <input
            id="login-email"
            type="email"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block mb-1 text-white">Password</label>
          <input
            id="login-password"
            type="password"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        title="Login">
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-white">
          Don't have an account?{' '}
          <button onClick={() => { setActiveView('signup'); setAlert(null); }} className="text-blue-400 hover:underline"
          title="Sign Up">
            Sign Up
          </button>
        </p>
        <p className="mt-2 text-white">
          Forgot Password?{' '}
          <button onClick={() => { setActiveView('forgot'); setAlert(null); }} className="text-blue-400 hover:underline"
          title="Reset Password">
            Reset Here
          </button>
        </p>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="relative">
      {renderCloseButton()}
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Sign Up</h2>
      {alert && <CustomAlert type={alert.type} message={alert.message} />}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="block mb-1 text-white">Email</label>
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
          <label htmlFor="signup-phone" className="block mb-1 text-white">Phone Number (include the country code)</label>
          <input
            id="signup-phone"
            type="text"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g., +234xxxxxxxxxx (make sure to include +234)"
            required
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="block mb-1 text-white">Password</label>
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
          <label htmlFor="signup-confirm-password" className="block mb-1 text-white">Confirm Password</label>
          <input
            id="signup-confirm-password"
            type="password"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey="6Lcq9tUqAAAAAMPhI0XmKhFm6nNmxaWCtbuElU5C"
            onChange={(token) => setRecaptchaToken(token || '')}
          />
        </div>
        {!otpSent && (
          <button
            type="button"
            title="Send OTP"
            onClick={sendOtp}
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
          >
            Send OTP
          </button>
        )}
        {otpSent && (
          <button
            type="button"
            title="Confirm OTP"
            onClick={() => setActiveView('otp')}
            className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            Confirm OTP
          </button>
        )}
      </form>
      <div className="mt-4 text-center">
        <p className="text-white">
          Already have an account?{' '}
          <button onClick={() => { setActiveView('login'); setAlert(null); }} className="text-blue-400 hover:underline"
          title="Login">
            Login
          </button>
        </p>
      </div>
    </div>
  );

  const renderOtp = () => (
    <div className="relative">
      {renderCloseButton()}
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Confirm OTP</h2>
      {alert && <CustomAlert type={alert.type} message={alert.message} />}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="signup-otp" className="block mb-1 text-white">Enter OTP</label>
          <input
            id="signup-otp"
            type="text"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        title="Confirm OTP">
          Confirm OTP
        </button>
      </form>
      {/* Resend OTP button */}
      <p className="text-white">
        Didn't receive an OTP?{' '}
        <button
          onClick={handleResendOtp}
          className="text-white py-2 rounded hover:bg-purple-600 mt-4"
          title="Resend OTP"
        >
          Resend OTP
        </button>
      </p>
    </div>
  );

  const renderForgot = () => (
    <div className="relative">
      {renderCloseButton()}
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
          <button onClick={() => { setActiveView('login'); setAlert(null); }} className="text-blue-400 hover:underline"
          title="Login">
            Login
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {loading && <CustomLoader />}
      {/* Background overlay with a low z-index */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={handleOverlayClick} />
      {/* Modal dialog with a higher z-index */}
      <div className="fixed inset-0 flex items-center justify-center z-30" onClick={stopPropagation}>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md" onClick={stopPropagation}>
          {activeView === 'login' && renderLogin()}
          {activeView === 'signup' && renderSignup()}
          {activeView === 'forgot' && renderForgot()}
          {activeView === 'otp' && renderOtp()}
        </div>
      </div>
    </>
  );
}
