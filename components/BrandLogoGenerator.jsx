//components\BrandLogoGenerator.jsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/components/AuthContext';

const BrandLogoGenerator = ({ draftId }) => {
  const { user } = useUser();
  const [brandProfile, setBrandProfile] = useState(null);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !draftId) return;

    const fetchBrandProfile = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('brand_profiles_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (!error && data) {
        setBrandProfile(data);
        await fetchGeneratedStories(data);
      } else {
        console.error('Fetch error:', error);
      }

      setIsLoading(false);
    };

    const fetchGeneratedStories = async (profile) => {
      try {
        const res = await fetch('/api/generate-logo-stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brand_profile: profile }),
        });

        const { stories } = await res.json();
        setStories(stories);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setStories([]);
      }
    };

    fetchBrandProfile();

    const subscription = supabase
      .channel('brand_profiles_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'brand_profiles_drafts', filter: `id=eq.${draftId}` },
        async (payload) => {
          setBrandProfile(payload.new);
          setIsLoading(true);
          await fetchGeneratedStories(payload.new);
          setIsLoading(false);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [draftId, user]);

  const generateSymbolFromStory = (story, colors) => {
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

  if (isLoading || !brandProfile || stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="loader border-4 border-t-4 border-gray-200 border-t-nuveuu-primary rounded-full w-12 h-12 animate-spin"></div>
        <p className="mt-4 text-sm text-gray-600">Generating logos...</p>
      </div>
    );
  }

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
