'use client';

import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import CustomLoader from '@/components/CustomLoader';

// Define the shape of a feedback item (match this to your actual API response)
type Feedback = {
  user_id: string;
  message: string;
  created_at: string;
};

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]); // Typed useState
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('/api/feedback');
        const data = await res.json();
        if (res.ok) {
          setFeedbacks(data.data); // Ensure your API returns data shaped like Feedback[]
        } else {
          console.error('Error fetching feedbacks:', data.error);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
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
    <div className="p-1 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 text-center">User Feedback</h1>
      <div className="overflow-x-auto shadow-md rounded-lg bg-white p-1">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-purple-700 text-white text-xs sm:text-sm">
            <tr>
              <th className="px-2 sm:px-3 py-2 text-left">#</th>
              <th className="px-2 sm:px-3 py-2 text-left">User</th>
              <th className="px-2 sm:px-3 py-2 text-left">Message</th>
              <th className="px-2 sm:px-3 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            {feedbacks.map((feedback, index) => (
              <tr key={`${feedback.user_id}-${feedback.created_at}`} className="hover:bg-gray-100 transition-all">
                <td className="border-t border-gray-300 px-2 sm:px-2 py-2 text-sm font-semibold text-gray-700">
                  {index + 1}
                </td>
                <td className="border-t border-gray-300 px-1 sm:px-1 py-2">
                  <div className="flex items-center space-x-2 text-sm sm:text-lg">
                    <FaUser size={18} className="text-indigo-600" />
                    <span className="text-xs sm:text-sm text-gray-800">{feedback.user_id}</span>
                  </div>
                </td>
                <td className="border-t border-gray-300 px-4 sm:px-6 py-3 text-gray-800">
                  <p className="truncate max-w-xs">{feedback.message}</p>
                </td>
                <td className="border-t border-gray-300 px-4 sm:px-6 py-3 text-gray-600">
                  <span className="text-xs sm:text-sm">
                    {new Date(feedback.created_at).toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
