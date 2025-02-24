'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function AdminProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/admin/profile', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.admin) {
          setProfile(data.admin);
          setFullName(data.admin.full_name || '');
          setPhone(data.admin.phone || '');
        } else {
          setAlertMessage(data.error || 'Failed to load profile');
        }
      } catch (err: any) {
        setAlertMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password && password !== confirmPassword) {
      setAlertMessage('Passwords do not match');
      setLoading(false);
      return;
    }
    const payload: any = { full_name: fullName, phone };
    if (password) payload.password = password;
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlertMessage(data.error || 'Failed to update profile');
      } else {
        setAlertMessage('Profile updated successfully');
        // Update the AuthContext with new details
        setUser({ ...user, full_name: fullName, phone });
      }
    } catch (err: any) {
      setAlertMessage(err.message);
    }
    setLoading(false);
  };

  if (loading) return <CustomLoader />;
  if (!profile) return <div>{alertMessage || 'No profile data'}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gradient-to-b from-indigo-800 to-purple-800 rounded shadow">
      <h2 className="text-2xl text-white justify-center font-bold mb-4 flex items-center">
        <FaUser className="mr-2" /> Admin Profile
      </h2>
      {alertMessage && <div className="mb-4 text-red-500">{alertMessage}</div>}
      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label className="block mb-1 text-white font-semibold">
            <FaUser className="inline mr-1" /> Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter your full name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white font-semibold">
            <FaEnvelope className="inline mr-1" /> Email (not editable)
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full border rounded p-2 bg-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white font-semibold">
            <FaPhone className="inline mr-1" /> Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white font-semibold">
            <FaLock className="inline mr-1" /> New Password (leave blank to keep unchanged)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter new password"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white font-semibold">
            <FaLock className="inline mr-1" /> Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded p-2"
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
