'use client';
import { useState } from 'react';
import { auth, db, googleProvider } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email,
        name,
        role: 'user',
        createdAt: new Date()
      });
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = doc(db, 'users', result.user.uid);
      await setDoc(userDoc, {
        email: result.user.email,
        name: result.user.displayName,
        role: 'user',
        createdAt: new Date()
      }, { merge: true });
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 px-4 py-8">
<div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden min-h-[70vh]">


        {/* Left Signup Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">Join Us 🎉</h1>
          <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">Create your account to get started</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
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
            <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
              Sign Up
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Or sign up using</p>
            <button
              onClick={handleGoogleSignup}
              className="mt-3 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
            >
              Sign up with Google
            </button>

            {/* Already have an account */}
            <p className="mt-6 text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Right Image Panel */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100 p-6">
          <img
            src="/assets/signup.svg"
            alt="Signup Illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
