import { serve } from "https://deno.land/x/std/http/server.ts";

// Function to generate a video via Stability AI API
serve(async (req) => {
  // Define allowed origin for CORS
  const allowedOrigin = "https://nuveuu.com";

  const headers = new Headers();
  const origin = req.headers.get("Origin");

  // CORS preflight handling
  if (origin === allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
  }

  try {
    const body = await req.json();
    const { prompt } = body;

    const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");
    const endpoint = "https://api.stability.ai/v2beta/image-to-video";

    const requestBody = {
      prompt,
      output_format: "mp4",
      seed: 0,
      cfg_scale: 2.5,
      motion_bucket_id: 127,
      style_preset: "cinematic",
      clip_guidance_preset: "FAST_BLUE",
    };

    const stabilityResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STABILITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const isJson = stabilityResponse.headers.get("Content-Type")?.includes("application/json");
    const data = isJson ? await stabilityResponse.json() : null;

    if (!stabilityResponse.ok) {
      const fullError = isJson ? JSON.stringify(data) : await stabilityResponse.text();
      console.error("❌ Stability API raw error:", fullError);
      return new Response(JSON.stringify({ error: fullError }), { status: 500, headers });
    }

    const videoUrl = data.video_url;
    return new Response(JSON.stringify({ videoUrl }), { status: 200, headers });

  } catch (err) {
    console.error("❌ Uncaught server error:", err);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers,
    });
  }
});
