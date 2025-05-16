// components/BrandLogoGenerator.jsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/components/AuthContext';

const BrandLogoGenerator = ({ draftId }) => {
  const { user } = useUser();
  const [brandProfile, setBrandProfile] = useState(null);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (!user || !draftId) return;

    const fetchBrandProfile = async () => {
      const { data, error } = await supabase
        .from('brand_profiles_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (!error && data) {
        setBrandProfile(data);
        fetchGeneratedStories(data);  // AI-generated stories based on DB data
      } else {
        console.error('Fetch error:', error);
      }
    };

    const fetchGeneratedStories = async (profile) => {
      const res = await fetch('/api/generate-logo-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_profile: profile }),
      });

      const { stories } = await res.json();
      setStories(stories);
    };

    fetchBrandProfile();

    const subscription = supabase
      .channel('brand_profiles_updates')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'brand_profiles_drafts', 
        filter: `id=eq.${draftId}` 
      }, (payload) => {
        setBrandProfile(payload.new);
        fetchGeneratedStories(payload.new);  // regenerate if DB updates
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [draftId, user]);

  const generateSymbolFromStory = (story, colors) => {
    // You'll implement this: logic for visually interpreting each story.
    // Example placeholder logic for now:
    const size = Math.floor(Math.random() * 60) + 80;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: randomColor,
      borderRadius: `${Math.floor(Math.random() * 50)}%`,
      transform: `rotate(${Math.floor(Math.random() * 360)}deg)`
    };
  };

  if (!brandProfile || stories.length === 0) return <div>Generating logos...</div>;

  const colors = brandProfile.brand_colors || ['#FF5733', '#33A1FF'];

  return (
    <div className="flex flex-wrap gap-6 p-4 justify-center">
      {stories.map((story, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div style={generateSymbolFromStory(story.description, colors)} />
          <h3 className="font-semibold text-center">{story.title}</h3>
          <p className="text-xs text-gray-500 text-center">{story.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BrandLogoGenerator;
