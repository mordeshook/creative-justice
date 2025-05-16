import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RUNWAY_API_KEY = Deno.env.get("RUNWAY_API_KEY");
const RUNWAY_VERSION = "2024-11-06";
const allowedOrigin = "https://nuveuu.com";

serve(async (req) => {
  const headers = new Headers();
  const origin = req.headers.get("Origin");

  if (origin === allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
  }

  try {
    const { promptText, promptImage } = await req.json();

    if (!promptText || !promptImage) {
      return new Response(JSON.stringify({ error: "Missing promptText or promptImage" }), {
        status: 400,
        headers,
      });
    }

    const response = await fetch("https://api.dev.runwayml.com/v1/image_to_video", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RUNWAY_API_KEY}`,
        "Content-Type": "application/json",
        "X-Runway-Version": RUNWAY_VERSION,
      },
      body: JSON.stringify({
        promptImage,
        promptText,
        model: "gen4_turbo",
        ratio: "1280:720",
        duration: 5,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("❌ Runway Gen-4 error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers,
    });
  }
});
