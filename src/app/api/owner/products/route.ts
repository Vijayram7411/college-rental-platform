import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function GET() {
  const owner = await requireRole(["OWNER", "ADMIN"]);

  const products = await prisma.product.findMany({
    where: { ownerId: owner.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
