// supabase/functions/generate-challenge-ideas/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: {
          "Access-Control-Allow-Origin": "*", // Or: "https://nuveuu.com"
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
      });
    }

    const { input_text, intent } = await req.json();

    const OPENAI_KEY = Deno.env.get("OPENAI_KEY");
    if (!OPENAI_KEY) {
      return new Response("Missing OpenAI API Key", { status: 500 });
    }

    const messages = [
      {
        role: "system",
        content: "You are an AI that turns personal stories, raw ideas, or values into creative challenge concepts.",
      },
      {
        role: "user",
        content: `I have this content: "${input_text}". The intent is: "${intent}". Please generate 6 unique creative project ideas. Each should have a title, short description, and 2-4 suggested creative roles.`,
      },
    ];

    const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        temperature: 0.8,
      }),
    });

    const chatData = await chatResponse.json();

    if (!chatData.choices || !chatData.choices[0].message.content) {
      throw new Error("No response from OpenAI");
    }

    // Parse OpenAI response into structured ideas
    const rawText = chatData.choices[0].message.content;
    let ideas;

    try {
      ideas = JSON.parse(rawText);
    } catch {
      ideas = rawText
        .split("\n\n")
        .map((chunk) => {
          const lines = chunk.split("\n");
          const title = lines[0]?.replace(/^\d+\.\s*/, "").trim();
          const description = lines[1]?.trim();
          const roles = lines[2]
            ?.replace("Roles:", "")
            .split(",")
            .map((r) => r.trim());
          return { title, description, roles };
        })
        .filter((idea) => idea.title);
    }

    return new Response(JSON.stringify({ ideas }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Or: "https://nuveuu.com"
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  } catch (err) {
    console.error("AAA Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate challenge ideas" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        },
      }
    );
  }
});
