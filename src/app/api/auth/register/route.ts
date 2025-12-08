import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { verifyBothSides } from "@/lib/id-verification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Verify college exists
    const college = await prisma.college.findUnique({
      where: { id: parsed.collegeId },
    });

    if (!college) {
      return NextResponse.json(
        { error: "Invalid college selected" },
        { status: 400 },
      );
    }

    // Verify student ID matches selected college
    const verificationResult = await verifyBothSides(
      parsed.idCardFront,
      parsed.idCardBack,
      college.name
    );

    if (!verificationResult.isValid) {
      return NextResponse.json(
        {
          error: "ID verification failed",
          message: verificationResult.message,
          details: verificationResult.details,
        },
        { status: 400 }
      );
    }

    const passwordHash = await hash(parsed.password, 10);

    // Store student ID images as JSON
    const verificationData = {
      idCardFront: parsed.idCardFront,
      idCardBack: parsed.idCardBack,
      collegeEmail: parsed.collegeEmail || null,
      phone: parsed.phone,
    };

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash,
        collegeId: parsed.collegeId,
      },
    });

    // Create owner profile automatically (everyone can list items)
    await prisma.ownerProfile.create({
      data: {
        userId: user.id,
        phone: parsed.phone,
        collegeName: college.name,
        documentUrl: JSON.stringify(verificationData),
        status: "APPROVED", // Auto-approved
        collegeId: parsed.collegeId,
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error in /api/auth/register", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
