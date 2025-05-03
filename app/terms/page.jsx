'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

      <p className="mb-4">
        By using Nuveuu, you agree to the following terms. These terms apply to all users and visitors.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Usage</h2>
      <p>You agree to use the platform legally, ethically, and respectfully. You’re responsible for your content and actions.</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Account Responsibility</h2>
      <p>You’re responsible for your account. Please keep your login info secure and let us know if anything seems off.</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Content Ownership</h2>
      <p>You retain ownership of your content but grant us permission to display and distribute it on the platform.</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Limitation of Liability</h2>
      <p>We’re not liable for damages or losses related to use of our services. You use Nuveuu at your own risk.</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Changes</h2>
      <p>We can update these terms. We’ll notify you when major changes happen, but it’s your job to stay updated.</p>

      <p className="mt-6">
        Have questions about these terms?{' '}
        <a href="/contact" className="text-blue-600 underline">
          Reach out to us here
        </a>.
      </p>

      <p className="mt-6 text-sm text-gray-500">Last updated: April 2025</p>
    </main>
  );
}
