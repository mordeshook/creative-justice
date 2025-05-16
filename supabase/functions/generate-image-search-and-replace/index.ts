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
    const { prompt, searchPrompt, imageUrl } = await req.json();

    if (!prompt || !searchPrompt || !imageUrl) {
      return new Response(
        JSON.stringify({ error: "Missing prompt, searchPrompt, or imageUrl" }),
        { status: 400, headers }
      );
    }

    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch image" }),
        { status: 400, headers }
      );
    }

    const imageBuffer = await imageRes.arrayBuffer();
    const file = new File([imageBuffer], "input.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", file);
    formData.append("prompt", prompt);
    formData.append("search_prompt", searchPrompt);
    formData.append("output_format", "png");

    const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/edit/search-and-replace",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error }), {
        status: response.status,
        headers,
      });
    }

    const result = await response.json();
    return new Response(
      JSON.stringify({ imageBase64: result.image }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("❌ Server error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers }
    );
  }
});
