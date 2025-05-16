import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';

const RUNWAY_API_KEY = Deno.env.get('RUNWAY_API_KEY');
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

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
  }

  const { job_id } = await req.json();

  const runwayRes = await fetch(`https://api.runwayml.com/v1/jobs/${job_id}`, {
    headers: { 'Authorization': `Bearer ${RUNWAY_API_KEY}` },
  });

  const data = await runwayRes.json();

  return new Response(JSON.stringify(data), { status: runwayRes.status, headers });
});
