"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AITestPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) throw new Error("User not logged in");
      const token = session.access_token;

      const res = await fetch("https://tyxhurtlifaufindxhex.functions.supabase.co/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unknown error");

      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error("AI gen error:", err);
      setError(err.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Image Generator Test</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe something..."
        className="w-full p-2 border mb-4"
      />
      <button
        onClick={generateImage}
        disabled={loading || !prompt}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="AI result"
          className="mt-4 border max-w-full"
        />
      )}
    </div>
  );
}
