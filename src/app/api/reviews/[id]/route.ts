import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { updateReviewSchema } from "@/lib/validation";

type ReviewRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: ReviewRouteContext) {
  try {
    const { id } = await context.params;
    const user = await requireUser();
    const body = await request.json();
    const parsed = updateReviewSchema.parse({ ...body, id });

    const existing = await prisma.review.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { rating, comment } = parsed;

    const review = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ?? undefined,
        comment: comment ?? undefined,
      },
    });

    // Recalculate product rating
    const agg = await prisma.review.aggregate({
      where: { productId: review.productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      },
    });

    return NextResponse.json(review);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/reviews/[id] (PATCH)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: ReviewRouteContext) {
  try {
    const { id } = await context.params;
    const user = await requireUser();

    const existing = await prisma.review.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    const agg = await prisma.review.aggregate({
      where: { productId: existing.productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: existing.productId },
      data: {
        rating: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/reviews/[id] (DELETE)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
