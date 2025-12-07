import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    await requireRole("ADMIN");
    const body = await request.json();

    if (!body?.name || !body?.slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name: String(body.name),
        slug: String(body.slug),
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Error in /api/categories (POST)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
