import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

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

    // College is now stored as simple text field
    // ID verification is disabled
    console.log("Registering user with college:", parsed.collegeId);

    const passwordHash = await hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash,
        collegeName: parsed.collegeId, // Store college name as text
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
