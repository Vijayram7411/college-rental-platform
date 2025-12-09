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
    let verificationResult;
    try {
      verificationResult = await verifyBothSides(
        parsed.idCardFront,
        parsed.idCardBack,
        college.name
      );

      // Only block registration if verification explicitly failed (not if it's unavailable)
      if (!verificationResult.isValid && 
          !verificationResult.message.includes("unavailable") &&
          !verificationResult.message.includes("skipped")) {
        return NextResponse.json(
          {
            error: "ID verification failed",
            message: verificationResult.message,
            details: verificationResult.details,
          },
          { status: 400 }
        );
      }
    } catch (verifyError) {
      console.error("ID verification error:", verifyError);
      // Continue with registration if verification fails
      verificationResult = {
        isValid: true,
        message: "ID verification skipped due to error",
        details: { front: { extractedCollege: "N/A", confidence: "low" }, back: { extractedCollege: "N/A", confidence: "low" } }
      };
    }

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
