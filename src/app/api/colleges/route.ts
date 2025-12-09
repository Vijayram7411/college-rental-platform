import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Fetching colleges from database...");
    
    const colleges = await prisma.college.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        domain: true,
      },
    });

    console.log(`Found ${colleges.length} colleges`);
    
    return NextResponse.json(colleges);
  } catch (error: any) {
    console.error("Error fetching colleges:", error);
    console.error("Error details:", error?.message, error?.stack);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch colleges",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Add runtime config to ensure this runs on Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
