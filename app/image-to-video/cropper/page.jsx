"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { supabase } from "@/lib/supabaseClient";

const Cropper = dynamic(() => import("react-cropper"), { ssr: false });

export default function ImageToVideoPage() {
  const cropperRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [croppedUrl, setCroppedUrl] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [base64, setBase64] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const TARGET_WIDTH = 1024;
  const TARGET_HEIGHT = 576;

  const handleImageChange = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.readAsDataURL(files[0]);
  };

  const handleCropAndUpload = async () => {
    if (!cropperRef.current) return;

    const cropper = cropperRef.current.cropper;

    const croppedCanvas = cropper.getCroppedCanvas(); // User's interactive crop

    // Resize final cropped canvas to TARGET dimensions
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = TARGET_WIDTH;
    finalCanvas.height = TARGET_HEIGHT;

    const ctx = finalCanvas.getContext("2d");
    ctx.drawImage(croppedCanvas, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    finalCanvas.toBlob(async (blob) => {
      const filePath = `${Date.now()}_cropped.png`;
      const { error } = await supabase.storage.from("uploads").upload(filePath, blob);

      if (error) {
        console.error("Upload error:", error);
        return;
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`;
      setCroppedUrl(url);
    }, "image/png");
  };

  const handleGenerate = async () => {
    if (!croppedUrl) return;
    setStatus("starting");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const auth_users_id = user?.id;

    const startRes = await fetch(
      "https://tyxhurtlifaufindxhex.supabase.co/functions/v1/start-video-job",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          init_image_url: croppedUrl,
          auth_users_id,
        }),
      }
    );

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

    const res = await fetch(
      `https://tyxhurtlifaufindxhex.supabase.co/functions/v1/get-video-result?id=${jobId}`
    );
    const json = await res.json();

    if (res.ok && json.base64) {
      setBase64(json.base64);
      setStatus("done");
    } else {
      setStatus("error: " + (json.error || "unknown"));
    }
  };

  const handleDisplayVideo = () => setShowVideo(true);

  return (
    <div className="p-4">
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/cropperjs@1.6.1/dist/cropper.min.css"
        />
      </Head>

      <h1 className="text-xl font-bold mb-4">Image to Video with Cropper</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {uploadedImage && (
        <div
          style={{
            width: "600px",
            height: "400px",
            marginBottom: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Cropper
            key={uploadedImage}
            src={uploadedImage}
            crossOrigin="anonymous"
            style={{ height: "100%", width: "100%" }}
            aspectRatio={TARGET_WIDTH / TARGET_HEIGHT}
            guides={true}
            ref={cropperRef}
            viewMode={1}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded absolute z-20 bottom-2 left-2"
            onClick={handleCropAndUpload}
          >
            Crop & Upload
          </button>
        </div>
      )}

      {croppedUrl && (
        <div className="mb-4">
          <img
            src={croppedUrl}
            alt="Cropped"
            className="max-w-sm"
            style={{ width: TARGET_WIDTH / 2, height: TARGET_HEIGHT / 2 }}
          />
        </div>
      )}

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-green-600 text-white rounded"
        disabled={!croppedUrl || status === "starting"}
      >
        Start Job
      </button>

      <button
        onClick={handleGetVideo}
        className={`px-4 py-2 ml-4 rounded text-white ${
          jobId ? "bg-purple-600" : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!jobId}
      >
        Fetch Video Result
      </button>

      <button
        onClick={handleDisplayVideo}
        disabled={!base64}
        className={`px-4 py-2 ml-4 rounded text-white ${
          base64 ? "bg-[#e5007d]" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Send to Video Deploy
      </button>

      <div className="mt-4">
        <p>Status: {status}</p>
        {jobId && <p>Job ID: {jobId}</p>}
        {showVideo && base64 && (
          <video
            controls
            className="mt-4 max-w-full"
            src={`data:video/mp4;base64,${base64}`}
          />
        )}
      </div>
    </div>
  );
}
