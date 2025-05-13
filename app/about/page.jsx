'use client';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-16 px-6 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-white via-indigo-50 to-purple-100 shadow-xl rounded-3xl p-12">
        <h1 className="text-5xl font-display text-center text-gray-900 mb-8 tracking-wide">
          About the Poet
        </h1>
        <p className="text-center text-2xl text-gray-700 mb-12 font-body">
          Welcome to a sanctuary where poetry takes flight and emotions flow freely. Here, words don't just tell a story—they evoke deep feelings, weaving reflections on life, love, and the world through every line.
        </p>

        {/* Poet's Introduction */}
        <div className="text-center mb-12">
          <p className="text-gray-800 text-xl font-semibold mb-3 font-body">A few words from the poet...</p>
          <p className="text-gray-600 text-lg italic font-body">
            "Poetry is not just a form of writing, it's a way of feeling. Every verse carries a piece of my soul, a moment in time I wanted to share with you. I hope my words resonate with you."
          </p>
        </div>

        {/* Poet's Image and Bio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div className="text-center sm:text-left">
            <img
              src="/assets/profile.jpg"
              alt="Poet Image"
              className="w-56 h-56 rounded-full mx-auto sm:mx-0 shadow-xl border-4 border-indigo-200"
            />
          </div>
          <div>
            <h2 className="text-3xl font-display text-gray-800 mb-5">Meet the Poet</h2>
            <p className="text-lg text-gray-800 font-body">
              My name is Thaneshwar Sahu, and I’ve been writing poetry since I could remember. Poetry is my voice, my personal reflection on the world around me. It's my outlet for emotions, thoughts, and experiences that I wish to share with the world.
            </p>
            <p className="text-lg text-gray-800 mt-6 font-body">
              Each poem I write speaks to different moments of life—joy, sorrow, nature, and love. These poems are a piece of my journey, and I invite you to explore them as you walk alongside me in this adventure of words.
            </p>
            <p className="text-lg text-gray-800 mt-6 font-body">
              My writing has taught me the power of connection, and I hope that through these poems, I can connect with those who share similar experiences and emotions.
            </p>
          </div>
        </div>

        {/* Poet's Journey */}
        <div className="mt-16 mb-12">
          <h2 className="text-3xl font-display text-gray-800 mb-6">The Journey of a Poet</h2>
          <p className="text-lg text-gray-700 mb-6 font-body">
            My journey as a poet has been filled with moments of deep reflection and growth. Each poem is a step forward in my personal exploration of the world. It's a journey of self-expression, and I’m honored to share it with you.
          </p>
          <p className="text-lg text-gray-700 font-body">
            I began writing in my youth, finding solace and meaning through my words. Over the years, poetry has become a vital part of me, an avenue for exploring emotions and understanding the world.
          </p>
        </div>

        {/* Social Media/Follow the Poet */}
        <div className="text-center mt-16">
          <p className="text-xl text-gray-700 mb-6 font-body">Stay connected and join me on this poetic journey:</p>
          <div className="flex justify-center space-x-8">
            <a
              href="https://twitter.com/yourpoet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-700 hover:text-blue-600 transition duration-300 text-2xl"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com/yourpoet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-700 hover:text-pink-600 transition duration-300 text-2xl"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://facebook.com/yourpoet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-700 hover:text-blue-600 transition duration-300 text-2xl"
            >
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-700 mb-6 font-body">Want to read more? Explore my latest poems.</p>
          <Link
            href="/poem"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-xl hover:bg-indigo-700 transition duration-300"
          >
            Explore Poems
          </Link>
        </div>
      </div>
    </div>
  );
}
