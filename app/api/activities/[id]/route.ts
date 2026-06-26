import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser, getOwnedChildId } from "@/lib/api-helpers";

// Ensures the activity exists and belongs to the authenticated user.
async function ownsActivity(userId: string, activityId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("activities")
    .select("child_id")
    .eq("id", activityId)
    .maybeSingle();
  if (!data) return false;
  return !!(await getOwnedChildId(userId, data.child_id));
}

// DELETE /api/activities/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!(await ownsActivity(user.id, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("activities").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// PATCH /api/activities/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!(await ownsActivity(user.id, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("activities")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
