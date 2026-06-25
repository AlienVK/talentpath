import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json([]);

  const children = await prisma.child.findMany({
    where: { profileId: profile.id },
    include: { activities: true, achievements: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(children);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  let profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        userId: user.id,
        email: user.email!,
        name: user.user_metadata?.name || "Родитель",
      },
    });
  }

  const child = await prisma.child.create({
    data: {
      profileId: profile.id,
      name: body.name,
      grade: body.grade ? parseInt(body.grade) : null,
      city: body.city,
      chronotype: body.chronotype,
      learningStyle: body.learningStyle,
      socialType: body.socialType,
      interests: body.interests || [],
      dislikedActivities: body.dislikedActivities || [],
      currentActivities: body.currentActivities || [],
      budgetMonthly: body.budgetMonthly ? parseInt(body.budgetMonthly) : null,
      intelligenceScores: body.intelligenceScores || {},
    },
  });

  return NextResponse.json(child, { status: 201 });
}
