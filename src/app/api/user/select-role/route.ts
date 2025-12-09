import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !["BORROWER", "LENDER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be BORROWER or LENDER" },
        { status: 400 }
      );
    }

    // Update user role
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { role },
    });

    // If LENDER, ensure they have an owner profile
    if (role === "LENDER") {
      const existingProfile = await prisma.ownerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!existingProfile) {
        await prisma.ownerProfile.create({
          data: {
            userId: user.id,
            phone: user.phone || "",
            collegeName: user.collegeName || "",
            documentUrl: JSON.stringify({
              phone: user.phone,
              aadhaarNumber: user.aadhaarNumber,
              personPhoto: user.personPhoto,
            }),
            status: "APPROVED",
          },
        });
      }
    }

    return NextResponse.json({
      message: "Role updated successfully",
      role: user.role,
    });
  } catch (error: any) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
