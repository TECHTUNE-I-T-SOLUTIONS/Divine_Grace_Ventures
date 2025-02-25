// app/admin/CreateAlert/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash, FaEdit, FaSave, FaPlus } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import CustomLoader from '@/components/CustomLoader';
import CustomAlert from '@/components/CustomAlert';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function CreateAlert() {
  const router = useRouter();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingMessage, setEditingMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('alerts').select('*');
      if (error) throw error;
      setAlerts(data);
    } catch (error) {
      setAlertMessage({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      if (!user) {
        setAlertMessage({ type: 'error', message: 'User not authenticated' });
        return;
      }
      const adminId = user?.id;
      const { error } = await supabase.from('alerts').insert([
        { message: newMessage, admin_id: adminId }
      ]);
      if (error) throw error;
      setNewMessage('');
      setAlertMessage({ type: 'success', message: 'Alert created successfully' });
      fetchAlerts();
    } catch (error) {
      setAlertMessage({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const updateAlert = async (id) => {
    if (!editingMessage.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('alerts').update({ message: editingMessage }).eq('id', id);
      if (error) throw error;
      setEditingId(null);
      setEditingMessage('');
      setAlertMessage({ type: 'success', message: 'Alert updated successfully' });
      fetchAlerts();
    } catch (error) {
      setAlertMessage({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('alerts').delete().eq('id', id);
      if (error) throw error;
      setAlertMessage({ type: 'success', message: 'Alert deleted successfully' });
      fetchAlerts();
    } catch (error) {
      setAlertMessage({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
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
        <button onClick={createAlert} className="bg-blue-500 text-white px-4 py-2 rounded">
          <FaPlus />
        </button>
      </div>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id} className="flex justify-between items-center bg-purple-900 text-white p-3 mb-2 rounded">
            {editingId === alert.id ? (
              <input
                type="text"
                className="border p-2 rounded w-full"
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
                <button onClick={() => { setEditingId(alert.id); setEditingMessage(alert.message); }} className="text-blue-600">
                  <FaEdit />
                </button>
              )}
              <button onClick={() => deleteAlert(alert.id)} className="text-red-600">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
