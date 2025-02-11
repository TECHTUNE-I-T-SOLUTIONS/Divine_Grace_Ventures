// app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleClose = () => {
    // Navigate back without reloading the homepage.
    router.back();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-white text-xl"
          onClick={handleClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <button
              className="text-blue-400 hover:underline"
              onClick={() => {
                // You might navigate to a separate sign-up route,
                // e.g., router.push('/signup')
              }}
            >
              Sign Up
            </button>
          </p>
          <p className="mt-2">
            <button
              className="text-blue-400 hover:underline"
              onClick={() => {
                // Navigate to a forgot-password route or open another modal.
              }}
            >
              Forgot Password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
