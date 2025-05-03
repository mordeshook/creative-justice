'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AccessibilityPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const { error } = await supabase.from('incoming_contacts').insert({
      name,
      email,
      message,
      reason: 'accessibility',
    });

    if (error) {
      console.error('Submission error:', error.message);
      setStatus('Something went wrong. Please try again.');
    } else {
      setStatus('Thank you for your message. We’ll review it shortly.');
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Accessibility Statement</h1>
      <p className="mb-4">
        Nuveuu is currently in its early stages of development. We have not yet implemented any formal accessibility “best practices.”
      </p>
      <p className="mb-4">
        We’ve deployed a team to research accessibility standards and we are committed to full compliance in future releases.
        For now, we’re still laying the foundation.
      </p>
      <p className="mb-4">
        Think of this like a construction site: some parts of our platform are just breaking ground, some are being framed,
        others are nearly complete, and a few are ready for tile. You're exploring a live build zone — so we appreciate your patience.
      </p>
      <p className="mb-8">
        If you encounter any issues or have feedback, feel free to use the form below to let us know.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full border p-2 rounded"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="w-full border p-2 rounded"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            className="w-full border p-2 rounded"
            rows="5"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Submit Accessibility Feedback
        </button>

        {status && <p className="text-sm mt-2">{status}</p>}
      </form>

      <p className="text-sm text-gray-500 mt-6">Last updated: April 2025</p>
    </main>
  );
}
