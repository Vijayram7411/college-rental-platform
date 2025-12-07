import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { createProductSchema } from "@/lib/validation";

type Role = "USER" | "OWNER" | "ADMIN";

const OWNER_ROLES: Role[] = ["OWNER", "ADMIN"];

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const owner = await requireRole(OWNER_ROLES);
    const body = await request.json();
    const parsed = createProductSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        thumbnailUrl: parsed.thumbnailUrl,
        images: parsed.images,
        basePricePerMonth: parsed.basePricePerMonth,
        originalPricePerMonth: parsed.originalPricePerMonth,
        isActive: parsed.isActive ?? true,
        ownerId: owner.id,
        categoryId: parsed.categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Error in /api/products (POST)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
