'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import NotificationBell from '../components/NotificationBell';

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push('/auth');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div
        className="text-xl font-bold text-purple-600 cursor-pointer"
        onClick={() => router.push('/feed')}
      >
        Creative Justice
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/feed')} className="hover:underline">
            Home
          </button>
          <button onClick={() => router.push('/my_network')} className="hover:underline">
            My Network
          </button>
          <button onClick={() => router.push('/profile')} className="hover:underline">
            Profile
          </button>
          <NotificationBell />
          <button onClick={handleLogout} className="text-red-500 hover:underline">
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}
