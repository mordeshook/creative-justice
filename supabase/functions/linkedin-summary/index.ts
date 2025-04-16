// supabase/functions/linkedin-summary/index.ts

import { serve } from 'https://deno.land/std@0.180.0/http/server.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    const { url } = await req.json()

    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing URL' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const response = await fetch(url)
    const html = await response.text()
    const summary = extractLinkedInSummary(html)

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error('Summary error:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate summary' }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})

function extractLinkedInSummary(html: string): string {
  const lines = html.split('\n')
  const aboutSection = lines.find((line) =>
    line.toLowerCase().includes('about') || line.toLowerCase().includes('summary')
  )
  return aboutSection?.trim() || 'Summary not found.'
}

// ✅ Centralized CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}
