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
    const { task_id, group_id } = await req.json();

    const queryRes = await fetch(`https://api.minimaxi.chat/v1/query/video_generation?task_id=${task_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      }
    });

    const queryData = await queryRes.json();

    if (!queryRes.ok || queryData.status !== 'Success') {
      return new Response(JSON.stringify({
        error: 'Still processing or failed',
        status: queryData.status
      }), { status: 202, headers });
    }

    const file_id = queryData.file_id;

const fileRes = await fetch(`https://api.minimaxi.chat/v1/files/retrieve?GroupId=${group_id}&file_id=${file_id}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${MINIMAX_API_KEY}`
  }
});


    const fileText = await fileRes.text();

    // 🔥 LOG HERE — this is what we need
    console.log("[MiniMax Raw Response]", fileText.slice(0, 1000));

    let fileData;
    try {
      fileData = JSON.parse(fileText);
    } catch (parseErr) {
      return new Response(JSON.stringify({
        error: 'MiniMax returned non-JSON response',
        status: fileRes.status,
        contentType: fileRes.headers.get('Content-Type'),
        text: fileText.slice(0, 500),
        full: fileText
      }), { status: 500, headers });
    }

    if (!fileRes.ok || !fileData.file?.download_url) {
      return new Response(JSON.stringify({
        error: 'Failed to retrieve video file',
        raw: fileData
      }), { status: 500, headers });
    }

    return new Response(JSON.stringify({
      video_file: fileData.file.download_url
    }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers
    });
  }
});
