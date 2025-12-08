import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        domain: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
