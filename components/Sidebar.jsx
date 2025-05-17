'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function SidebarWithToggler({ closeSidebar }) {
  const [poems, setPoems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchPoems() {
      const snapshot = await getDocs(collection(db, 'poems'));
      const list = snapshot.docs.map(doc => doc.data());
      setPoems(list);
    }
    fetchPoems();
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
      closeSidebar?.();
    }
  };

  return (
    <>
      {/* Toggler Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-300 h-12 flex items-center px-4 shadow-sm md:hidden">
  <button
    onClick={() => setIsOpen(true)}
    className="text-gray-700 hover:text-black focus:outline-none"
    aria-label="Open Sidebar"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
    </svg>
  </button>
  <span className="ml-4 text-gray-800 font-semibold text-base">All Poems</span>
</div>

{/* Overlay (Backdrop Blur only applied here) */}
{isOpen && (
  <div
    className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm md:hidden"
    onClick={() => setIsOpen(false)}
  />
)}

{/* Sidebar */}
<aside
  className={`fixed md:static top-0 left-0 z-50 md:z-10 h-full md:h-[calc(100vh)] w-64 bg-gray-200 shadow-md border-r border-gray-300 transition-transform duration-300 transform hover:shadow-blue-500/50 ${
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  }`}
>
  <div className="flex justify-between items-center px-4 py-3 md:hidden border-b border-gray-300">
    <span className="text-lg font-semibold text-gray-800">All Poems</span>
    <button
      onClick={() => setIsOpen(false)}
      className="text-gray-600 hover:text-black"
      aria-label="Close Sidebar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <div className="hidden md:block px-4 pt-4 pb-2">
    <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">All Poems</h2>
  </div>

  <ul className="p-4 space-y-2">
    {poems.map(poem => (
      <li key={poem.slug}>
        <Link
          href={`/poem/${poem.slug}`}
          onClick={handleLinkClick}
          className="block py-1 px-2 text-gray-800 hover:bg-blue-500 hover:text-white rounded transition duration-200"
        >
          {poem.title}
        </Link>
      </li>
    ))}
  </ul>
</aside>


    </>
  );
}
