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
  const [sortOption, setSortOption] = useState('newest');
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getOrderConfig = (option) => {
    switch (option) {
      case 'oldest':
        return { field: 'datePosted', direction: 'asc' };
      case 'alphabetical':
        return { field: 'title', direction: 'asc' };
      case 'newest':
      default:
        return { field: 'datePosted', direction: 'desc' };
    }
  };

  const fetchPoems = async (isInitial = false) => {
    setLoading(true);
    const { field, direction } = getOrderConfig(sortOption);

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
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-600 
                 hover:border-blue-400 transition-all duration-300
                 bg-white shadow-sm hover:shadow-[0_2px_15px_rgba(29,78,216,0.15)]
                 cursor-pointer font-medium text-gray-700"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="alphabetical">A-Z Title</option>
      </select>
        </div>
      </div>

      {/* Poems */}
      <div className="mt-32 md:mt-16 space-y-6 px-4">
  {poems.map(poem => (
    <div
      key={poem.id}
      className="border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:shadow-blue-500 hover:translate-y-2 transition-all duration-300 p-5 bg-white"
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
