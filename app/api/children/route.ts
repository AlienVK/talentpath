import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) return NextResponse.json([]);

  const { data: children } = await supabaseAdmin
    .from("children")
    .select("*, activities(*), achievements(*)")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: true });

  return NextResponse.json(children ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Ensure profile exists
  const { data: existingProfile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let profileId = existingProfile?.id;
  if (!profileId) {
    const { data: newProfile } = await supabaseAdmin
      .from("profiles")
      .insert({
        user_id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || "Родитель",
      })
      .select("id")
      .single();
    profileId = newProfile?.id;
  }

  const { data: child, error } = await supabaseAdmin
    .from("children")
    .insert({
      profile_id: profileId,
      name: body.name,
      grade: body.grade ? parseInt(body.grade) : null,
      city: body.city,
      chronotype: body.chronotype,
      learning_style: body.learningStyle,
      social_type: body.socialType,
      interests: body.interests || [],
      disliked_activities: body.dislikedActivities || [],
      current_activities: body.currentActivities || [],
      budget_monthly: body.budgetMonthly ? parseInt(body.budgetMonthly) : null,
      intelligence_scores: body.intelligenceScores || {},
      birth_date: body.birthDate || null,
      gender: body.gender || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(child, { status: 201 });
}
