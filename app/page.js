'use client';
import { useEffect, useState } from 'react';
import { db, firestore } from '@/firebase/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'; // Optional for icons
export default function Home() {
  const [poems, setPoems] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: 'How do I submit my own poems?',
      answer: "You can submit your poems through the 'Submit' page, and we'll review and publish them if they meet our guidelines.",
    },
    {
      question: 'Can I request a specific poem?',
      answer: 'We are open to suggestions! Feel free to send us a request via the Contact page.',
    },
    {
      question: 'Is there an age limit to read poems?',
      answer: 'No, our poems are suitable for readers of all ages.',
    },
  ];

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const q = query(collection(db, 'poems'), orderBy('datePosted', 'desc'),limit(4));
        const querySnapshot = await getDocs(q);
  
        console.log('Query Snapshot:', querySnapshot); // Log the snapshot
  
        const fetchedPoems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        console.log('Fetched poems:', fetchedPoems); // Log the poems
  
        setPoems(fetchedPoems);
      } catch (error) {
        console.error('Error fetching poems:', error);
      }
    };
  
    fetchPoems();
  }, []);
  
  

  return (
    <main className="w-full bg-white text-neutral-800">
      {/* Hero Section */}
      <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}>
  {/* Overlay */}
  <div className="absolute inset-0  bg-opacity-60" />

  {/* Content */}
  <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
      Welcome to Thaneshwars World
    </h1>
    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 drop-shadow">
      Discover poems born from the soul—crafted through love, emotion, and lifes reflections.
    </p>
    <div className="flex flex-wrap gap-4 justify-center">
      <Link
        href="/poem"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-base font-medium transition shadow-lg"
      >
        Explore Poems
      </Link>
      <Link
        href="/about"
        className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-full text-base font-medium transition shadow-lg"
      >
        About the Admin
      </Link>
    </div>
  </div>
</section>


      {/* Latest Poems */}

      <section className="relative w-full px-6 py-20 md:px-12 lg:px-20 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 overflow-hidden">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-900 mb-16 tracking-tight">
  Latest Poems
</h2>





  {/* Looping horizontal carousel */}
  <div className="relative overflow-hidden w-full">
    <div
      className="flex w-max gap-6 animate-loop-slide"
      onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
      onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
    >
      {[...poems.slice(0, 4), ...poems.slice(0, 4)].map((poem, index) => (
        <Link
          key={`${poem.id}-${index}`}
          href={`/poem/${poem.slug}`}
          className="min-w-[240px] md:min-w-[280px] lg:min-w-[300px] max-w-xs bg-white rounded-2xl shadow-md p-6 mx-2 transition-transform hover:scale-105 hover:shadow-xl"
        >
          <h3 className="text-lg font-semibold text-indigo-800 mb-2 truncate">
            {poem.title}
          </h3>
          <p className="text-sm text-gray-700 line-clamp-4">{poem.content}</p>
        </Link>
      ))}
    </div>
  </div>

  {/* Animation styles */}
  <style jsx>{`
    @keyframes loop-slide {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    .animate-loop-slide {
      animation: loop-slide 25s linear infinite;
    }
  `}</style>
</section>




     
      {/* Categories */}
      <section className="py-16 px-6 md:px-12 lg:px-32 bg-gradient-to-br from-teal-200 via-purple-200 to-indigo-200">
      <h2 className="text-3xl font-semibold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
  Popular Categories
</h2>

  <div className="flex flex-wrap justify-center gap-4">
    {['Love', 'Nature', 'Life', 'Reflection', 'Spiritual', 'Emotions'].map((cat, idx) => (
      <span
        key={idx}
        className="px-6 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium cursor-pointer transition"
      >
        {cat}
      </span>
    ))}
  </div>
</section>

<section className="w-full px-6 py-20 md:px-12 lg:px-20 bg-gradient-to-br from-indigo-500 via-pink-500 to-purple-600">
  <div className="max-w-xl mx-auto text-center">
    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
      Subscribe to Our Newsletter
    </h2>
    <p className="text-lg text-white mb-8">
      Stay updated with the latest poems and articles directly in your inbox. Never miss out on new content
    </p>
    <form action="#" className="flex flex-col items-center">
    <input
  type="email"
  placeholder="Enter your email"
  className="p-3 w-full max-w-md mb-4 rounded-lg bg-white bg-opacity-80 border border-gray-300 shadow-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>

      <button type="submit" className="bg-indigo-700 text-white px-6 py-3 rounded-full hover:bg-indigo-800 transition">
        Subscribe Now
      </button>
    </form>
  </div>
</section>

      {/* Call to Action */}
      <section className="w-full px-6 py-20 md:px-12 lg:px-20 bg-gradient-to-br from-blue-200 to-blue-400">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-900 mb-16">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6 max-w-3xl mx-auto">
        {faqData.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(index)}
            >
              <h3 className="text-xl md:text-2xl font-semibold text-indigo-700">
                {faq.question}
              </h3>
              <button className="text-indigo-700 text-2xl">
                {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            {openIndex === index && (
              <p className="text-gray-700 text-lg mt-4 transition-all duration-300">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>

      <section className="relative w-full px-6 py-20 md:px-12 lg:px-20 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 overflow-hidden">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-900 mb-16 tracking-tight">
    What Our Readers Say
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <p className="text-lg text-gray-800 mb-4">
        The poems here truly resonate with my emotions. Each piece feels personal, as though the poet is speaking directly to me.
      </p>
      <div className="flex items-center">

        <div>
          <p className="font-semibold text-gray-900">Sarah T.</p>
          <p className="text-sm text-gray-600">Poetry Enthusiast</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-8 rounded-xl shadow-xl">
      <p className="text-lg text-gray-800 mb-4">
        The poetry here is a reflection of the soul. It’s rare to find writing that captures the essence of feelings so perfectly.
      </p>
      <div className="flex items-center">
   
        <div>
          <p className="font-semibold text-gray-900">John M.</p>
          <p className="text-sm text-gray-600">Avid Reader</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-8 rounded-xl shadow-xl">
      <p className="text-lg text-gray-800 mb-4">
        I always find comfort in the words here. The way the poet expresses vulnerability and strength is truly inspiring.
      </p>
      <div className="flex items-center">
       
        <div>
          <p className="font-semibold text-gray-900">Emily R.</p>
          <p className="text-sm text-gray-600">Writer & Artist</p>
        </div>
      </div>
    </div>
  </div>
</section>

    </main>
  );
}
