'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function PrivacyPolicyPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('incoming_contacts').insert({
      name,
      email,
      message,
      reason: 'privacy',
    });

    if (!error) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } else {
      alert('There was an error submitting your message.');
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-gray-700">
        This Privacy Policy describes how we collect, use, and protect your information when you visit or use our website.
        By accessing this site, you agree to the terms outlined in this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Personal information you provide (e.g. name, email, contact details)</li>
        <li>Usage data (e.g. pages visited, time on site, browser/device info)</li>
        <li>Any data voluntarily submitted through forms or messages</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>To operate and improve the website</li>
        <li>To personalize your experience</li>
        <li>To respond to inquiries or provide support</li>
        <li>To send updates if you've opted in</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Cookies</h2>
      <p className="mb-4 text-gray-700">
        We may use cookies to enhance your browsing experience. You can disable cookies in your browser settings, but some
        features of the site may not work properly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Third-Party Services</h2>
      <p className="mb-4 text-gray-700">
        We may use third-party tools (like analytics or authentication) that collect data in accordance with their own
        privacy policies. We are not responsible for the practices of external services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Data Security</h2>
      <p className="mb-4 text-gray-700">
        We take appropriate security measures to protect your personal data from unauthorized access, disclosure, or loss.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">6. Your Rights</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>You can request access to or deletion of your personal data.</li>
        <li>You can opt out of certain communications at any time.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">7. Changes to This Policy</h2>
      <p className="mb-4 text-gray-700">
        We reserve the right to update this Privacy Policy. Changes will be posted here with a revised "last updated" date.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">8. Contact Us</h2>
      <p className="text-gray-700 mb-4">
        If you have any questions or concerns about this Privacy Policy, you can fill out the form below and we’ll follow up.
      </p>

      {submitted ? (
        <p className="text-green-600 font-semibold mt-4">Thanks for contacting us! We'll get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="mt-1 p-2 w-full border rounded"
            ></textarea>
          </div>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      )}

      <p className="text-sm text-gray-500 mt-10">Last updated: April 15, 2025</p>
    </main>
  );
}
