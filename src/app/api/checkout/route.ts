import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { checkoutSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = checkoutSchema.parse(body);

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 },
      );
    }

    const totalAmount = cart.items.reduce(
      (sum: number, item: (typeof cart.items)[number]) => {
        return (
          sum +
          item.quantity * item.durationMonths * item.pricePerMonth
        );
      },
      0,
    );

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        line1: parsed.address.line1,
        line2: parsed.address.line2 ?? null,
        city: parsed.address.city,
        state: parsed.address.state,
        postalCode: parsed.address.postalCode,
        country: parsed.address.country,
        isDefault: true,
      },
    });

    const order = await prisma.rentalOrder.create({
      data: {
        userId: user.id,
        totalAmount,
        status: "PENDING_PAYMENT",
        shippingAddressId: address.id,
        items: {
          create: cart.items.map((item: (typeof cart.items)[number]) => ({
            productId: item.productId,
            quantity: item.quantity,
            durationMonths: item.durationMonths,
            pricePerMonth: item.pricePerMonth,
            originalPricePerMonth: item.originalPricePerMonth,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // For now we simulate instant payment success
    const updatedOrder = await prisma.rentalOrder.update({
      where: { id: order.id },
      data: {
        status: "ACTIVE",
        startDate: new Date(),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(updatedOrder, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/checkout (POST)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
