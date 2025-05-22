import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { OpenAI } from 'https://deno.land/x/openai@v4.20.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_KEY') });
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_ANON_KEY')
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  try {
    const { stories, brand_colors } = await req.json();
    if (!stories || !brand_colors) {
      return new Response(JSON.stringify({ error: 'Missing stories or brand_colors' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `
You are a creative CSS generator. Respond only with valid JSON in the following format:
{
  "cssStories": [
    {
      "title": "short title",
      "description": "short description",
      "css": "raw CSS with optional background-image using url('something-image-url')"
    }
  ]
}
    `.trim();

    const userPrompt = `
--- BRAND COLORS ---
${brand_colors.join(', ')}

--- STORIES ---
${JSON.stringify(stories)}

--- TASK ---
Generate 5 symbolic CSS visuals. Use only the provided brand colors. If needed, use url('keyword-image-url') placeholders to imply abstract images. Return only valid JSON.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('No content returned from OpenAI');

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid JSON from OpenAI', raw: content }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cssStories = await Promise.all(
      parsed.cssStories.map(async (entry: any) => {
        let finalCss = entry.css;
        const matches = [...finalCss.matchAll(/url\(['"]?([^'")]+-image-url)['"]?\)/gi)];

        for (const match of matches) {
          const placeholder = match[1];
          const keyword = placeholder.replace('-image-url', '').replace(/[-_]/g, ' ');
          const filePath = `symbols/${keyword.replace(/\s+/g, '_')}-${Date.now()}.png`;

          try {
            const image = await openai.images.generate({
              prompt: `A clean, abstract, vector-style icon of a ${keyword}. No text. White background. High contrast.`,
              n: 1,
              size: '512x512',
            });

            const imageUrl = image?.data?.[0]?.url;
            if (!imageUrl) continue;

            const imgRes = await fetch(imageUrl);
            const buffer = await imgRes.arrayBuffer();

            const { error: uploadError } = await supabase.storage
              .from('symbols')
              .upload(filePath, buffer, {
                contentType: 'image/png',
                upsert: true,
              });

            if (uploadError) {
              console.error(`Upload failed for ${filePath}:`, uploadError.message);
              continue;
            }

            const { data: publicUrlData } = supabase.storage
              .from('symbols')
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              finalCss = finalCss.replaceAll(placeholder, publicUrlData.publicUrl);
            }
          } catch (err) {
            console.error(`Failed to generate or upload image for "${placeholder}":`, err.message);
          }
        }

        return {
          ...entry,
          css: finalCss,
        };
      })
    );

    return new Response(JSON.stringify({ cssStories }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('Function error:', err.message);
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
