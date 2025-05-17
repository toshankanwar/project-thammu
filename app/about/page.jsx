'use client';
import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8 lg:px-20 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 transition-all animate-fade-in-up">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 tracking-wide">
          ABOUT
        </h1>
        <p className="text-center text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Welcome to a space where poetry comes to life. Here, each word is carefully crafted to evoke emotions and offer reflections on love, life, and the world around us.
        </p>

        {/* Poet's Reflection */}
        <div className="bg-gray-50 rounded-lg py-4 px-6 mb-10 shadow-sm text-center">
          <p className="text-lg text-gray-800 font-medium mb-2">A few words from the poet...</p>
          <p className="text-base italic text-gray-500 max-w-xl mx-auto leading-relaxed">
            "Poetry is not just a form of writing, it's a way of feeling. Every verse carries a piece of my soul, a moment in time I wanted to share with you. I hope my words resonate with you."
          </p>
        </div>

        {/* Image and Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center md:justify-start">
            <img
              src="/assets/photo-about.jpg"
              alt="Poet Image"
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-full object-cover shadow-md border-2 border-gray-200"
            />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Meet</h2>
            <p className="text-base text-gray-700 mb-4 leading-relaxed">
              My name is Thaneshwar Sahu, and I’ve been writing poetry since I could remember. Poetry is my voice, my personal reflection on the world around me. It's my outlet for emotions, thoughts, and experiences that I wish to share with the world.
            </p>
            <p className="text-base text-gray-700 mb-4 leading-relaxed">
              Each poem I write speaks to different moments of life—joy, sorrow, nature, and love. These poems are a piece of my journey, and I invite you to explore them as you walk alongside me in this adventure of words.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              My writing has taught me the power of connection, and I hope that through these poems, I can connect with those who share similar experiences and emotions.
            </p>
          </div>
        </div>

        {/* Journey Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">The Journey of a Poet</h2>
          <p className="text-base text-gray-600 mb-4 leading-relaxed">
            My journey as a poet has been filled with moments of deep reflection and growth. Each poem is a step forward in my personal exploration of the world. It's a journey of self-expression, and I’m honored to share it with you.
          </p>
          <p className="text-base text-gray-600 leading-relaxed">
            I began writing in my youth, finding solace and meaning through my words. Over the years, poetry has become a vital part of me, an avenue for exploring emotions and understanding the world.
          </p>
        </div>

        {/* Social Media */}
        <div className="text-center mt-14">
          <p className="text-lg text-gray-600 mb-4">Stay connected and join me on this poetic journey:</p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://instagram.com/yourpoet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a
              href="https://facebook.com/yourpoet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <i className="fab fa-facebook text-2xl"></i>
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-base text-gray-600 mb-4">Want to read more? Explore my latest poems.</p>
          <Link
            href="/poem"
            className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-blue-800 transition duration-300 shadow"
          >
            Explore Poems
          </Link>
        </div>
      </div>
    </div>
  );
}
