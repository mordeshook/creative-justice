'use client';

import { useState } from 'react';

export default function LinkedInSummaryPage() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setSummary('');
    setError('');

    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get summary');
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Summary Generator</h1>

      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={6}
        placeholder="Paste your About text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Generating...' : '✨ Generate Summary'}
      </button>

      {error && <p className="text-red-500 mt-4">❌ {error}</p>}

      {summary && (
        <div className="bg-gray-100 p-4 mt-6 rounded border">
          <h2 className="font-semibold mb-2">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </main>
  );
}
