import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function GET() {
  await requireRole("ADMIN");

  const actions = await prisma.adminActionLog.findMany({
    include: {
      admin: true,
      targetUser: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(actions);
}
