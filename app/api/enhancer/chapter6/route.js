// app/api/enhancer/chapter6/route.js

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseAdminClient";
import OpenAI from "openai";

export const runtime = "nodejs"; // Ensures Node runtime for compatibility

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Incoming request body:", body);

    const { draftId, field, question, existing } = body;

    if (!draftId || !field || !question) {
      console.error("🚫 Missing required fields:", { draftId, field, question });
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const { data: brand_data, error: fetchError } = await supabase
      .from("brand_profiles_drafts")
      .select("*")
      .eq("id", draftId)
      .single();

    if (fetchError) {
      console.error("❌ Supabase fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch draft." }, { status: 500 });
    }

    if (!brand_data) {
      console.warn("⚠️ No draft data found.");
      return NextResponse.json({ error: "Draft not found." }, { status: 404 });
    }

    const systemPrompt = `
You are a world-class branding strategist inspired by the persuasive styles of Ogilvy, Bernbach, Clow, Lawrence, and Wieden.
Given a brand's partial draft and a specific persuasion-based question, your job is to enhance the user's response using creative, emotionally resonant, and audience-aware language.
Make the answer more vivid, sharp, and aligned with the question's deeper purpose.
Be bold, truthful, and inspiring — not generic.
    `.trim();

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
    `.trim();

    console.log("📤 Prompt to OpenAI:", userPrompt);

    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const result = chat.choices?.[0]?.message?.content?.trim();
    console.log("✅ AI Result:", result);

    if (!result) {
      throw new Error("No result returned from OpenAI.");
    }

    return NextResponse.json({ result });

  } catch (error) {
    console.error("🔥 AI Enhancement Error:", error.message);
    return NextResponse.json(
      { error: "AI enhancement failed.", message: error.message },
      { status: 500 }
    );
  }
}
