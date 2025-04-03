// app/api/test/route.js

export async function GET() {
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log("Service Role Key:", process.env.SUPABASE_SERVICE_ROLE_KEY);

  return new Response(
    JSON.stringify({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Loaded" : "Missing",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
