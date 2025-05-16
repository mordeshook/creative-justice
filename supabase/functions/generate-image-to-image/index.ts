import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const allowedOrigin = "https://nuveuu.com";

serve(async (req) => {
  const headers = new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const {
      prompt,
      imageUrl,
      width = 1024,
      height = 1024,
      steps = 50,
      strength = 0.7,
      guidanceScale = 7.5,
      seed = null,
      negativePrompt,
    } = await req.json();

    if (!prompt || !imageUrl) {
      return new Response(
        JSON.stringify({ error: "Missing prompt or imageUrl" }),
        { status: 400, headers }
      );
    }

    // Fetch the image bytes from Supabase
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch image from storage" }),
        { status: 400, headers }
      );
    }

    const imageBuffer = await imageRes.arrayBuffer();
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });

    const form = new FormData();
    form.append("init_image", blob, "input.jpg");
    form.append("prompt", prompt);
    form.append("width", String(width));
    form.append("height", String(height));
    form.append("steps", String(steps));
    form.append("cfg_scale", String(guidanceScale));
    form.append("samples", "1");
    form.append("strength", String(strength));
    if (seed !== null) form.append("seed", String(seed));
    if (negativePrompt) form.append("negative_prompt", negativePrompt);

    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-5/image-to-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("STABILITY_API_KEY")}`,
        },
        body: form,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: result.error || "Unknown error from Stability API" }),
        { status: response.status, headers }
      );
    }

    return new Response(
      JSON.stringify({ imageUrl: result.artifacts?.[0]?.url ?? null }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("❌ Internal Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers }
    );
  }
});
