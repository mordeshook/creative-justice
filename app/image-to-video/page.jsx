// app/image-to-video/page.jsx

"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ImageToVideoPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("idle");
  const fileInputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`;
    setImageUrl(url);
  };

  const handleGenerate = async () => {
    if (!imageUrl) return;
    setStatus("starting");

    const { data: { user } } = await supabase.auth.getUser();
    const auth_users_id = user?.id;

    const startRes = await fetch("https://tyxhurtlifaufindxhex.supabase.co/functions/v1/start-video-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        init_image_url: imageUrl,
        auth_users_id,
      }),
    });

    const startJson = await startRes.json();
    if (!startRes.ok || !startJson.id) {
      setStatus("error: " + (startJson.error || "unknown"));
      return;
    }

    setJobId(startJson.id);
    setStatus("waiting_for_button");
  };

  const handleGetVideo = async () => {
    if (!jobId) return;
    setStatus("fetching_result");

    const res = await fetch(`https://tyxhurtlifaufindxhex.supabase.co/functions/v1/get-video-result?id=${jobId}`);
    const json = await res.json();

    if (res.ok && json.video_url) {
      window.open(json.video_url, "_blank");
      setStatus("done");
    } else {
      setStatus("error: " + (json.error || "unknown"));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Image to Video</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        ref={fileInputRef}
        className="mb-4"
      />

      {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt="Uploaded" className="max-w-sm" />
        </div>
      )}

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={!imageUrl || status === "starting"}
      >
        Generate Video
      </button>

      <button
        onClick={handleGetVideo}
        className={`px-4 py-2 ml-4 rounded text-white ${jobId ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
        disabled={!jobId}
      >
        Fetch Video Result
      </button>

      <div className="mt-4">
        <p>Status: {status}</p>
        {jobId && <p>Job ID: {jobId}</p>}
      </div>
    </div>
  );
}
