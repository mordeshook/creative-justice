// supabase/functions/start-minimax-video/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';

const MINIMAX_API_KEY = Deno.env.get('MINIMAX_API_KEY');
const allowedOrigin = "https://nuveuu.com";

serve(async (req) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const bodyText = await req.text();
    let prompt;

    try {
      const body = JSON.parse(bodyText);
      prompt = body.prompt;
    } catch (parseError) {
      return new Response(JSON.stringify({ error: 'Invalid JSON: ' + parseError.message }), { status: 400, headers });
    }

    const minimaxRes = await fetch('https://api.minimaxi.chat/v1/video_generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: "T2V-01-Director",
        prompt,
        prompt_optimizer: true,
      }),
    });

    const responseText = await minimaxRes.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (apiParseError) {
      return new Response(JSON.stringify({
        error: 'MiniMax response parsing error: ' + apiParseError.message,
        rawResponse: responseText,
      }), { status: 500, headers });
    }

    if (!minimaxRes.ok || !data.task_id) {
      return new Response(JSON.stringify({ error: data.error || 'MiniMax API error', details: data }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ task_id: data.task_id }), { status: 200, headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
});
