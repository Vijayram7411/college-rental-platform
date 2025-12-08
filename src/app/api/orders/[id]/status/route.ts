import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ["PENDING_PAYMENT", "ACTIVE", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get the order
    const order = await prisma.rentalOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check permissions
    const isOwner = order.items.some(item => item.product.ownerId === user.id);
    const isBorrower = order.userId === user.id;

    if (!isOwner && !isBorrower) {
      return NextResponse.json(
        { error: "You don't have permission to update this order" },
        { status: 403 }
      );
    }

    // Validate status transitions
    if (status === "COMPLETED") {
      // Only owner can mark as completed
      if (!isOwner) {
        return NextResponse.json(
          { error: "Only the owner can mark the order as completed" },
          { status: 403 }
        );
      }
      // Can only complete ACTIVE orders
      if (order.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "Only active orders can be marked as completed" },
          { status: 400 }
        );
      }
    }

    if (status === "CANCELLED") {
      // Can't cancel completed orders
      if (order.status === "COMPLETED") {
        return NextResponse.json(
          { error: "Cannot cancel completed orders" },
          { status: 400 }
        );
      }
    }

    // Update order status
    const updatedOrder = await prisma.rentalOrder.update({
      where: { id },
      data: {
        status,
        ...(status === "COMPLETED" && { endDate: new Date() }),
      },
    });

    return NextResponse.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
