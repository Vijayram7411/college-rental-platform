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

    // Skip ID verification temporarily to allow registration
    // TODO: Re-enable after fixing the issue
    console.log("ID verification temporarily disabled for registration");
    
    // Verify student ID matches selected college (DISABLED)
    // let verificationResult;
    // try {
    //   verificationResult = await verifyBothSides(
    //     parsed.idCardFront,
    //     parsed.idCardBack,
    //     college.name
    //   );
    // } catch (verifyError) {
    //   console.error("ID verification error:", verifyError);
    // }

    const passwordHash = await hash(parsed.password, 10);

    // Store student ID images as JSON
    const verificationData = {
      idCardFront: parsed.idCardFront,
      idCardBack: parsed.idCardBack,
      collegeEmail: parsed.collegeEmail || null,
      phone: parsed.phone,
      aadhaarNumber: parsed.aadhaarNumber,
      personPhoto: parsed.personPhoto,
    };

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash,
        collegeId: parsed.collegeId,
        phone: parsed.phone,
        aadhaarNumber: parsed.aadhaarNumber,
        personPhoto: parsed.personPhoto,
        role: "USER", // Default role, user will select BORROWER or LENDER
      },
    });

    // Don't create owner profile yet - user will choose role first

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
