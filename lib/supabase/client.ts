import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookie-based storage so the server-side middleware can read the session
const cookieStorage = {
  getItem(key: string): string | null {
    if (typeof document === "undefined") return null;
    for (const c of document.cookie.split("; ")) {
      const idx = c.indexOf("=");
      if (idx !== -1 && c.slice(0, idx) === key) {
        return decodeURIComponent(c.slice(idx + 1));
      }
    }
    return null;
  },
  setItem(key: string, value: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=${365 * 24 * 3600};SameSite=Lax`;
  },
  removeItem(key: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax`;
  },
};

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: cookieStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    }
  );
}
