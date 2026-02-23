import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@safelabel.local" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@safelabel.local",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "operador@safelabel.local" },
    update: {},
    create: {
      name: "Operador",
      email: "operador@safelabel.local",
      passwordHash,
      role: "OPERADOR",
    },
  });
}

main().finally(async () => prisma.$disconnect());
