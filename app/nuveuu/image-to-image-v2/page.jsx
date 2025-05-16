"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ImageToImageV2Page() {
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [generatedImageBase64, setGeneratedImageBase64] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImageToSupabase = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("uploads").upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from("uploads").getPublicUrl(fileName).data.publicUrl;
  };

  const generateImage = async () => {
    setLoading(true);
    setGeneratedImageBase64(null);
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

      const res = await fetch(
        "https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-image-v2beta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt,
            imageUrl: uploadedImageUrl,
            strength: 0.7,
          }),
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error || "Unknown error");
      setGeneratedImageBase64(response.imageBase64);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">One-Page v2Beta Image Editor</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe what should change..."
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
        onClick={generateImage}
        disabled={loading || !prompt || !imageFile}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {generatedImageBase64 && (
        <img src={generatedImageBase64} alt="Generated result" className="mt-4 border max-w-full" />
      )}
    </div>
  );
}
