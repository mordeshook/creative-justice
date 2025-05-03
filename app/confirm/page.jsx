'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ConfirmPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();

      if (error || !user) {
        setChecking(false);
        return;
      }

      // Wait until email is confirmed
      if (!user.email_confirmed_at) {
        setChecking(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, bio')
        .eq('auth_users_id', user.id)
        .single();

      if (!profile || !profile.bio || profile.bio.trim() === '') {
        router.push('/profile/create');
      } else {
        router.push('/feed');
      }
    };

    checkUser();
  }, [router]);

  if (checking) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white">
      <div className="max-w-xl bg-gray-50 border border-gray-200 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">Thanks for Signing Up!</h1>
        <p className="text-gray-700 mb-6">
          We’ve sent a confirmation email to your inbox. Please check it and click the link to activate your account.
        </p>
        <p className="text-gray-600 text-sm mb-8">
          Once confirmed, you’ll return here to create your full profile and begin using all of nuveuu’s features — connect, collaborate, and launch something bold.
        </p>

        <button
          onClick={() => router.push('/profile/create')}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-md transition"
        >
          ✅ Got it — Create Your Profile Now
        </button>
      </div>
    </div>
  );
}
