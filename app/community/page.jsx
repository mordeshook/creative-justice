'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/components/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function CommunityPage() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [typeFilter, setTypeFilter] = useState(''); // For sorting by artist type
  const { user } = useUser();

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (typeFilter) {
      setFilteredProfiles(profiles.filter(profile => profile.type === typeFilter && profile.id !== user?.id)); // Exclude logged-in user
    } else {
      setFilteredProfiles(profiles.filter(profile => profile.id !== user?.id)); // Exclude logged-in user
    }
  }, [typeFilter, profiles]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        console.error('Error fetching profiles:', error.message);
      } else {
        console.log('Profiles data fetched:', data);
        setProfiles(data); 
        setFilteredProfiles(data.filter(profile => profile.id !== user?.id)); // Exclude logged-in user
      }
    } catch (err) {
      console.error('Error in fetching profiles:', err.message);
    }
  };

  const handleConnect = (profileId) => {
    console.log('Connecting with user:', profileId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Creative Challenge Community</h1>
        {/* My Network Link */}
        <a href="/my_network" className="text-blue-500 underline">
          My Network
        </a>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <label htmlFor="artist-type" className="mr-2">Filter by Artist Type:</label>
        <select
          id="artist-type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          <option value="Photographers & Visual Journalists">Photographers & Visual Journalists</option>
          <option value="Filmmakers & Video Storytellers">Filmmakers & Video Storytellers</option>
          <option value="Musicians, Sound Artists & Composers">Musicians, Sound Artists & Composers</option>
          <option value="Poets, Spoken Word Artists & Lyricists">Poets, Spoken Word Artists & Lyricists</option>
          {/* Add other types if necessary */}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProfiles.length === 0 ? (
          <div>No profiles available</div>
        ) : (
          filteredProfiles.map((profile) => (
            <div key={profile.id} className="card p-4 border rounded shadow-lg bg-white">
              <div className="relative">
                <img
                  src={profile.header_image || '/default-header.jpg'}
                  alt="Header Image"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <img
                  src={profile.avatar_url || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <h2 className="text-xl font-semibold mt-4 text-center">{profile.name}</h2>
              <p className="text-gray-600 text-center">{profile.type}</p>
              <p className="mt-4 text-gray-700">{profile.bio}</p>
              <p className="mt-2 text-gray-500">{profile.accomplishments}</p>

              <div className="mt-4 text-center">
                {profile.portfolio_url && (
                  <a href={profile.portfolio_url} target="_blank" className="text-blue-500 underline">
                    Portfolio
                  </a>
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => handleConnect(profile.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Connect
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
