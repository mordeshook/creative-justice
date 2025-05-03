// supabase/functions/linkedin-summary/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { OpenAI } from "https://deno.land/x/openai@v4.20.0/mod.ts";
import * as pdfjsLib from "npm:pdfjs-dist@4.0.379";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});

serve(async (req: Request) => {
  try {
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

    const { text, filePath } = await req.json();
    console.log("📦 Payload received:", { hasText: !!text?.length, filePath });

    let pdfText = "";
    if (filePath) {
      const { data, error } = await supabase.storage.from("linkedin-uploads").download(filePath);
      if (error) {
        console.error("❌ PDF download failed:", error.message);
        return new Response(JSON.stringify({ error: "Failed to download PDF." }), {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        });
      }

      try {
        const buffer = await data.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdfDoc = await loadingTask.promise;

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str).join(" ");
          pdfText += strings + "\n";
        }
      } catch (err) {
        console.error("❌ PDF parsing failed:", err.message);
      }
    }

    const fullInput = `${text}\n\n${pdfText}`.slice(0, 14000);

    const prompt = `
You are an AI resume parser and LinkedIn summary generator.

From the text below, output a JSON object with two keys:
1. summary — a professional LinkedIn-style summary paragraph
2. experience — an array of job entries with:
   - title
   - company
   - start_date (YYYY-MM-DD)
   - end_date (YYYY-MM-DD or null)
   - description

Return only the JSON object.

INPUT:\n\n${fullInput}
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const raw = aiResponse.choices?.[0]?.message?.content ?? "";
    console.log("🧠 Raw AI output preview:", raw.slice(0, 300));

    let parsed = { summary: "", experience: [] };
    try {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}") + 1;
      parsed = JSON.parse(raw.slice(start, end));
    } catch (err) {
      console.error("❌ JSON parsing failed:", err.message);
      parsed.summary = raw.trim();
      parsed.experience = [];
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("🔥 Edge Function crashed:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
});
