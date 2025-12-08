import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const user = await requireUser();

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        college: true,
        ownerProfile: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.image,
      role: profile.role,
      college: profile.college
        ? {
            id: profile.college.id,
            name: profile.college.name,
            domain: profile.college.domain,
          }
        : null,
      ownerProfile: profile.ownerProfile
        ? {
            phone: profile.ownerProfile.phone,
            status: profile.ownerProfile.status,
          }
        : null,
      createdAt: profile.createdAt,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
