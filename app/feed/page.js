'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export default function FeedPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      setPosts(data);
    }
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;

    const { error } = await supabase.from('submissions').insert([
      {
        content: postContent,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error('Error posting:', error.message);
      setError('Failed to post.');
    } else {
      setPostContent('');
      fetchPosts();
    }
  };

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2" />
          <p className="font-bold">{user.email}</p>
          <p className="text-sm text-gray-500">
            {profile.connections || 0} Connections | {profile.views || 0} Views
          </p>
          <button
            className="mt-3 text-purple-600 hover:underline text-sm"
            onClick={() => router.push('/profile')}
          >
            View my profile
          </button>
        </div>

        {/* Post Composer */}
        <div className="md:col-span-1 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Create a post</h2>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write something..."
            className="w-full border rounded p-2 h-24 mb-2"
          />
          <button
            onClick={handlePost}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            POST
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Who to Follow */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Who to follow</h2>
          <div className="space-y-3">
            <div>
              <div className="w-10 h-10 bg-gray-200 rounded-full inline-block mr-2" />
              <span>Jacob Stanley</span>
              <p className="text-xs text-gray-500">Designer</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-gray-200 rounded-full inline-block mr-2" />
              <span>Eric Garcia</span>
              <p className="text-xs text-gray-500">Designer</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-gray-200 rounded-full inline-block mr-2" />
              <span>Moshe David</span>
              <p className="text-xs text-gray-500">Designer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Feed */}
      <div className="mt-8 bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Recent Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border-t pt-4 border-gray-200">
              <p className="text-gray-800">{post.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
