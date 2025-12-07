import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export async function GET() {
  const user = await requireUser();

  const orders = await prisma.rentalOrder.findMany({
    where: { userId: user.id },
    include: {
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
