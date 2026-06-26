import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // .trim() strips any stray BOM/whitespace from the env value — a leading
  // U+FEFF would otherwise break fetch() with "non ISO-8859-1 code point".
  // createBrowserClient writes the session cookie in the exact format the
  // server-side createServerClient (middleware/route handlers) reads.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
  );
}
