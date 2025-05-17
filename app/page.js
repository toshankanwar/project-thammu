'use client';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import 'animate.css'; // Ensure animate.css is imported for animations

export default function Home() {
  const [poems, setPoems] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [inView, setInView] = useState(false);
  const [isInView, setIsInView] = useState(false);
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
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.3 }
    );

    const target = document.getElementById('testimonials-section');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const q = query(collection(db, 'poems'), orderBy('datePosted', 'desc'), limit(4));
        const querySnapshot = await getDocs(q);

        const fetchedPoems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPoems(fetchedPoems);
      } catch (error) {
        console.error('Error fetching poems:', error);
      }
    };

    fetchPoems();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.3 }
    );

    const target = document.getElementById('latest-poems-section');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);
  return (
    <main className="w-full bg-white text-neutral-800">
      {/* Hero Section */}
      <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}>
        <div className="absolute inset-0 bg-opacity-60" />
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 animate__animated animate__fadeInDown animate__delay-0.1s">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Welcome to Thaneshwars World
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 drop-shadow">
            Discover poems born from the soul—crafted through love, emotion, and life's reflections.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
          <Link
  href="/poem"
  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full text-base font-medium transition-all duration-200 ease-in-out transform hover:scale-105"
>
  Explore Poems
</Link>

<Link
  href="/about"
  className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full text-base font-medium transition-all duration-200 ease-in-out transform hover:scale-105"
>
  About the Admin
</Link>

          </div>
        </div>
      </section>

      {/* Latest Poems Section */}
{/* Latest Poems Section */}
<section
  id="latest-poems-section"
  className="relative w-full px-6 py-20 md:px-12 lg:px-20 bg-gray-200 overflow-hidden shadow-lg"
>
  <h2
    className={`text-3xl md:text-4xl font-semibold text-center text-black mb-16 tracking-tight ${
      isInView ? 'animate__animated animate__fadeIn animate__delay-0.1s' : ''
    }`}
  >
    Latest Poems
  </h2>

  <div className="relative overflow-hidden w-full">
    <div
      className="flex w-max gap-8 animate-loop-slide"
      onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
      onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
    >
      {[...poems.slice(0, 4), ...poems.slice(0, 4)].map((poem, index) => (
        <Link
          key={`${poem.id}-${index}`}
          href={`/poem/${poem.slug}`}
          className="min-w-[280px] md:min-w-[320px] lg:min-w-[360px] max-w-xs bg-gray-100 rounded-2xl shadow-lg p-8 mx-4 transition-all duration-300 transform hover:translate-y-[-10px] hover:shadow-[0px_8px_25px_2px_rgba(0,123,255,0.5)] hover:bg-blue-50 animate__animated animate__fadeIn animate__delay-2s"
        >
          <h3 className="text-xl md:text-2xl font-semibold text-black mb-4 truncate">{poem.title}</h3>
          <p className="text-base md:text-lg text-gray-700 line-clamp-5">{poem.content}</p>
        </Link>
      ))}
    </div>
  </div>

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
      animation: loop-slide 20s linear infinite;
    }
  `}</style>
</section>

{/* FAQ Section */}
<section className="w-full px-6 py-20 md:px-12 lg:px-20 bg-gray-200">
  <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-12 text-center animate__animated animate__fadeIn animate__delay-0.4s">
    Frequently Asked Questions
  </h2>

  <div className="space-y-6 max-w-3xl mx-auto">
    {faqData.map((faq, index) => (
      <div key={index} className="bg-gray-100 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl transform hover:scale-105 hover:bg-blue-50">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleAnswer(index)}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-black">{faq.question}</h3>
          <button className="text-blue-700 text-2xl">
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

{/* Testimonials Section */}
<section
  id="testimonials-section"
  className="relative w-full px-6 py-20 md:px-12 lg:px-20 bg-gray-200 overflow-hidden"
>
  <h2
    className={`text-4xl md:text-5xl font-semibold text-center text-black mb-16 tracking-tight ${
      isInView ? 'animate__animated animate__fadeIn animate__fast' : ''
    }`}
  >
    What Our Readers Say
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
    {['Sarah T.', 'John M.', 'Emily R.'].map((name, idx) => (
      <div
        key={idx}
        className={`bg-gray-100 p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-[0px_4px_15px_2px_rgba(0,123,255,0.5)] hover:bg-blue-50 ${
          isInView ? `animate__animated animate__fadeInUp animate__delay-${0.3 * idx}s` : ''
        }`}
      >
        <p className="text-lg text-gray-700 mb-4">
          The poems here truly resonate with my emotions. Each piece feels personal, as though the poet is speaking directly to me.
        </p>
        <div className="flex items-center">
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-600">Poetry Enthusiast</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>



    </main>
  );
}
