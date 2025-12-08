import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OwnerOrdersClient } from "./owner-orders-client";

export default async function OwnerOrdersPage() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role as string | undefined;

    if (!session?.user?.email) {
      redirect("/login?callbackUrl=/owner/orders");
    }

    if (role !== "OWNER" && role !== "ADMIN") {
      redirect("/");
    }

    const owner = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!owner) {
      redirect("/login?callbackUrl=/owner/orders");
    }

    const orders = await prisma.rentalOrder.findMany({
      where: {
        items: {
          some: {
            product: {
              ownerId: owner.id,
            },
          },
        },
      },
      include: {
        user: true,
        items: { include: { product: true } },
        shipping: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return <OwnerOrdersClient initialOrders={orders as any} />;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      typeof (error as any).digest === "string" &&
      (error as any).digest.startsWith("NEXT_")
    ) {
      throw error;
    }

    console.error("Error loading owner orders page", error);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Orders for your products</h1>
        <p className="text-sm text-zinc-600">
          We couldn&apos;t load your orders right now. Please try again later.
        </p>
      </div>
    );
  }
}
