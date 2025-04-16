'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function VerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/auth');
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
      <p className="text-gray-700 max-w-md">
        Thanks for verifying your email. You can now log in and complete your profile on the Creative Justice Challenge platform.
      </p>
    </div>
  );
}
