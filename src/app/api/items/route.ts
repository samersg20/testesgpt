import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.item.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const item = await prisma.item.create({
    data: {
      name: body.name,
      type: body.type,
      sif: body.sif || null,
      notes: body.notes || null,
      chilledHours: body.chilledHours || null,
      frozenHours: body.frozenHours || null,
      ambientHours: body.ambientHours || null,
      hotHours: body.hotHours || null,
      thawingHours: body.thawingHours || null,
    },
  });

  return NextResponse.json(item);
}
