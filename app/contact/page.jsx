'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [reasons, setReasons] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchReasons = async () => {
      const { data, error } = await supabase
        .from('reason_to_contact')
        .select('label, value')
        .order('label');

      if (error) {
        console.error('Failed to load reasons:', error.message);
      } else {
        setReasons(data);
      }
    };

    fetchReasons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const { error } = await supabase.from('incoming_contacts').insert({
      name,
      email,
      reason,
      message,
    });

    if (error) {
      console.error('Submission error:', error.message);
      setStatus('Something went wrong. Please try again.');
    } else {
      setStatus('Message sent successfully!');
      setName('');
      setEmail('');
      setReason('');
      setMessage('');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        We’re still under construction across all platforms. Some areas are just breaking ground, others are being wired up, and a few are nearly finished. It's a mess—but a creative one. We're learning, testing, and paving the road forward as fast as we can. Thanks for being here.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded">
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
          <label className="block text-sm font-medium mb-1">Reason for Contact</label>
          <select
            className="w-full border p-2 rounded"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Select a reason...</option>
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            className="w-full border p-2 rounded"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Send Message
        </button>

        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </main>
  );
}
