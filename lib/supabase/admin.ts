import { createClient } from "@supabase/supabase-js";

// .trim() strips any stray BOM/whitespace that may have crept into the env var.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(),
  { auth: { autoRefreshToken: false, persistSession: false } }
);
