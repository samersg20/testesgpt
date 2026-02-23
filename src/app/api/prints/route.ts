import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getShelfLifeHours } from "@/lib/shelf-life";
import { makeZplLabel } from "@/lib/zpl";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const quantity = Number(body.quantity);
  if (quantity < 1 || quantity > 50) {
    return NextResponse.json({ error: "Quantidade deve estar entre 1 e 50" }, { status: 400 });
  }

  const item = await prisma.item.findUnique({ where: { id: body.itemId } });
  if (!item) return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });

  const method = body.storageMethod as "RESFRIADO" | "CONGELADO" | "AMBIENTE" | "QUENTE" | "DESCONGELANDO";
  const shelfLifeHours = getShelfLifeHours(item, method);
  if (!shelfLifeHours) {
    return NextResponse.json({ error: "Shelf life não cadastrado para este método" }, { status: 400 });
  }

  const producedAt = new Date();
  const expiresAt = new Date(producedAt.getTime() + shelfLifeHours * 60 * 60 * 1000);

  const labelPrint = await prisma.labelPrint.create({
    data: {
      itemId: item.id,
      storageMethod: method,
      producedAt,
      expiresAt,
      userId: session.user.id,
      quantity,
    },
  });

  const zpl = makeZplLabel({
    name: item.name,
    storageMethod: method,
    producedAt,
    expiresAt,
    userName: session.user.name || "Operador",
    sif: item.sif,
    notes: item.notes,
  });

  return NextResponse.json({
    labelPrint,
    producedAt,
    expiresAt,
    item,
    user: session.user,
    storageMethod: method,
    quantity,
    zpl,
  });
}
