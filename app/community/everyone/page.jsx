'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function EveryonePage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('community').select('*');  // Fetch from 'community' table
    if (error) {
      console.error('Error fetching profiles:', error.message);
    } else {
      console.log("Profiles data fetched:", data);  // Log the data
      setProfiles(data);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Profiles</h1>
      <pre>{JSON.stringify(profiles, null, 2)}</pre> {/* Shows raw profiles data */}
    </div>
  );
}
