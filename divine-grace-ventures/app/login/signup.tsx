'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import CustomAlert from '@/components/CustomAlert';
import CustomLoader from '@/components/CustomLoader';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        body: JSON.stringify({ email, username: email.split('@')[0], password, recaptchaToken, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Failed to send OTP.' });
        setLoading(false);
        return;
      }
      setAlert({ type: 'info', message: 'OTP sent to your email/phone.' });
      setOtpSent(true);
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
      setAlert({ type: 'success', message: 'Signup successful! Redirecting...' });
      setTimeout(() => {
        setLoading(false);
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Signup error.' });
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <CustomLoader />}
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {alert && <CustomAlert type={alert.type} message={alert.message} />}
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
            <label htmlFor="signup-phone" className="block mb-1">Phone Number</label>
            <input
              id="signup-phone"
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +234xxxxxxxxxx"
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
          {/* Google reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6Lcq9tUqAAAAAMPhI0XmKhFm6nNmxaWCtbuElU5C"
              onChange={(token) => setRecaptchaToken(token || '')}
            />
          </div>
          {/* Send OTP Button */}
          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
            >
              Send OTP
            </button>
          )}
          {/* OTP Input */}
          {otpSent && (
            <div>
              <label htmlFor="signup-otp" className="block mb-1">Enter OTP</label>
              <input
                id="signup-otp"
                type="text"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
