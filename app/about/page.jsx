'use client';
import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-10 px-4 sm:px-8 lg:px-20 font-sans">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 shadow-xl rounded-2xl p-6 sm:p-10 transition-all">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-neutral-900 mb-6 tracking-wide">
          ABOUT
        </h1>
        <p className="text-center text-base text-neutral-700 mb-10 max-w-2xl mx-auto leading-relaxed">
          Welcome to a sanctuary where poetry takes flight and emotions flow freely. Here, words don't just tell a story—they evoke deep feelings, weaving reflections on life, love, and the world through every line.
        </p>

        {/* Poet's Reflection */}
        <div className="bg-indigo-50 rounded-lg py-4 px-6 mb-10 shadow-sm text-center">
          <p className="text-base text-neutral-800 font-medium mb-2">A few words from the poet...</p>
          <p className="text-sm italic text-neutral-600 max-w-xl mx-auto leading-relaxed">
            "Poetry is not just a form of writing, it's a way of feeling. Every verse carries a piece of my soul, a moment in time I wanted to share with you. I hope my words resonate with you."
          </p>
        </div>

        {/* Image and Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center md:justify-start">
            <img
              src="/assets/about-photo.png"
              alt="Poet Image"
              className="w-52 h-52 sm:w-60 sm:h-60 rounded-full object-cover shadow-md border-2 border-indigo-200"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Meet</h2>
            <p className="text-sm text-neutral-800 mb-4 leading-relaxed">
              My name is Thaneshwar Sahu, and I’ve been writing poetry since I could remember. Poetry is my voice, my personal reflection on the world around me. It's my outlet for emotions, thoughts, and experiences that I wish to share with the world.
            </p>
            <p className="text-sm text-neutral-800 mb-4 leading-relaxed">
              Each poem I write speaks to different moments of life—joy, sorrow, nature, and love. These poems are a piece of my journey, and I invite you to explore them as you walk alongside me in this adventure of words.
            </p>
            <p className="text-sm text-neutral-800 leading-relaxed">
              My writing has taught me the power of connection, and I hope that through these poems, I can connect with those who share similar experiences and emotions.
            </p>
          </div>
        </div>

        {/* Journey Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">The Journey of a Poet</h2>
          <p className="text-sm text-neutral-700 mb-4 leading-relaxed">
            My journey as a poet has been filled with moments of deep reflection and growth. Each poem is a step forward in my personal exploration of the world. It's a journey of self-expression, and I’m honored to share it with you.
          </p>
          <p className="text-sm text-neutral-700 leading-relaxed">
            I began writing in my youth, finding solace and meaning through my words. Over the years, poetry has become a vital part of me, an avenue for exploring emotions and understanding the world.
          </p>
        </div>

        {/* Social Media */}
        <div className="text-center mt-14">
          <p className="text-base text-neutral-700 mb-4">Stay connected and join me on this poetic journey:</p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://instagram.com/yourpoet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-700 transition duration-200"
            >
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a
              href="https://facebook.com/yourpoet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition duration-200"
            >
              <i className="fab fa-facebook text-2xl"></i>
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-sm text-neutral-700 mb-4">Want to read more? Explore my latest poems.</p>
          <Link
  href="/poem"
  className="inline-block bg-[#1877F2] text-white px-6 py-3 rounded-lg font-medium text-base hover:bg-[#166FE5] transition duration-300 shadow"
>
  Explore Poems
</Link>

        </div>
      </div>
    </div>
  );
}
