'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else {
      fetchProfile();
      fetchPosts();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_users_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
    } else {
      setProfile(data);
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('id, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      setPosts(data);
    }
  };

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Connections: {profile.connections || 0} | Views: {profile.views || 0}
          </p>
          <button
            className="mt-4 text-purple-600 hover:underline text-sm"
            onClick={() => router.push('/profile/edit')}
          >
            Edit Profile
          </button>
        </div>

        {/* Bio and Sections */}
        <div className="md:col-span-2 space-y-4">
          <section>
            <h3 className="font-semibold">Bio</h3>
            <p className="text-sm text-gray-700">
              {profile.bio || 'No bio provided.'}
            </p>
          </section>

          <section>
            <h3 className="font-semibold">Portfolio</h3>
            <p className="text-sm text-gray-700">
              {profile.portfolio_url || 'No portfolio linked yet.'}
            </p>
          </section>

          <section>
            <h3 className="font-semibold">Mediums</h3>
            <p className="text-sm text-gray-700">
              {profile.mediums?.join(', ') || 'No mediums selected.'}
            </p>
          </section>

          <section>
            <h3 className="font-semibold">Accomplishments</h3>
            <p className="text-sm text-gray-700">
              {profile.accomplishments || 'No accomplishments listed.'}
            </p>
          </section>
        </div>
      </div>

      {/* My Posts */}
      <div className="mt-8 bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-bold mb-4">My Posts</h3>
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border-t pt-4 border-gray-200">
                <p className="text-gray-700">{post.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">You haven’t posted anything yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
