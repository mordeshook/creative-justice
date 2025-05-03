// /app/api/enhancer/generate-thumbnail/route.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Missing imageUrl' }), { status: 400 });
    }

    const response = await fetch(imageUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error('Failed to fetch image from source');
    }
    const arrayBuffer = await response.arrayBuffer();
    const fileName = `enhancer-assets/${crypto.randomUUID()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('enhancer-assets')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      throw new Error('Supabase upload failed: ' + uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from('enhancer-assets')
      .getPublicUrl(fileName);

    return new Response(JSON.stringify({ publicUrl: publicUrlData?.publicUrl || null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error('Thumbnail generation server error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Unknown server error' }), { status: 500 });
  }
}
