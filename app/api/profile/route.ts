import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: { children: true },
  });

  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: { name },
    create: {
      userId: user.id,
      email: user.email!,
      name: name || user.user_metadata?.name || "Родитель",
    },
    include: { children: true },
  });

  return NextResponse.json(profile);
}
