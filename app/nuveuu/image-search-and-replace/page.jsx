"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ImageSearchAndReplacePage() {
  const [prompt, setPrompt] = useState("");
  const [searchPrompt, setSearchPrompt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [resultBase64, setResultBase64] = useState(null);
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
    setResultBase64(null);
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
        setError("❌ Image upload failed.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-image-search-and-replace",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt,
            searchPrompt,
            imageUrl: uploadedImageUrl,
          }),
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error || "Unknown error");

      // Accept either raw base64 or full data URL
      const output = response.imageBase64 || response.image;
      setResultBase64(output);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = () => {
    if (!resultBase64) return null;
    return resultBase64.startsWith("data:") ? resultBase64 : `data:image/png;base64,${resultBase64}`;
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search and Replace AI Editor</h1>

      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="What object to replace? (e.g. 'sky')"
        className="w-full p-2 border mb-2"
      />

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What to replace it with? (e.g. 'sky with birds')"
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
        disabled={loading || !prompt || !searchPrompt || !imageFile}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {resultBase64 && (
        <>
          <img
            src={getImageSrc()}
            alt="Result"
            className="mt-4 border max-w-full"
          />
          <a
            href={getImageSrc()}
            download={`generated-${Date.now()}.png`}
            className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded"
          >
            Download Image
          </a>
        </>
      )}
    </div>
  );
}
