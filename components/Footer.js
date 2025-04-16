'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/components/AuthContext';

export default function Footer() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <footer className="bg-white border-t p-4 mt-6 text-sm flex justify-between items-center">
      <div>&copy; 2025 nuveuu</div>
      <div className="flex gap-4">
        <a href="https://www.creativejusticechallenge.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Learn About Creative Justice Challenge
        </a>
        <button onClick={() => router.push('/privacy')} className="hover:underline">Privacy</button>
        <button onClick={() => router.push('/accessibility')} className="hover:underline">Accessibility</button>
        <button onClick={() => router.push('/contact')} className="hover:underline">Contact</button>
        {user && (
          <button onClick={async () => {
            await supabase.auth.signOut();
            router.push('/auth');
          }} className="text-red-500 hover:underline">
            Log Out
          </button>
        )}
      </div>
    </footer>
  );
}
