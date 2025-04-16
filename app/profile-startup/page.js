'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const artistTypes = [
  'Filmmakers & Video Storytellers',
  'Photographers & Visual Journalists',
  'Poets, Spoken Word Artists & Lyricists',
  'Musicians, Sound Artists & Composers',
  'Digital Artists, Motion Designers & Animators',
  'Performers & Theater Makers',
  'Illustrators & Graphic Storytellers',
  'Writers, Storytellers & Narrative Artists',
  'Experimental & Mixed Media Artists',
  'Makeup Artists, Hairstylists & Creative Stylists',
  'Craft-Based Artists & Artisans',
  'Wearable Art, Fashion & Costume Designers',
  'Community, Public & Social Practice Artists',
  'Advocate',
];

export default function ProfileStartupPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setError('Unable to retrieve user session.');
      } else {
        setUserId(user.id);
        setEmail(user.email);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name || !bio || !type) {
      setError('Please fill in all fields.');
      return;
    }

    const { error: insertError } = await supabase.from('profiles').insert([
      {
        auth_users_id: userId,
        email,
        name,
        bio,
        type,
      },
    ]);

    if (insertError) {
      setError('Failed to create profile. Please try again.');
      console.error(insertError);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Create Your Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-4 py-2 rounded"
          required
        />
        <textarea
          placeholder="Your Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border px-4 py-2 rounded h-32"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-4 py-2 rounded"
          required
        >
          <option value="">Select artist type or advocate</option>
          {artistTypes.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Create Profile
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {message && <p className="text-green-600 text-sm mt-4">{message}</p>}
    </div>
  );
}
