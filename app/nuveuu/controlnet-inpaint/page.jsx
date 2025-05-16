// app/stability/controlnet-inpaint/page.jsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ControlNetInpaintPage() {
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [maskFile, setMaskFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [maskPreview, setMaskPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadToSupabase = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from("uploads").getPublicUrl(fileName).data.publicUrl;
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      const uploadedImageUrl = await uploadToSupabase(imageFile);
      const uploadedMaskUrl = await uploadToSupabase(maskFile);

      const res = await fetch("https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-image-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          imageUrl: uploadedImageUrl,
          maskUrl: uploadedMaskUrl,
          width: 1024,
          height: 1024,
          strength: 0.75,
          guidanceScale: 8,
          steps: 60,
          controlImageUrl: uploadedImageUrl,
          controlnetModel: "controlnet-inpaint", // specify your model
          controlnetType: "inpaint",
          controlnetConditioningScale: 1.0,
        }),
      });

      const response = await res.json();
      if (!res.ok) throw new Error(response.error || "Generation failed");
      setResultUrl(response.imageUrl);
    } catch (err) {
      console.error("❌ Generation error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ControlNet Inpainting Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe what to generate..."
        className="w-full p-2 border mb-4"
      />

      <label className="block mb-2 font-semibold">Upload Source Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
        }}
        className="w-full p-2 border mb-4"
      />
      {imagePreview && <img src={imagePreview} alt="Source" className="mb-4 border" />}

      <label className="block mb-2 font-semibold">Upload Mask Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setMaskFile(file);
          setMaskPreview(URL.createObjectURL(file));
        }}
        className="w-full p-2 border mb-4"
      />
      {maskPreview && <img src={maskPreview} alt="Mask" className="mb-4 border" />}

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt || !imageFile || !maskFile}
        className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate with Inpainting"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {resultUrl && (
        <img src={resultUrl} alt="Generated" className="mt-4 border max-w-full" />
      )}
    </div>
  );
}
