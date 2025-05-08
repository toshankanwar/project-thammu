'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Simple email format validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!isValidEmail(email)) {
      setError('❌ Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Password reset email sent! Please check your inbox.');
      setEmail('');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('❌ No user registered with that email.');
      } else {
        setError(err.message || '❌ Failed to send reset email.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-8 md:py-10 h-full">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">

        {/* Left: Reset Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              Reset Password 🔐
            </h1>
            <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
              Enter your email to receive a password reset link.
            </p>

            {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:underline"
              >
                Go to Login
              </button>
            </p>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100 p-6">
          <img
            src="/assets/reset-password.svg"
            alt="Reset Illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
