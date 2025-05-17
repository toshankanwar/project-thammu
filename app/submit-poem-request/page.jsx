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
        userName: name,    
        userId: user.uid,       
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
    <div className="max-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Submit Your Poem
        </h1>
        
        <div className="space-y-4">
          <div className="transition-all duration-200 hover:transform hover:-translate-y-0.5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="transition-all duration-200 hover:transform hover:-translate-y-0.5">
            <input
              type="text"
              placeholder="Poem Title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value.toLowerCase());
              }}
            />
          </div>

          <div className="transition-all duration-200 hover:transform hover:-translate-y-0.5">
            <textarea
              placeholder="Poem Content"
              className="w-full border border-gray-300 rounded-lg p-3 h-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 resize-none"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold 
                     transform transition-all duration-200 
                     hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Poem
          </button>

          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-center">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
