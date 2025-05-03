"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ✅ Ensure this is imported

export default function StabilityTestPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImageUrl(null);
    setError(null);

    const { data } = await supabase.auth.getSession(); // ✅ Auth session to get token
    const token = data?.session?.access_token;

    const endpoint = "https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-image-stability";
    const payload = { prompt };

    console.log("🔼 Sending request to:", endpoint);
    console.log("📤 Prompt:", prompt);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 🔐 Auth token for Supabase function
        },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      console.log("✅ Stability AI response:", response);

      if (!res.ok) throw new Error(response.error || "Unknown error");

      setImageUrl(response.imageUrl); // Make sure the image URL is returned correctly
    } catch (err) {
      console.error("❌ Generation error:", err);
      setError(err.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stability AI Image Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe something wild..."
        className="w-full p-2 border mb-4"
      />

      <button
        onClick={generateImage}
        disabled={loading || !prompt}
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="AI generated result"
          className="mt-4 border max-w-full"
        />
      )}
    </div>
  );
}
