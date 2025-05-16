// app\nuveuu-text-to-video\page.jsx
"use client";

import { useState } from "react";

export default function MiniMaxTextToVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [videoUrl, setVideoUrl] = useState(null);

  const supabaseUrl = "https://tyxhurtlifaufindxhex.supabase.co/functions/v1";

  const handleStartJob = async () => {
    if (!prompt) return;
    setStatus("starting");

    const res = await fetch(`${supabaseUrl}/start-minimax-video`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ prompt }),
    });

    const json = await res.json();

    if (!res.ok || !json.task_id) {
      setStatus("error: " + (json.error || "unknown"));
      return;
    }

    setTaskId(json.task_id);
    setStatus("job started");
  };

  const handleFetchVideo = async () => {
  if (!taskId) return;
  setStatus("fetching result");

  const res = await fetch(`${supabaseUrl}/get-minimax-video`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      task_id: taskId,
      group_id: "1923109579105767450"
    }),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    setStatus("error: Invalid JSON returned: " + text.slice(0, 300));
    return;
  }

  if (json.full) {
    setStatus("⚠️ MiniMax RAW: " + json.full.slice(0, 300));
    return;
  }

  if (!res.ok || !json.video_file) {
    setStatus("error: " + (json.error || "still processing"));
    return;
  }

  setVideoUrl(json.video_file);
  setStatus("done");
};


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">nuveuu-MM gen-1 Text-to-Video</h1>

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
        className={`ml-4 px-4 py-2 rounded text-white ${taskId ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={!taskId}
      >
        Fetch Video Result
      </button>

      <div className="mt-4">
        <p>Status: {status}</p>
        {taskId && <p>Task ID: {taskId}</p>}
        {videoUrl && (
          <>
            <video controls className="mt-4 max-w-full" src={videoUrl} />
            <a
              href={videoUrl}
              download="minimax_video.mp4"
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
