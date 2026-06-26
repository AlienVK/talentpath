import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** Returns the authenticated user or null. */
export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Verifies the authenticated user owns the given child (child → profile →
 * user_id). Returns the child id if owned, otherwise null.
 */
export async function getOwnedChildId(userId: string, childId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("children")
    .select("id, profiles!inner(user_id)")
    .eq("id", childId)
    .maybeSingle();

  if (!data) return null;
  const profiles = (data as { profiles?: { user_id?: string } | { user_id?: string }[] }).profiles;
  const ownerId = Array.isArray(profiles) ? profiles[0]?.user_id : profiles?.user_id;
  return ownerId === userId ? data.id : null;
}
