'use client';
import { useState } from 'react';
import { auth, googleProvider } from '../../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back 👋</h1>
        <p className="text-center text-gray-500 mb-6">Please login to your account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <div className="text-right">
            <button
              type="button"
              onClick={() => router.push('/reset-password')}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">Or continue with</p>
          <button
            onClick={handleGoogleLogin}
            className="mt-3 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}
