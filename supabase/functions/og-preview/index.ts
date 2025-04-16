import { serve } from 'https://deno.land/std@0.180.0/http/server.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    const { url } = Object.fromEntries(new URL(req.url).searchParams);

    if (!url || !url.startsWith('http')) {
      return new Response(JSON.stringify({ error: 'Invalid or missing URL' }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SupabaseOGBot/1.0)',
      }
    });

    const html = await response.text();

    const getMetaTag = (property: string) => {
      const regex = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["'](.*?)["']`, 'i');
      const match = html.match(regex);
      return match ? match[1] : null;
    };

    const ogData = {
      title: getMetaTag('og:title') || 'Untitled',
      description: getMetaTag('og:description') || 'No description available.',
      image: getMetaTag('og:image'),
      url: getMetaTag('og:url') || url,
    };

    return new Response(JSON.stringify(ogData), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('OG Preview Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch Open Graph metadata' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
});
