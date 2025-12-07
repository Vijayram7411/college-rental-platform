import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { updateProductSchema } from "@/lib/validation";

type Role = "USER" | "OWNER" | "ADMIN";
type ProductRouteContext = {
  params: Promise<{ id: string }>;
};

const OWNER_ROLES: Role[] = ["OWNER", "ADMIN"];

export async function GET(_request: NextRequest, context: ProductRouteContext) {
  const { id } = await context.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      owner: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(request: NextRequest, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const user = await requireRole(OWNER_ROLES);
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && existing.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateProductSchema.parse(body);

    const { categoryId, ...rest } = parsed;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
      },
    });

    return NextResponse.json(product);
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

    console.error("Error in /api/products/[id] (PATCH)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const user = await requireRole(OWNER_ROLES);
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && existing.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Error in /api/products/[id] (DELETE)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
