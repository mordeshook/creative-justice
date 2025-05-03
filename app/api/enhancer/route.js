// /app/api/enhancer/route.js

export const runtime = 'nodejs'; // ✅ Forces Node.js runtime (not Edge)

import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { text, tone, format, style } = await req.json();

    const messages = [
      {
        role: "system",
        content:
          "You are a professional writing enhancer. Based on the user's instructions, rewrite the content with the given tone, format, and style.",
      },
      {
        role: "user",
        content: `Here is the content to enhance:\n\n"${text}"\n\nUse the following:\nTone: ${tone}\nFormat: ${format}\nStyle: ${style}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      temperature: 0.7,
    });

    const enhanced_output = completion.choices[0].message.content;

    return new Response(JSON.stringify({ enhanced_output }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Enhancer Error:', err.message);
    return new Response(
      JSON.stringify({ error: 'Enhancement failed', details: err.message }),
      { status: 500 }
    );
  }
}
