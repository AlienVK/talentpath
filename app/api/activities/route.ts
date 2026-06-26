import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser, getOwnedChildId } from "@/lib/api-helpers";

// GET /api/activities?childId=... — list activities for a child
export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const childId = req.nextUrl.searchParams.get("childId");
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  if (!(await getOwnedChildId(user.id, childId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("activities")
    .select("*")
    .eq("child_id", childId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/activities — create an activity
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { childId, name, type, days, timeStart, timeEnd, address, price } = body;

  if (!childId || !name) {
    return NextResponse.json({ error: "childId and name required" }, { status: 400 });
  }
  if (!(await getOwnedChildId(user.id, childId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("activities")
    .insert({
      child_id: childId,
      name,
      type: type || "other",
      days: (days || []).map(String),
      time_start: timeStart || null,
      time_end: timeEnd || null,
      address: address || null,
      price: price ? parseInt(String(price)) : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
