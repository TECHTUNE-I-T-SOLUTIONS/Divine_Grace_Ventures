// lib/api/auth.ts

export async function signupUser({ email, username, password, recaptchaToken, phone }: {
  email: string,
  username: string,
  password: string,
  recaptchaToken: string,
  phone: string
}) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password, recaptchaToken, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

export async function verifyOtp({ email, otp }: { email: string; otp: string; }) {
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'OTP verification failed');
  return data;
}

export async function loginUser({ email, password }: { email: string; password: string; }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}
