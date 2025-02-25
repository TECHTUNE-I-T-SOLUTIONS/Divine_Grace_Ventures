'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import ChatWidget from '@/components/ChatWidget';
import { FaComments, FaFeatherAlt } from 'react-icons/fa'; // Add Feather icon for feedback
import { useAuth } from '@/context/AuthContext'; // Import AuthContext
import CustomAlert from '@/components/CustomAlert'; // Import CustomAlert
import CustomLoader from '@/components/CustomLoader'; // Import CustomLoader

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);  // State to handle feedback modal
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');  // State for feedback message
  const [isLoading, setIsLoading] = useState(false);  // State for loading indicator
  const [alertMessage, setAlertMessage] = useState<string | null>(null);  // State for alerts
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);  // State for alert type

  const { user, loading } = useAuth();  // Get user from AuthContext

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }

    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('contextmenu', handleRightClick);

    return () => {
      window.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleChat = () => {
    setChatOpen((prev) => !prev);
  };

  const toggleFeedback = () => {
    setFeedbackOpen((prev) => !prev);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleSubmitFeedback = async () => {
    if (loading || !user) {
      setAlertMessage('You must be logged in to submit feedback.');
      return;
    }

    if (feedbackMessage.trim() === '') {
      setAlertMessage('Please provide feedback before submitting.');
      return;
    }

    try {
      setIsLoading(true); // Start loading

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,  // Send user ID from AuthContext
          message: feedbackMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setAlertMessage('Feedback submitted successfully!');
      setFeedbackMessage('');
      setFeedbackOpen(false); // Close feedback modal
    } catch (error) {
      setAlertMessage('Error submitting feedback: ' + error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative">
      {/* Header */}
      <DashboardHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden md:block h-84 w-46">
          <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        {/* Main Content */}
        <main className="flex-1 p-6" onClick={closeContextMenu}>
          {children}
        </main>
      </div>
      
      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      )}
      
      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-blue-500 p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Customer Support Chat"
        >
          <FaComments size={24} className="text-white" />
        </button>
      </div>

      {/* Floating Feedback Widget */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleFeedback}
          className="bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          title="Give Feedback"
        >
          <FaFeatherAlt size={24} className="text-white" />
        </button>
      </div>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="fixed bottom-16 right-6 z-50 bg-transparent rounded-lg shadow-lg w-80 p-4">
          <ChatWidget closeChat={toggleChat} />
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackOpen && ( 
        <div className="fixed inset-0 bg-black bg-opacity-90 z-40 flex justify-center items-center">
          <div className="bg-indigo-700 text-black p-5 rounded-lg w-96 h-auto">
            <h3 className="text-xl text-white text-center font-bold">Provide Your Feedback</h3>
            <textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)} // Update feedback message
              className="w-full items-left bg-gray-100 p-2 mt-2 border rounded-lg h-32"
              placeholder="What should we improve? What are your comments?..."></textarea>
            <div className="mt-4 flex justify-between">
              <button onClick={toggleFeedback} className="bg-gray-800 text-white p-2 rounded-lg hover:bg-blue-600 hover:text-black">Close</button>
              <button onClick={handleSubmitFeedback} className="bg-white text-black p-2 rounded-lg hover:bg-red-600 hover:text-white">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-white text-black rounded shadow-lg p-2"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={closeContextMenu}
        >
          <ul className="space-y-2">
            <li>
              <Link href="/Dashboard/profile">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Profile</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard/settings">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Settings</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard/cart">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Cart</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Home</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard/orders">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Orders</button>
              </Link>
            </li>
            <li>
              <Link href="/Dashboard/transaction">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-500">Transactions</button>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Display alert message */}
      {alertMessage && <CustomAlert message={alertMessage} type={alertType} />}
      {/* Show loader if submitting */}
      {isLoading && <CustomLoader />}
    </div>
  );
}
