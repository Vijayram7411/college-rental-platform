import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { checkoutSchema } from "@/lib/validation";
import { sendEmail, generateNewOrderEmail, generateOrderConfirmationEmail } from "@/lib/email";

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
        items: {
          include: {
            product: {
              include: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    ownerProfile: {
                      select: {
                        phone: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            ownerProfile: {
              select: {
                phone: true,
              },
            },
          },
        },
        shipping: true,
      },
    });

    // Send email notifications
    try {
      // Group items by owner to send one email per owner
      const itemsByOwner = new Map<string, typeof updatedOrder.items>();
      
      for (const item of updatedOrder.items) {
        const ownerId = item.product.owner.id;
        if (!itemsByOwner.has(ownerId)) {
          itemsByOwner.set(ownerId, []);
        }
        itemsByOwner.get(ownerId)!.push(item);
      }

      // Send email to each owner
      for (const [ownerId, items] of itemsByOwner.entries()) {
        const owner = items[0].product.owner;
        const firstItem = items[0];
        
        if (owner.email) {
          const pickupPoint = updatedOrder.shipping
            ? `${updatedOrder.shipping.line1}${updatedOrder.shipping.line2 ? ', ' + updatedOrder.shipping.line2 : ''}, ${updatedOrder.shipping.city}, ${updatedOrder.shipping.state}`
            : "Not specified";

          const itemsTotal = items.reduce(
            (sum, item) => sum + item.quantity * item.durationMonths * item.pricePerMonth,
            0
          );

          await sendEmail({
            to: owner.email,
            subject: `🎉 New Rental Order for ${firstItem.product.title}`,
            html: generateNewOrderEmail({
              ownerName: owner.name || "Owner",
              borrowerName: updatedOrder.user.name || "Borrower",
              borrowerEmail: updatedOrder.user.email || "",
              borrowerPhone: updatedOrder.user.ownerProfile?.phone || null,
              productTitle: items.length > 1 
                ? `${firstItem.product.title} and ${items.length - 1} more item(s)`
                : firstItem.product.title,
              quantity: items.reduce((sum, item) => sum + item.quantity, 0),
              duration: firstItem.durationMonths,
              totalAmount: itemsTotal,
              pickupPoint,
              orderDate: new Date(updatedOrder.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }),
          });
        }
      }

      // Send confirmation email to borrower
      if (updatedOrder.user.email) {
        const firstItem = updatedOrder.items[0];
        const pickupPoint = updatedOrder.shipping
          ? `${updatedOrder.shipping.line1}${updatedOrder.shipping.line2 ? ', ' + updatedOrder.shipping.line2 : ''}, ${updatedOrder.shipping.city}, ${updatedOrder.shipping.state}`
          : "Not specified";

        await sendEmail({
          to: updatedOrder.user.email,
          subject: `✅ Order Confirmed - ${firstItem.product.title}`,
          html: generateOrderConfirmationEmail({
            borrowerName: updatedOrder.user.name || "Borrower",
            productTitle: updatedOrder.items.length > 1
              ? `${firstItem.product.title} and ${updatedOrder.items.length - 1} more item(s)`
              : firstItem.product.title,
            ownerName: firstItem.product.owner.name || "Owner",
            ownerEmail: firstItem.product.owner.email || "",
            quantity: updatedOrder.items.reduce((sum, item) => sum + item.quantity, 0),
            duration: firstItem.durationMonths,
            totalAmount: updatedOrder.totalAmount,
            pickupPoint,
            orderDate: new Date(updatedOrder.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }),
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the order
      console.error("Failed to send email notifications:", emailError);
    }

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
