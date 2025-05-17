'use client';
import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // ✅ use serverTimestamp
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function SubmitPoemRequestPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const auth = getAuth();

  // ✅ Wait for auth state to load properly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!title || !content || !name) {
      setMessage('All fields are required.');
      return;
    }

    if (!user) {
      setMessage('You must be logged in to submit a poem.');
      return;
    }

    try {
      await addDoc(collection(db, "poemRequests"), {
        title,
        content,
        userName: name,        // ✅ use `name` correctly
        userId: user.uid,       // ✅ use current user's ID
        timestamp: serverTimestamp(),
        status: "pending",
      });
      setMessage('Poem request submitted successfully!');
      setTitle('');
      setContent('');
      setName('');
    } catch (err) {
      console.error("Failed to submit poem:", err);
      setMessage('Failed to submit poem. Check console for details.');
    }
  };

  if (user === null) {
    return <p className="text-center mt-10">Checking login status...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Your Poem</h1>
      <input
        type="text"
        placeholder="Your Name"
        className="w-full border p-2 mb-3"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Poem Title"
        className="w-full border p-2 mb-3"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Poem Content"
        className="w-full border p-2 mb-3 h-40"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Request
      </button>
      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
    </div>
  );
}
