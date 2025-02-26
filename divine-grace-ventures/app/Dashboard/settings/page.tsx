'use client';

import { useState, useEffect } from 'react';
import CustomAlert from '@/components/CustomAlert';
import CustomLoader from '@/components/CustomLoader';
import { useAuth } from '@/context/AuthContext';

interface SettingsResponse {
  email_notifications: boolean;
  sms_notifications: boolean;
  dark_mode: boolean;
}

export default function DashboardSettings() {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Load initial settings from the API using the logged-in user's ID
  useEffect(() => {
    async function loadSettings() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch('/api/user/settings', {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id
          }
        });
        const data: SettingsResponse = await res.json();
        if (res.ok) {
          setEmailNotifications(data.email_notifications);
          setSmsNotifications(data.sms_notifications);
          setDarkMode(data.dark_mode);
        } else {
          setAlert({ type: 'error', message: data.error || 'Failed to load settings.' });
        }
      } catch (err: any) {
        setAlert({ type: 'error', message: err.message || 'Error loading settings.' });
      }
      setLoading(false);
    }
    loadSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          emailNotifications,
          smsNotifications,
          darkMode,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', message: 'Settings updated successfully.' });
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to update settings.' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Error updating settings.' });
    }
    setLoading(false);
  };

  const handleDeactivateAccount = async () => {
    if (!user) return;
    // Prompt the user with a warning about the irreversible (soft-deactivation) action.
    const confirmDeactivation = window.confirm(
      'WARNING: You are about to deactivate your account. This will disable your access and your data will not be accessible until reactivated. Do you wish to proceed?'
    );
    if (!confirmDeactivation) return;
    setLoading(true);
    try {
      const res = await fetch('/api/user/deactivate', {
        method: 'POST',
        headers: {
          'x-user-id': user.id
        }
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', message: 'Account deactivated successfully.' });
        // Optionally, log the user out or redirect them to a goodbye page.
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to deactivate account.' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Error deactivating account.' });
    }
    setLoading(false);
  };

  if (!user) return <div>Please log in to view your settings.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Settings</h1>
      {loading && <CustomLoader />}
      {alert && <CustomAlert type={alert.type} message={alert.message} />}
      <div className="bg-white dark:bg-gray-800 rounded shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg">Email Notifications</label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="toggle-checkbox"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-lg">SMS Notifications <span className="text-gray-500">(Coming Soon)</span></label>
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={(e) => setSmsNotifications(e.target.checked)}
            className="toggle-checkbox"
            disabled
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-lg">Dark Mode <span className="text-gray-500">(Coming Soon)</span></label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="toggle-checkbox"
            disabled
          />
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button onClick={handleSaveSettings} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
          Save Settings
        </button>
        <button onClick={handleDeactivateAccount} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded">
          Deactivate Account
        </button>
      </div>
    </div>
  );
}
