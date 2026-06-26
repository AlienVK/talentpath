import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*, children(*)")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        email: user.email!,
        name: name || user.user_metadata?.name || "Родитель",
      },
      { onConflict: "user_id" }
    )
    .select("*, children(*)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(profile);
}
