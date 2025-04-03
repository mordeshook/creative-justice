'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function MyNetworkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else {
      fetchProfiles();
    }
  }, [user]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, bio, avatar_url')
      .neq('id', user.id);

    if (error) {
      console.error('Error fetching profiles:', error.message);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  if (!user || loading) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Network</h1>

        {users.length === 0 ? (
          <p className="text-sm text-gray-600">No other users found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {users.map((u) => (
              <li
                key={u.id}
                className="bg-white shadow p-4 rounded-md flex gap-4 items-center"
              >
                <div className="w-14 h-14 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{u.name || 'Unnamed User'}</p>
                  <p className="text-xs text-gray-500">
                    {u.bio || 'No bio available'}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/profile/${u.id}`)}
                  className="text-sm text-purple-600 hover:underline"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
