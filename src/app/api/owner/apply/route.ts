import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { ownerApplicationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = ownerApplicationSchema.parse(body);

    const existing = await prisma.ownerProfile.findUnique({
      where: { userId: user.id },
    });

    if (existing && existing.status === "PENDING") {
      return NextResponse.json(
        { error: "Owner application already pending" },
        { status: 400 },
      );
    }

    const profile = await prisma.ownerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        phone: parsed.phone,
        collegeName: parsed.collegeName,
        documentUrl: parsed.documentUrl,
        status: "PENDING",
      },
      update: {
        phone: parsed.phone,
        collegeName: parsed.collegeName,
        documentUrl: parsed.documentUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/owner/apply (POST)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
