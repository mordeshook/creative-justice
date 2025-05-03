// supabase/functions/enhancer-chapter6/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.12.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY")!,
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { draftId, question, existing } = await req.json();

    const { data: brand_data, error } = await supabase
      .from("brand_profiles_drafts")
      .select("*")
      .eq("id", draftId)
      .single();

    if (error || !brand_data) {
      return new Response(JSON.stringify({ error: "Draft not found." }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const systemPrompt = `
You are a world-class branding strategist inspired by the persuasive styles of Ogilvy, Bernbach, Clow, Lawrence, and Wieden.
Given a brand's partial draft and a specific persuasion-based question, your job is to enhance the user's response using creative, emotionally resonant, and audience-aware language.
Make the answer more vivid, sharp, and aligned with the question's deeper purpose.
Be bold, truthful, and inspiring — not generic.
`;

    const userPrompt = `
---
BRAND DATA:
${JSON.stringify(brand_data, null, 2)}

---
QUESTION:
${question}

---
USER DRAFT:
${existing || ""}

---
ENHANCE:
Please rewrite the user draft to better answer the question using the brand context and persuasion style.
Respond with only the enhanced version (no intro or explanation).
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const result = completion.choices?.[0]?.message?.content?.trim() || "";

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("❌ Enhancer Chapter 6 Error:", err);
    return new Response(JSON.stringify({ error: "Server error." }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};
