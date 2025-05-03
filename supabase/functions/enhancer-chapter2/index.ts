// supabase/functions/enhancer-chapter2/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.20.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { draftId, field, question, existing } = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const OPENAI_KEY = Deno.env.get("OPENAI_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const openai = new OpenAI(OPENAI_KEY);

    const { data: brand_data, error: draftError } = await supabase
      .from("brand_profiles_drafts")
      .select("*")
      .eq("id", draftId)
      .single();

    if (draftError || !brand_data) {
      console.error("Draft not found:", draftError);
      return new Response(JSON.stringify({ result, debug: userPrompt }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const systemPrompt = `
You are a world-class branding strategist. Given a user's partially completed brand profile and a specific deep question, rewrite their draft to sound thoughtful, original, and emotionally resonant. Use the brand data below.
`;

    const userPrompt = `
--- BRAND DATA ---
${JSON.stringify(brand_data, null, 2)}

--- QUESTION ---
${question}

--- USER'S DRAFT ---
${existing}

--- ENHANCE ---
Please rewrite the draft using the full brand context. Respond with only the enhanced version (no explanation).
`;

    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const result = chat.choices?.[0]?.message?.content?.trim();

    return new Response(JSON.stringify({ result, debug: userPrompt }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Enhancer Chapter 2 Error:", err);
    return new Response(
      JSON.stringify({ error: "Enhancer function failed." }),
      { status: 500, headers: corsHeaders }
    );
  }
});
