'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaTrash, FaEdit, FaSave, FaPlus } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { createClient, PostgrestError } from '@supabase/supabase-js';
import CustomLoader from '@/components/CustomLoader';
import CustomAlert from '@/components/CustomAlert';

// Define the Alert type to match your Supabase table structure
type Alert = {
  id: number;
  message: string;
  admin_id: string;
  created_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Alert message type for success/error UI feedback
type AlertMessage = { type: 'success' | 'error'; message: string };

export default function CreateAlert() {
  const { user } = useAuth();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingMessage, setEditingMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

  // Move handleSupabaseError to useCallback to stabilize it
  const handleSupabaseError = useCallback((error: unknown) => {
    if (isPostgrestError(error)) {
      setAlertMessage({ type: 'error', message: error.message });
    } else {
      setAlertMessage({ type: 'error', message: 'An unexpected error occurred.' });
    }
  }, []);

  // Wrap fetchAlerts in useCallback to stabilize it
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('alerts').select('*');
      if (error) throw error;
      setAlerts(data as Alert[]);
    } catch (error) {
      handleSupabaseError(error);
    } finally {
      setLoading(false);
    }
  }, [handleSupabaseError]); // ✅ Added handleSupabaseError to the dependencies

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]); // ✅ Now safe

  const createAlert = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      if (!user) {
        setAlertMessage({ type: 'error', message: 'User not authenticated' });
        return;
      }
      const adminId = user.id;
      const { error } = await supabase.from('alerts').insert([
        { message: newMessage, admin_id: adminId }
      ]);
      if (error) throw error;
      setNewMessage('');
      setAlertMessage({ type: 'success', message: 'Alert created successfully' });
      fetchAlerts();
    } catch (error) {
      handleSupabaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAlert = async (id: number) => {
    if (!editingMessage.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ message: editingMessage })
        .eq('id', id);
      if (error) throw error;
      setEditingId(null);
      setEditingMessage('');
      setAlertMessage({ type: 'success', message: 'Alert updated successfully' });
      fetchAlerts();
    } catch (error) {
      handleSupabaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('alerts').delete().eq('id', id);
      if (error) throw error;
      setAlertMessage({ type: 'success', message: 'Alert deleted successfully' });
      fetchAlerts();
    } catch (error) {
      handleSupabaseError(error);
    } finally {
      setLoading(false);
    }
  };

  // Type guard to check if error is a PostgrestError
  const isPostgrestError = (error: unknown): error is PostgrestError => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      'details' in error &&
      'hint' in error &&
      'code' in error
    );
  };

  return (
    <div className="p-6">
      {loading && <CustomLoader />}
      {alertMessage && <CustomAlert type={alertMessage.type} message={alertMessage.message} />}
      <h1 className="text-2xl text-white text-center font-bold mb-4">Manage Alerts</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Enter new alert message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={createAlert} className="bg-blue-500 text-white px-4 py-2 rounded" title="Create Alert">
          <FaPlus />
        </button>
      </div>
      <ul>
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="flex justify-between items-center bg-purple-900 text-white p-3 mb-2 rounded"
          >
            {editingId === alert.id ? (
              <input
                type="text"
                className="border text-black p-2 rounded w-full"
                value={editingMessage}
                onChange={(e) => setEditingMessage(e.target.value)}
              />
            ) : (
              <span>{alert.message}</span>
            )}
            <div className="flex space-x-2">
              {editingId === alert.id ? (
                <button onClick={() => updateAlert(alert.id)} className="text-green-600">
                  <FaSave />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(alert.id);
                    setEditingMessage(alert.message);
                  }}
                  className="text-blue-600"
                  title="Edit the Alert"
                >
                  <FaEdit />
                </button>
              )}
              <button onClick={() => deleteAlert(alert.id)} className="text-red-600" title="Delete the Alert">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
