'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (isSigningIn) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) return setError(signInError.message);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setError('User not found');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, bio')
        .eq('auth_users_id', user.id)
        .single();

      // If profile doesn't exist, create one
      if (!profile) {
        await supabase.from('profiles').insert({
          auth_users_id: user.id,
          email: user.email,
          name: user.user_metadata?.name || '',
          bio: '',
        });
        return router.push('/profile/create');
      }

      // If bio is missing, send to profile create
      if (!profile.bio || profile.bio.trim() === '') {
        return router.push('/profile/create');
      }

      return router.push('/feed');

    } else {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (signUpError) return setError(signUpError.message);

      router.push('/confirm');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-md p-8 border">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-4">Welcome to nuveuu</h1>

        <p className="text-center text-gray-600 text-sm mb-6">
          {isSigningIn
            ? 'Enter your email and password to log in.'
            : 'Create your account below. You’ll get an email to confirm it, and then we’ll guide you to build your profile.'}
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {!isSigningIn && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold transition"
          >
            {isSigningIn ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button
          onClick={() => {
            setIsSigningIn(!isSigningIn);
            setError('');
          }}
          className="text-sm text-blue-600 mt-4 hover:underline"
        >
          {isSigningIn ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </button>

        {!isSigningIn && (
          <div className="mt-6 text-gray-500 text-xs text-center leading-5">
            After signing up, you’ll get an email to confirm your account. Once confirmed,
            we’ll take you to a short profile form to get started using nuveuu.
          </div>
        )}
      </div>
    </div>
  );
}
