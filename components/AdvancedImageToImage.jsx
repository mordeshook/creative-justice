// components/AdvancedImageToImage.jsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdvancedImageToImage() {
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImageToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("uploads").upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from("uploads").getPublicUrl(fileName).data.publicUrl;
  };

  const generateImageToImage = async () => {
    setLoading(true);
    setGeneratedUrl(null);
    setError(null);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      let uploadedImageUrl = null;
      if (imageFile) {
        uploadedImageUrl = await uploadImageToSupabase(imageFile);
        console.log("✅ Uploaded Image URL:", uploadedImageUrl);
      }

      if (!uploadedImageUrl) {
        setError("❌ Image upload failed or returned null URL.");
        setLoading(false);
        return;
      }

      const res = await fetch("https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-image-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          imageUrl: uploadedImageUrl,
          width: 1024,
          height: 1024,
          strength: 0.7,
          steps: 50,
          guidanceScale: 7.5,
        }),
      });

      const response = await res.json();
      if (!res.ok) throw new Error(response.error || "Unknown error");
      setGeneratedUrl(response.imageUrl);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Advanced Image-to-Image Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe modifications..."
        className="w-full p-2 border mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setImageFile(e.target.files[0]);
          setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
        }}
        className="w-full p-2 border mb-4"
      />

      {imagePreviewUrl && (
        <img src={imagePreviewUrl} alt="Uploaded" className="mb-4 border" />
      )}

      <button
        onClick={generateImageToImage}
        disabled={loading || !prompt || !imageFile}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate from Image"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {generatedUrl && (
        <img src={generatedUrl} alt="Generated result" className="mt-4 border max-w-full" />
      )}
    </div>
  );
}
