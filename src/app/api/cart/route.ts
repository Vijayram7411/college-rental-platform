import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import {
  addToCartSchema,
  updateCartItemSchema,
  deleteCartItemSchema,
} from "@/lib/validation";

export async function GET() {
  const user = await requireUser();

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(cart ?? null);
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = addToCartSchema.parse(body);

    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
      },
      update: {},
    });

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parsed.productId,
      },
    });

    let item;
    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + parsed.quantity,
          durationMonths: parsed.durationMonths,
        },
      });
    } else {
      const product = await prisma.product.findUnique({
        where: { id: parsed.productId },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: "Product not available" },
          { status: 400 },
        );
      }

      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: parsed.quantity,
          durationMonths: parsed.durationMonths,
          pricePerMonth: product.basePricePerMonth,
          originalPricePerMonth: product.originalPricePerMonth ?? null,
        },
      });
    }

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/cart (POST)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireUser();
    const body = await request.json();
    const parsed = updateCartItemSchema.parse(body);

    const item = await prisma.cartItem.update({
      where: { id: parsed.itemId },
      data: {
        quantity: parsed.quantity ?? undefined,
        durationMonths: parsed.durationMonths ?? undefined,
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/cart (PATCH)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireUser();
    const body = await request.json();
    const parsed = deleteCartItemSchema.parse(body);

    await prisma.cartItem.delete({
      where: { id: parsed.itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/cart (DELETE)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
