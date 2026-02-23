import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const item = await prisma.item.update({
    where: { id },
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

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.item.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
