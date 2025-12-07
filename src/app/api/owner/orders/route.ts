import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function GET() {
  const owner = await requireRole(["OWNER", "ADMIN"]);

  const orders = await prisma.rentalOrder.findMany({
    where: {
      items: {
        some: {
          product: {
            ownerId: owner.id,
          },
        },
      },
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
      shipping: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
