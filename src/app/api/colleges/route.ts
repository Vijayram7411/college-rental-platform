import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("[Colleges API] Starting request...");
    console.log("[Colleges API] Prisma client:", typeof prisma);
    
    const colleges = await prisma.college.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        domain: true,
      },
    });

    console.log("[Colleges API] Found colleges:", colleges.length);
    return NextResponse.json(colleges);
  } catch (error: any) {
    console.error("[Colleges API] Error:", error);
    console.error("[Colleges API] Error message:", error?.message);
    console.error("[Colleges API] Error stack:", error?.stack);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to fetch colleges",
        message: error?.message || "Unknown error",
        type: error?.constructor?.name || "Unknown"
      },
      { status: 500 }
    );
  }
}
