// supabase/functions/enhancer-chapter6-fix/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.20.0/mod.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY"),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { draftId, field, question, existing } = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { data: fullDraft, error } = await supabase
      .from("brand_profiles_drafts")
      .select("*")
      .eq("id", draftId)
      .single();

    if (error || !fullDraft) {
      return new Response(JSON.stringify({ error: "Draft not found." }), {
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const brandData = [
      `Brand Name: ${fullDraft.brand_name}`,
      `Mission Statement: ${fullDraft.mission_statement}`,
      `Brand Soul: ${fullDraft.brand_soul}`,
      `Adjectives: ${fullDraft.brand_adjectives}`,
      `Personality: ${fullDraft.brand_personality}`,
      `Core Values: ${fullDraft.brand_core_values}`,
      `Music Styles: ${fullDraft.brand_music_styles}`,
      `Sound Effects: ${fullDraft.brand_sound_effects}`,
      `Party Behavior: ${fullDraft.brand_party_behaviors}`,
      `Party Style: ${fullDraft.brand_party_styles}`,
      `Color: ${fullDraft.brand_color_names} (${fullDraft.brand_color_rgb})`,
      `Style Name: ${fullDraft.brand_styles_name}`,
      `Style Description: ${fullDraft.brand_styles_description}`,
      `Cultural Flavors: ${fullDraft.brand_cultural_flavors}`,
      `World Visions: ${fullDraft.brand_world_visions}`,
    ].filter(Boolean).join("\n");

    const systemPrompt = `You are a world-class branding strategist. You are helping a founder develop their brand narrative using real brand data. Ground your language in their tone, values, audience, and creative spirit. Where possible, reference elements like music styles, party behavior, color names, or personality.`;

    const userPrompt = `
--- BRAND DATA ---
${brandData}

--- QUESTION ---
${question}

--- USER'S DRAFT ---
${existing}

--- ENHANCE ---
Rewrite the user's draft to feel brand-specific, emotionally resonant, and deeply rooted in their identity. Respond with only the final enhanced version.`;

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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Enhancer Chapter 6 Error:", err);
    return new Response(
      JSON.stringify({ error: "Enhancer function failed." }),
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
});
