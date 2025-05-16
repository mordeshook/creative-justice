"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ImageToVideoPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from("public") // Change this to your correct bucket
      .upload(`uploads/${Date.now()}_${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Upload error:", error.message);
      setError("Image upload failed.");
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("public").getPublicUrl(data.path);
    setImageUrl(publicUrl);
    console.log("✅ Image uploaded:", publicUrl);
  };

  const generateVideo = async () => {
    if (!imageUrl) return;

    setLoading(true);
    setVideoUrl(null);
    setError(null);

    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;

    const endpoint = "https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-image-to-video";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          init_image_url: imageUrl,
          prompt: prompt,
        }),
      });

      const response = await res.json();
      console.log("✅ Stability AI video response:", response);

      if (!res.ok) throw new Error(response.error || "Unknown error");

      setVideoUrl(response.videoUrl);
    } catch (err) {
      console.error("❌ Video generation error:", err);
      setError(err.message || "Failed to generate video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image to Video Generator</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4"
      />

      {imageUrl && (
        <img src={imageUrl} alt="Uploaded" className="mb-4 border max-w-full" />
      )}

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Optional: Describe motion, style, etc."
        className="w-full p-2 border mb-4"
      />

      <button
        onClick={generateVideo}
        disabled={loading || !imageUrl}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Video"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {videoUrl && (
        <video
          src={videoUrl}
          controls
          className="mt-4 border max-w-full"
        />
      )}
    </div>
  );
}
