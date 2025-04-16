'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert('Error signing in: ' + error.message)
    else alert('Check your email for the login link!')
    setLoading(false)
  }

  return (
    <div className="p-4">
      <input
        className="border p-2 mb-2 w-full"
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-black text-white px-4 py-2 w-full"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </div>
  )
}
