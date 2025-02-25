'use client'; 

import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import CustomLoader from '@/components/CustomLoader'; // Assuming your custom loader component is here

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('/api/feedback');
        const data = await res.json();
        if (res.ok) {
          setFeedbacks(data.data);
        } else {
          console.error("Error fetching feedbacks:", data.error);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold text-white mb-6 text-center">User Feedback</h1>
      <div className="overflow-x-auto shadow-md rounded-lg bg-white p-4">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-purple-700 text-white text-lg">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Message</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={feedback.created_at} className="hover:bg-gray-100 transition-all">
                <td className="border-t border-gray-300 px-6 py-3 text-lg font-semibold text-gray-700">
                  {index + 1}
                </td>
                <td className="border-t border-gray-300 px-6 py-3">
                  <div className="flex items-center space-x-2 text-lg">
                    <FaUser size={20} className="text-indigo-600" />
                    <span className="font-semibold text-gray-800">{feedback.user_id}</span>
                  </div>
                </td>
                <td className="border-t border-gray-300 px-6 py-3 text-gray-800">
                  <p className="truncate max-w-xs">{feedback.message}</p>
                </td>
                <td className="border-t border-gray-300 px-6 py-3 text-gray-600">
                  <span className="text-sm">{new Date(feedback.created_at).toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
