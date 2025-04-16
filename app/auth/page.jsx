'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';


export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isSigningIn) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) return setError(signInError.message);

      // Check if user has profile
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_users_id', user.id)
        .single();

      if (!profile) {
        router.push('/profile-startup');
      } else {
        router.push('/feed');
      }
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) return setError(signUpError.message);

      router.push('/confirm'); // ✅ Show confirmation notice
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">
        {isSigningIn ? 'Sign In' : 'Sign Up'}
      </h1>

      <form onSubmit={handleAuth} className="flex flex-col gap-3 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {isSigningIn ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      {message && <p className="text-green-600 text-sm mt-3">{message}</p>}

      <button
        onClick={() => {
          setIsSigningIn(!isSigningIn);
          setError('');
          setMessage('');
        }}
        className="text-sm text-blue-600 mt-4"
      >
        {isSigningIn ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </button>
    </div>
  );
}
