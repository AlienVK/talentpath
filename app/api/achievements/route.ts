import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser, getOwnedChildId } from "@/lib/api-helpers";

// GET /api/achievements?childId=... — list achievements for a child
export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const childId = req.nextUrl.searchParams.get("childId");
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  if (!(await getOwnedChildId(user.id, childId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("achievements")
    .select("*")
    .eq("child_id", childId)
    .order("earned_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/achievements — create an achievement
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { childId, title, description, type, points, badgeLevel } = body;

  if (!childId || !title) {
    return NextResponse.json({ error: "childId and title required" }, { status: 400 });
  }
  if (!(await getOwnedChildId(user.id, childId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("achievements")
    .insert({
      child_id: childId,
      title,
      description: description || null,
      type: type || "badge",
      points: points ? parseInt(String(points)) : 0,
      badge_level: badgeLevel || "bronze",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
