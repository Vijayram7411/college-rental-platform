import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to count users
    const userCount = await prisma.user.count();
    
    // Check if College table exists
    const collegeCount = await prisma.college.count();
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: {
        userCount,
        collegeCount,
        databaseConnected: true,
      },
    });
  } catch (error: any) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Database connection failed",
        error: {
          name: error.name,
          code: error.code,
          meta: error.meta,
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
