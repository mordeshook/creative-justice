// supabase/functions/generate-image-to-video/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");
const allowedOrigin = "https://nuveuu.com";

serve(async (req) => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { init_image_url } = await req.json();

    if (!init_image_url) {
      return new Response(JSON.stringify({ error: "Missing init_image_url" }), {
        status: 400,
        headers,
      });
    }

    const imageBlob = await fetch(init_image_url).then((res) => res.blob());
    const imageFile = new File([imageBlob], "image.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("image", imageFile);

    const submissionRes = await fetch("https://api.stability.ai/v2beta/image-to-video", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const submission = await submissionRes.json();

    if (!submissionRes.ok || !submission.id) {
      return new Response(JSON.stringify({ error: "Stability API submission failed", details: submission }), {
        status: 500,
        headers,
      });
    }

    const videoId = submission.id;

    // Poll for video status
    let status = "processing";
    let videoUrl = null;
    const pollInterval = 6000;
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const pollRes = await fetch(`https://api.stability.ai/v2beta/image-to-video/result/${videoId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: "application/json",
        },
      });

      const pollData = await pollRes.json();

      if (pollRes.ok && pollData.status === "complete" && pollData.video_url) {
        videoUrl = pollData.video_url;
        break;
      }

      await new Promise((r) => setTimeout(r, pollInterval));
    }

    if (!videoUrl) {
      return new Response(JSON.stringify({ error: "Video generation timed out" }), {
        status: 504,
        headers,
      });
    }

    return new Response(JSON.stringify({ video_url: videoUrl }), {
      status: 200,
      headers,
    });

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers,
    });
  }
});
