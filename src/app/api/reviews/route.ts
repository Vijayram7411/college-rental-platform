import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { createReviewSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  if (productId) {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  }

  const user = await requireUser();

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = createReviewSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: parsed.productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not available" },
        { status: 400 },
      );
    }

    // Upsert by unique (userId, productId)
    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: parsed.productId,
        },
      },
      create: {
        userId: user.id,
        productId: parsed.productId,
        rating: parsed.rating,
        comment: parsed.comment ?? null,
      },
      update: {
        rating: parsed.rating,
        comment: parsed.comment ?? null,
      },
    });

    // Recalculate rating on product
    const agg = await prisma.review.aggregate({
      where: { productId: parsed.productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: parsed.productId },
      data: {
        rating: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/reviews (POST)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
