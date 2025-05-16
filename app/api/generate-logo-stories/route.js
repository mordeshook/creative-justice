//app\api\generate-logo-stories\route.js

export async function POST(request) {
  const body = await request.json();

  const { data, error } = await supabase.functions.invoke('generate-logo-stories', {
    body
  });

  if (error) {
    console.error('Supabase function error:', error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
