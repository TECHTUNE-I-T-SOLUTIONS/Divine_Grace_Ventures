// app/dashboard/profile/page.tsx
'use client';

import { useState } from 'react';
import CustomLoader from '@/components/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaLock, FaSave } from 'react-icons/fa';

// Define types for the profile data
interface Payload {
  full_name: string;
  phone: string;
  address: string;
  password?: string;
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email] = useState(user?.email || ''); // email is not editable
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password && password !== confirmPassword) {
      setAlertMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    const payload: Payload = { full_name: fullName, phone, address };
    if (password) payload.password = password;

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'user-id': user?.id || '' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlertMessage(data.error || 'Failed to update profile');
      } else {
        setAlertMessage('Profile updated successfully');
        // Update auth context with new details.
        setUser({ ...user, full_name: fullName, phone, address });
      }
    } catch (err: Error) {
      setAlertMessage(err.message);
    }
    setLoading(false);
  };

  if (!user) return <CustomLoader />;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gradient-to-b from-indigo-800 to-purple-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">
        <FaUser className="mr-2" /> My Profile
      </h2>
      {alertMessage && <div className="mb-4 text-red-500">{alertMessage}</div>}
      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            <FaUser className="inline mr-1" /> Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="text-black w-full border rounded p-2"
            placeholder="Enter your full name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            <FaEnvelope className="inline mr-1" /> Email (not editable)
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="text-black w-full border rounded p-2 bg-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            <FaPhone className="inline mr-1" /> Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="text-black w-full border rounded p-2"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            <FaHome className="inline mr-1" /> Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="text-black w-full border rounded p-2"
            placeholder="Enter your address"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            <FaLock className="inline mr-1" /> New Password (leave blank to keep unchanged)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black w-full border rounded p-2"
            placeholder="Enter new password"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            <FaLock className="inline mr-1" /> Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-black w-full border rounded p-2"
            placeholder="Confirm new password"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          <FaSave className="mr-2" /> Save Changes
        </button>
      </form>
    </div>
  );
}
