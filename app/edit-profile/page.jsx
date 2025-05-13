'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase';
import { updateProfile, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/'); // 🔒 Redirect to homepage if not logged in
        return;
      }

      setUser(currentUser);
      setEmail(currentUser.email || '');

      // Fetch user name from Firestore
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setName(userDoc.data().name || '');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!user) return;
      await updateProfile(user, { displayName: name });
      await updateDoc(doc(db, 'users', user.uid), { name });

      alert('Profile updated!');
      router.push('/poem');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action is permanent.');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid)); // Remove from Firestore
      await deleteUser(user); // Remove from Firebase Auth
      alert('Account deleted.');
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading...</p>;

  return (
    <div className="max-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-gray-300 bg-gray-100 text-gray-600 p-3 rounded-md cursor-not-allowed"
            />
          </div>

          {/* Name (Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
          >
            Save Changes
          </button>
        </form>

        <div className="border-t mt-8 pt-6">
          <p className="text-sm text-gray-500 mb-3 text-center">Want to leave?</p>
          <button
            onClick={handleDelete}
            className="w-full border border-red-500 text-red-600 py-3 rounded-md hover:bg-red-50 transition duration-200 font-medium"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
