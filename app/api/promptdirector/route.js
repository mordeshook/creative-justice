//app\api\promptdirector\route.js
export const runtime = 'nodejs';

import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { description, engine, subject_type, style, mood, perspective } = await req.json();

    const systemPrompt = `
      You are an AI prompt crafting expert. Your task is to create a clear and concise prompt optimized for the chosen rendering engine.

      Engine: ${engine}
      Subject: ${subject_type}
      Style: ${style}
      Mood: ${mood}
      Perspective: ${perspective}

      Include all elements naturally in the final prompt.
    `;

    const userPrompt = `
      Here's the user's brief description:
      "${description}"

      Craft a detailed, professional AI prompt combining these details clearly and effectively.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
    });

    const generated_prompt = completion.choices[0].message.content.trim();

    return new Response(JSON.stringify({ generated_prompt }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('Prompt Director API Error:', err.message);
    return new Response(
      JSON.stringify({ error: 'Prompt generation failed', details: err.message }),
      { status: 500 }
    );
  }
}
