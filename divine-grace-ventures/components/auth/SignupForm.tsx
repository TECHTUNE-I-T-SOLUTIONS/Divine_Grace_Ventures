'use client';

import CustomAlert from '../CustomAlert';

interface SignupFormProps {
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  otpSent: boolean;
  setOtpSent: (val: boolean) => void;
  setActiveView: (val: 'login' | 'signup' | 'forgot' | 'otp') => void;
  alert: { type: 'error' | 'success' | 'info'; message: string } | null;
  setAlert: (alert: { type: 'error' | 'success' | 'info'; message: string } | null) => void;
  setLoading: (val: boolean) => void;
}

export default function SignupForm({
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  otpSent,
  setOtpSent,
  setActiveView,
  alert,
  setAlert,
  setLoading,
}: SignupFormProps) {
  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username: email.split('@')[0],
          password,
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
      setActiveView('otp');
    } catch (error: unknown) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Sign Up</h2>
      {alert && <CustomAlert type={alert.type} message={alert.message} />}
      <form className="space-y-4">
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
          <label htmlFor="signup-phone" className="block mb-1 text-white">Phone Number (include country code)</label>
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
        {!otpSent && (
          <button
            type="button"
            onClick={sendOtp}
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
          >
            Send OTP
          </button>
        )}
        {otpSent && (
          <button
            type="button"
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
          <button onClick={() => { setActiveView('login'); setAlert(null); }} className="text-blue-400 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
