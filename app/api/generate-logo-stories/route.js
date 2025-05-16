export async function POST(request) {
  const body = await request.json();

  const response = await fetch(
    'https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-logo-stories',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY'
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
