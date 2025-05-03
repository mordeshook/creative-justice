import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { text } = await req.json();

  if (!text || text.trim() === '') {
    return new Response(JSON.stringify({ error: 'No text provided.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const prompt = `
You are an expert career assistant. Write a LinkedIn summary based on this:
"${text}"
Return only the summary string.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  });

  const raw = response.choices?.[0]?.message?.content ?? '';

  return new Response(JSON.stringify({ summary: raw.trim() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
