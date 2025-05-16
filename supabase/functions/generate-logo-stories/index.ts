//supabase\functions\generate-logo-stories\index.ts

import { serve } from 'https://deno.land/std/http/server.ts';
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts';

const openai = new OpenAI(Deno.env.get('OPENAI_API_KEY'));

serve(async (req) => {
  const { brand_profile } = await req.json();

  const prompt = `
    Create 15 short symbolic visual descriptions based entirely on this brand profile data:
    ${JSON.stringify(brand_profile)}

    Provide response in JSON format:
    { "stories": [{"title":"title", "description":"short symbolic description"}, ...]}
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  return new Response(completion.choices[0].message.content, {
    headers: { 'Content-Type': 'application/json' },
  });
});
