"use client";

import { useState } from "react";

export default function RunwayTextToVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [videoUrl, setVideoUrl] = useState(null);
  const [base64, setBase64] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const handleStartJob = async () => {
    if (!prompt) return;
    setStatus("starting");

    const res = await fetch("https://tyxhurtlifaufindxhex.supabase.co/functions/v1/start-runway-text-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptText: prompt }),
    });

    const json = await res.json();

    if (!res.ok || !json.id) {
      setStatus("error: " + (json.error || "unknown"));
      return;
    }

    setJobId(json.id);
    setStatus("job started");
  };

  const handleFetchVideo = async () => {
    if (!jobId) return;
    setStatus("fetching result");

    const res = await fetch("https://tyxhurtlifaufindxhex.supabase.co/functions/v1/get-runway-text-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: jobId }),
    });

    const json = await res.json();

    if (json.status === "SUCCEEDED" && json.output?.[0]) {
      const videoRes = await fetch(json.output[0]);
      const videoBlob = await videoRes.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setBase64(base64String);
        setVideoUrl(json.output[0]);
        setStatus("done");
      };

      reader.readAsDataURL(videoBlob);
    } else if (json.status === "FAILED") {
      setStatus("generation failed");
    } else {
      setStatus("still processing");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Runway Gen-2 Text-to-Video</h1>

      <textarea
        placeholder="Enter prompt text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <button
        onClick={handleStartJob}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!prompt || status === "starting"}
      >
        Start Video Generation
      </button>

      <button
        onClick={handleFetchVideo}
        className={`ml-4 px-4 py-2 rounded text-white ${jobId ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={!jobId}
      >
        Fetch Video Result
      </button>

      <button
        onClick={() => setShowVideo(true)}
        disabled={!base64}
        className={`ml-4 px-4 py-2 rounded text-white ${base64 ? "bg-[#e5007d]" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Send to Video Deploy
      </button>

      <div className="mt-4">
        <p>Status: {status}</p>
        {jobId && <p>Job ID: {jobId}</p>}
        {showVideo && base64 && (
          <>
            <video controls className="mt-4 max-w-full" src={`data:video/mp4;base64,${base64}`} />
            <a
              href={`data:video/mp4;base64,${base64}`}
              download="generated_video.mp4"
              className="inline-block mt-2 px-4 py-2 bg-black text-white rounded"
            >
              Download Video
            </a>
          </>
        )}
      </div>
    </div>
  );
}
