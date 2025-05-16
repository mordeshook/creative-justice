import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const allowedOrigin = "https://nuveuu.com";

serve(async (req) => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { init_image_url, auth_users_id } = await req.json();

    if (!init_image_url) {
      return new Response(JSON.stringify({ error: "Missing init_image_url" }), {
        status: 400,
        headers,
      });
    }

    const imageBlob = await fetch(init_image_url).then((res) => res.blob());
    const file = new File([imageBlob], "image.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("https://api.stability.ai/v2beta/image-to-video", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.id) {
      return new Response(
        JSON.stringify({ error: "Failed to start video generation", details: data }),
        { status: 500, headers }
      );
    }

    const payload: Record<string, any> = {
      stability_job_id: data.id,
    };

    if (auth_users_id) {
      payload.auth_users_id = auth_users_id;
    }

    await fetch(`${SUPABASE_URL}/rest/v1/stability_id`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    return new Response(JSON.stringify({ id: data.id }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers,
    });
  }
});
