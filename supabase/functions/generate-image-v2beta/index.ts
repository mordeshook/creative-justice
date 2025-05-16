import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Replace with your actual frontend domain
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
    const { prompt, imageUrl, strength = 0.7 } = await req.json();

    if (!prompt || !imageUrl) {
      return new Response(JSON.stringify({ error: "Missing prompt or imageUrl" }), {
        status: 400,
        headers,
      });
    }

    // Fetch the image
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return new Response(JSON.stringify({ error: "Image fetch failed" }), {
        status: 400,
        headers,
      });
    }

    const imageBuffer = new Uint8Array(await imageRes.arrayBuffer());
    const file = new File([imageBuffer], "input.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("init_image", file);
    formData.append("strength", strength.toString());
    formData.append("mode", "image-to-image");
    formData.append("output_format", "png");

    const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");

    const stabilityResponse = await fetch(
      "https://api.stability.ai/v2beta/stable-image/edit/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: "image/*", // binary response
        },
        body: formData,
      }
    );

    if (!stabilityResponse.ok) {
      const error = await stabilityResponse.text();
      return new Response(JSON.stringify({ error: error || "Stability failed" }), {
        status: 500,
        headers,
      });
    }

    // Convert image blob to base64
    const blob = await stabilityResponse.blob();
    const base64 = await blobToBase64(blob);
    return new Response(JSON.stringify({ imageBase64: base64 }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers,
    });
  }
});

// Convert Blob to base64 data URL
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
