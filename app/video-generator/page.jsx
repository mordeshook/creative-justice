// logs added version of page.jsx for better debug visibility
// file: /app/image-to-video/page.jsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";

export default function ImageToVideoPage() {
  const { user } = useUser();
  const [imageFile, setImageFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [videoUrl, setVideoUrl] = useState(null);

  const handleUpload = async () => {
    if (!imageFile || !user) return;

    setStatus("uploading");

    const formData = new FormData();
    formData.append("image", imageFile);

    console.log("📤 Uploading image to Supabase Storage...");

    const filename = `${Date.now()}_${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(filename, imageFile);

    if (uploadError) {
      console.error("❌ Upload error:", uploadError);
      setStatus("error: upload");
      return;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filename}`;
    console.log("✅ Uploaded. URL:", imageUrl);

    console.log("🎬 Sending to start-video-job...");
    const res = await fetch("/api/start-video-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ init_image_url: imageUrl })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Stability error:", data);
      setStatus("error: stability");
      return;
    }

    console.log("📩 Received job ID:", data.id);
    setJobId(data.id);
    setStatus("polling");
  };

  const handleFetchVideo = async () => {
    if (!jobId) return;
    setStatus("fetching");
    console.log("🔁 Fetching video result for job:", jobId);

    const res = await fetch(`/api/get-video-result?id=${jobId}`);
    const data = await res.json();

    if (!res.ok || !data.video_url) {
      console.error("❌ Fetch error:", data);
      setStatus("error: fetch");
      return;
    }

    console.log("✅ Video ready:", data.video_url);
    setVideoUrl(data.video_url);
    setStatus("done");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Image to Video</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!imageFile}
      >
        Generate Video
      </button>

      {jobId && (
        <div className="mt-4">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Job ID:</strong> {jobId}</p>
          <button
            onClick={handleFetchVideo}
            className={`mt-2 px-4 py-2 rounded text-white ${videoUrl ? "bg-green-600" : "bg-gray-400"}`}
            disabled={!jobId}
          >
            Fetch Video Result
          </button>

          {videoUrl && (
            <p className="mt-2 text-blue-600">
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                Watch Video
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
