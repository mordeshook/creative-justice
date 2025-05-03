import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.20.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("OK", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY is NOT set!");
      return new Response(
        JSON.stringify({ error: "Server missing OPENAI_API_KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      console.error("❌ No image returned from OpenAI:", response);
      return new Response(JSON.stringify({ error: "No image returned" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ imageUrl }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("🔥 FULL ERROR:", JSON.stringify(err, null, 2));
    return new Response(JSON.stringify({ error: "Image generation failed" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
