'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase/firebase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const formatDate = (timestampMs) => {
  const date = new Date(timestampMs);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  hours = hours.toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
};

export default function PoemSlugPage({ params }) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  const auth = getAuth();
  const user = auth.currentUser;

  const [poem, setPoem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoem = async () => {
      const poemQuery = query(
        collection(db, 'poems'),
        where('slug', '==', decodedSlug)
      );
      const snapshot = await getDocs(poemQuery);
      if (snapshot.empty) return notFound();
      const poemData = snapshot.docs[0].data();
      setPoem(poemData);
    };
    fetchPoem();
  }, [decodedSlug]);

  useEffect(() => {
    loadInitialComments();
  }, [decodedSlug]);

  const loadInitialComments = async () => {
    const commentQuery = query(
      collection(db, 'comments'),
      where('poemSlug', '==', decodedSlug),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    const snapshot = await getDocs(commentQuery);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments(data);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === 10);
    setLoading(false);
  };

  const loadMoreComments = async () => {
    if (!lastVisible) return;
    const nextQuery = query(
      collection(db, 'comments'),
      where('poemSlug', '==', decodedSlug),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(10)
    );
    const snapshot = await getDocs(nextQuery);
    const newComments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments((prev) => [...newComments, ...prev]);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === 10);
  };

  const handleDeleteComment = async (commentId) => {
    const confirm = window.confirm('Are you sure you want to delete this comment?');
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user) return;

    let authorName = user.displayName || 'Anonymous';

    if (user) {
      try {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
    
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
    
          // Show updated name, or registered name, or fallback
          if (userData.name && userData.name.trim() !== '') {
            authorName = userData.name;
          } else if (user.displayName && user.displayName.trim() !== '') {
            authorName = user.displayName;
          } else {
            authorName = 'Anonymous';
          }
        }
      } catch (error) {
        console.error('Error fetching user data from Firestore:', error);
      }
    }

    await addDoc(collection(db, 'comments'), {
      poemSlug: decodedSlug,
      content: newComment.trim(),
      author: authorName,
      timestamp: Timestamp.now(),
      userId: user.uid,
    });

    setNewComment('');
    loadInitialComments();
  };

  if (!poem) return <p className="pt-20 px-4">Loading...</p>;

  return (
    <div className="pt-0 px-4 sm:px-6 lg:px-8 w-full font-['Inter']">
    <Link 
      href="/poem" 
      className="text-blue-700 hover:text-blue-900 transition-all duration-300 
                 text-sm mb-4 inline-flex items-center gap-2 
                 hover:shadow-[0_0_35px_rgba(29,78,216,0.65)] 
                 bg-white/50 backdrop-blur-sm
                 rounded-md px-4 py-2 font-medium
                 hover:bg-white/80"
    >
      <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span> 
      Back to All Poems
    </Link>

    <div className="bg-white p-8 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] mb-6 w-full 
                  hover:shadow-[0_8px_40px_rgba(29,78,216,0.45),0_0_80px_rgba(29,78,216,0.25)] 
                  transition-all duration-500 ease-out
                  hover:translate-y-[-2px]">
      <h1 className="text-4xl font-bold text-gray-900 mb-3 font-['Merriweather']">{poem.title}</h1>
        <p className="text-sm text-gray-600 mb-2 font-medium">by {poem.author}</p>
        {poem.datePosted && (
          <p className="text-xs text-gray-500 mb-6">
            Posted on {formatDate(poem.datePosted.seconds * 1000)}
          </p>
        )}
        <pre className="whitespace-pre-wrap text-lg text-gray-800 mb-4 font-['Merriweather'] leading-relaxed">
          {poem.content}
        </pre>
      </div>

      <div className="mt-8 bg-white p-8 rounded-xl 
                  shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-full 
                  hover:shadow-[0_8px_40px_rgba(29,78,216,0.45),0_0_80px_rgba(29,78,216,0.25)] 
                  transition-all duration-500 ease-out
                  hover:translate-y-[-2px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Merriweather']">Add a Comment</h2>
      {user ? (
        <>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-600 
                     focus:shadow-[0_0_35px_rgba(29,78,216,0.4)]
                     hover:shadow-[0_4px_20px_rgba(29,78,216,0.25)]
                     transition-all duration-300 text-gray-700 font-medium"
            rows={4}
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-3 px-8 py-3 bg-blue-600 text-white rounded-lg
                     font-semibold tracking-wide
                     hover:bg-blue-700 
                     hover:shadow-[0_0_40px_rgba(29,78,216,0.8),0_0_120px_rgba(29,78,216,0.4)] 
                     active:shadow-[0_0_20px_rgba(29,78,216,0.9)]
                     transform hover:-translate-y-1 active:translate-y-0
                     transition-all duration-300 ease-out
                     focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newComment.trim()}
          >
            Post Comment
          </button>
        </>
      ) : (
        <p className="text-gray-600 font-medium">Please log in to leave a comment.</p>
      )}
    </div>

    <div className="mt-8 bg-white p-8 rounded-xl 
                  shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-full 
                  hover:shadow-[0_8px_40px_rgba(29,78,216,0.45),0_0_80px_rgba(29,78,216,0.25)] 
                  transition-all duration-500 ease-out
                  hover:translate-y-[-2px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Merriweather']">All Comments</h2>
      {loading ? (
        <p className="text-gray-600 font-medium">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-600 font-medium">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
        <div 
        key={comment.id} 
        className="bg-gray-50 p-6 rounded-lg
                 shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                 hover:shadow-[0_8px_25px_rgba(29,78,216,0.25)]
                 transform hover:-translate-y-1
                 transition-all duration-300 ease-out"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900">{comment.author}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(comment.timestamp.seconds * 1000)}
            </p>
          </div>
          {user?.uid === comment.userId && (
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-600 hover:text-red-800
                       px-4 py-2 rounded-lg font-medium
                       hover:bg-red-50
                       hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]
                       transform hover:-translate-y-0.5
                       transition-all duration-300 ease-out"
            >
              Delete
            </button>
          )}
        </div>
        <p className="mt-3 text-gray-700 leading-relaxed">{comment.content}</p>
      </div>
          ))}
          {hasMore && (
            <button
              onClick={loadMoreComments}
              className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg
                       font-semibold tracking-wide w-full sm:w-auto
                       hover:bg-blue-700 
                       hover:shadow-[0_0_40px_rgba(29,78,216,0.8),0_0_120px_rgba(29,78,216,0.4)]
                       active:shadow-[0_0_20px_rgba(29,78,216,0.9)]
                       transform hover:-translate-y-1 active:translate-y-0
                       transition-all duration-300 ease-out
                       focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Load More Comments
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);
          }