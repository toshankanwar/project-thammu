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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Join Us 🎉</h1>
        <p className="text-center text-gray-500 mb-6">Create your account to get started</p>

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
        </div>
      </div>
    </div>
  );
}
