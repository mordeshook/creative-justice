'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="bg-black text-white py-24 px-6 md:px-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">memuze</h1>
        <p className="text-xl md:text-2xl mb-8">
          A platform for <span className="text-pink-400">creators</span> — and those who <span className="text-teal-300">inspire them</span>.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/create">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition">Start Creating</button>
          </Link>
          <Link href="/feed">
            <button className="bg-white text-black font-semibold py-3 px-6 rounded-full border border-gray-300 hover:bg-gray-100 transition">Get Inspired</button>
          </Link>
          <Link href="/challenges">
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-full transition">Explore Challenges</button>
          </Link>
        </div>
      </section>

      {/* WHAT IS MEMUZE */}
      <section className="py-20 px-6 md:px-16 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">What is memuze?</h2>
        <p className="text-lg md:text-xl text-center mb-12">
          memuze is where creativity meets inspiration. Whether you’re an artist, advocate, dreamer, or muse — this is your space to create something meaningful.
        </p>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-semibold mb-3">For the Creators</h3>
            <p>
              Launch challenges, build teams, and turn your ideas into action. Post your work, share your process, and connect with others making real things.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-3">For the Muses</h3>
            <p>
              Not everyone makes the art — some people make it possible. memuze is for those who spark new ideas, support movements, and amplify others.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gray-100 py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">You don’t need a million followers to spark a revolution.</h2>
        <p className="text-xl mb-10">You just need one muse. Or to be one.</p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/create">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-full transition">Create a Challenge</button>
          </Link>
          <Link href="/feed">
            <button className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-full transition">Find Your Muse</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
