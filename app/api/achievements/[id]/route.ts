import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser, getOwnedChildId } from "@/lib/api-helpers";

// DELETE /api/achievements/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: ach } = await supabaseAdmin
    .from("achievements")
    .select("child_id")
    .eq("id", id)
    .maybeSingle();

  if (!ach || !(await getOwnedChildId(user.id, ach.child_id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("achievements").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
