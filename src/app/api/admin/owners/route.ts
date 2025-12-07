import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { adminOwnerDecisionSchema } from "@/lib/validation";

export async function GET() {
  await requireRole("ADMIN");

  const owners = await prisma.ownerProfile.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(owners);
}

export async function POST(request: Request) {
  try {
    const admin = await requireRole("ADMIN");
    const body = await request.json();
    const parsed = adminOwnerDecisionSchema.parse(body);

    const profile = await prisma.ownerProfile.findUnique({
      where: { id: parsed.ownerProfileId },
      include: { user: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Owner profile not found" }, { status: 404 });
    }

    const newStatus = parsed.action === "APPROVE" ? "APPROVED" : "REJECTED";

    const updatedProfile = await prisma.ownerProfile.update({
      where: { id: profile.id },
      data: {
        status: newStatus,
        user: parsed.action === "APPROVE"
          ? {
              update: {
                role: "OWNER",
              },
            }
          : undefined,
      },
      include: { user: true },
    });

    await prisma.adminActionLog.create({
      data: {
        adminId: admin.id,
        targetUserId: profile.userId,
        type: parsed.action === "APPROVE" ? "OWNER_APPROVED" : "OWNER_REJECTED",
        metadata: JSON.stringify({
          ownerProfileId: profile.id,
        }),
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Error in /api/admin/owners (POST)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
