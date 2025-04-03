'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      setError('Failed to load profile.');
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        bio: profile.bio,
        portfolio_url: profile.portfolio_url,
        accomplishments: profile.accomplishments,
        education: profile.education,
        skills: profile.skills,
        type: profile.type,
      })
      .eq('id', user.id);

    if (error) {
      setError('Error saving profile.');
    } else {
      setMessage('Profile updated successfully.');
    }
  };

  if (!user || loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <div className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={profile.name || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          name="bio"
          placeholder="Short bio"
          value={profile.bio || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="portfolio_url"
          placeholder="Portfolio URL"
          value={profile.portfolio_url || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="education"
          placeholder="Education"
          value={profile.education || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="skills"
          placeholder="Skills (comma-separated)"
          value={profile.skills || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          name="accomplishments"
          placeholder="Accomplishments"
          value={profile.accomplishments || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="type"
          value={profile.type || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select artist type or advocate</option>
          {artistTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Save Profile
        </button>

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
