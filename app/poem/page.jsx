'use client';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import Link from 'next/link';

export default function PoemPage() {
  const [poems, setPoems] = useState([]);
  const [sortOption, setSortOption] = useState('date');
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getOrderField = (option) => {
    switch (option) {
      case 'views': return 'views';
      case 'likes': return 'likes';
      case 'title': return 'title';
      case 'date':
      default: return 'datePosted';
    }
  };

  const getOrderDirection = (option) => {
    return option === 'title' ? 'asc' : 'desc';
  };

  const fetchPoems = async (isInitial = false) => {
    setLoading(true);
    const field = getOrderField(sortOption);
    const direction = getOrderDirection(sortOption);

    let q = query(
      collection(db, 'poems'),
      orderBy(field, direction),
      limit(10)
    );

    if (!isInitial && lastVisible) {
      q = query(
        collection(db, 'poems'),
        orderBy(field, direction),
        startAfter(lastVisible),
        limit(10)
      );
    }

    const snapshot = await getDocs(q);
    const fetchedPoems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (isInitial) {
      setPoems(fetchedPoems);
    } else {
      setPoems(prev => [...prev, ...fetchedPoems]);
    }

    const last = snapshot.docs[snapshot.docs.length - 1];
    setLastVisible(last);
    setHasMore(snapshot.docs.length === 10);
    setLoading(false);
  };

  useEffect(() => {
    setLastVisible(null);
    setPoems([]);
    setHasMore(true);
    fetchPoems(true);
  }, [sortOption]);

  const getPoemPreview = (content) => {
    return content?.length > 100 ? content.slice(0, 100) + "..." : content;
  };

  return (
    <div className="pt-0 md:pl-0 max-w-5xl mx-auto">
      {/* Sorting Bar */}
      <div className="fixed top-[7rem] md:top-16 md:left-72 left-0 right-0 bg-white z-40 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center text-sm font-medium">
          <span className="text-gray-700">Sort By:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="date">Newest</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
            <option value="title">A-Z Title</option>
          </select>
        </div>
      </div>

      {/* Poems */}
      <div className="mt-32 md:mt-16 space-y-6 px-4">
        {poems.map(poem => (
          <div
            key={poem.id}
            className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 p-5 bg-white"
          >
            <Link href={`/poem/${poem.slug}`}>
              <h2 className="text-xl font-semibold text-gray-900 hover:underline mb-1">
                {poem.title}
              </h2>
            </Link>
            <p className="text-sm text-gray-600">
              by <span className="font-medium">{poem.author}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Posted on {poem.datePosted?.toDate().toLocaleDateString()}
            </p>

            {/* Poem Preview */}
            <p className="text-sm text-gray-700 mt-2">
              {getPoemPreview(poem.content)}
            </p>

            <Link href={`/poem/${poem.slug}`}>
              <button className="mt-3 text-sm text-blue-600 hover:underline">
                Read More
              </button>
            </Link>
          </div>
        ))}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={() => fetchPoems(false)}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
