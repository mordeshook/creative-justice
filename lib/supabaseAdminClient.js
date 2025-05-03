// lib/supabaseAdminClient.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // MUST use service role key on the server
);

export { supabase };
