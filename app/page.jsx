'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(error.message);
    } else {
      setStatus('Logged in successfully.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="bg-black text-white py-24 px-6 md:px-12 text-center rounded-md">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">nuveuu</h1>
        <p className="text-xl md:text-2xl mb-8">
          A platform for <span className="text-pink-400">creators</span> — and those who <span className="text-teal-300">inspire them</span>.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/auth">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-md shadow-md transition">
              Start Creating
            </button>
          </Link>
          <Link href="/inspired">
            <button className="bg-white text-black font-semibold py-3 px-6 rounded-md border border-gray-300 hover:bg-gray-100 transition">
              Get Inspired
            </button>
          </Link>
          <Link href="/challenges">
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-md transition">
              Explore Challenges
            </button>
          </Link>
        </div>
      </section>

      {/* LOGIN FORM */}
      <section className="flex justify-center px-6 -mt-14 z-10 relative">
        <div className="bg-white border border-gray-200 shadow-xl rounded-md p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">log in to nuveuu</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md transition"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            {status && (
              <p className={`text-sm text-center mt-2 ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {status}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* WHAT IS nuveuu */}
      <section className="py-20 px-6 md:px-16 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">What is nuveuu?</h2>
        <p className="text-lg md:text-xl text-center mb-12">
        nuveuu is where creativity meets inspiration. Whether you’re an artist, advocate, dreamer, or muse — this is your space to create something meaningful.
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
              Not everyone makes the art — some people make it possible. nuveuu is for those who spark new ideas, support movements, and amplify others.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gray-100 py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          You don’t need a million followers to spark a revolution.
        </h2>
        <p className="text-xl mb-10">You just need one muse. Or to be one.</p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/challenges">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-md transition">
              Create a Challenge
            </button>
          </Link>
          <Link href="/feed">
            <button className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-md transition">
              Find Your Muse
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
