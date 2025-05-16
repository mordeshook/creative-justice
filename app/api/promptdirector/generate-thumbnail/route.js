//app\api\promptdirector\generate-thumbnail\route.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Missing imageUrl parameter' }), { status: 400 });
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image from provided URL');
    }

    const arrayBuffer = await response.arrayBuffer();
    const fileName = `promptdirector-assets/${crypto.randomUUID()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('promptdirector-assets')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      throw new Error('Failed to upload to Supabase: ' + uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from('promptdirector-assets')
      .getPublicUrl(fileName);

    return new Response(JSON.stringify({ publicUrl: publicUrlData.publicUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error('Prompt Director Thumbnail Generation Error:', err);
    return new Response(
      JSON.stringify({ error: 'Thumbnail generation error', details: err.message }),
      { status: 500 }
    );
  }
}
