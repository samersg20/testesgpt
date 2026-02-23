import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);

  const itemId = searchParams.get("itemId") || undefined;
  const storageMethod = searchParams.get("storageMethod") || undefined;
  const userId = searchParams.get("userId") || undefined;
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const rows = await prisma.labelPrint.findMany({
    where: {
      itemId,
      storageMethod: storageMethod as never,
      userId,
      createdAt: {
        gte: start ? new Date(start) : undefined,
        lte: end ? new Date(end) : undefined,
      },
    },
    include: { item: true, user: true },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return NextResponse.json(rows);
}
