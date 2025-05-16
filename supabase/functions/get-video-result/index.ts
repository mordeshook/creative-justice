// supabase/functions/get-video-result/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const allowedOrigin = "https://nuveuu.com";

serve(async (req) => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing Stability job ID" }), {
      status: 400,
      headers,
    });
  }

  try {
    const result = await fetch(
      `https://api.stability.ai/v2beta/image-to-video/result/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    if (result.status === 202) {
      return new Response(JSON.stringify({ status: "in-progress" }), {
        status: 202,
        headers,
      });
    }

    if (!result.ok) {
      const err = await result.text();
      return new Response(JSON.stringify({ error: "Stability fetch failed", details: err }), {
        status: 500,
        headers,
      });
    }

    const data = await result.json();
    const base64 = data.video;

    const save = await fetch(`${SUPABASE_URL}/rest/v1/stability_id?stability_job_id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ base64 }),
    });

    if (!save.ok) {
      const saveErr = await save.text();
      return new Response(JSON.stringify({ error: "Failed to save to Supabase", details: saveErr }), {
        status: 500,
        headers,
      });
    }

    return new Response(JSON.stringify({ status: "done", base64 }), {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected server error", details: err.message }), {
      status: 500,
      headers,
    });
  }
});
