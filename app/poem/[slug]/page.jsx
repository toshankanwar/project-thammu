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

    if (!user.displayName) {
      try {
        const userDoc = await getDocs(
          query(collection(db, 'users'), where('uid', '==', user.uid))
        );
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          authorName = userData.name || 'Anonymous';
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
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
    <div className="pt-0 px-4 sm:px-6 lg:px-8 w-full">
      <Link href="/poem" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← Back to All Poems
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{poem.title}</h1>
        <p className="text-sm text-gray-500 mb-2">by {poem.author}</p>
        {poem.datePosted && (
          <p className="text-xs text-gray-400 mb-4">
            Posted on {formatDate(poem.datePosted.seconds * 1000)}
          </p>
        )}
        <pre className="whitespace-pre-wrap text-lg text-gray-800 mb-4">
          {poem.content}
        </pre>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Add a Comment</h2>
        {user ? (
          <>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Post Comment
            </button>
          </>
        ) : (
          <p className="text-gray-500">Please log in to leave a comment.</p>
        )}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">All Comments</h2>
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{comment.author}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.timestamp.seconds * 1000)}
                    </p>
                  </div>
                  {user?.uid === comment.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:underline text-sm ml-4"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
              </div>
            ))}
            {hasMore && (
              <button
                onClick={loadMoreComments}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
