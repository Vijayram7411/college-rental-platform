import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Orders for your products</h1>
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-600">No orders for your products yet.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {orders.map((order: any) => (
              <li
                key={order.id}
                className="rounded-lg border border-zinc-200 bg-white p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-zinc-500">Order #{order.id}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleString()} · {order.status}
                    </p>
                    <p className="text-xs text-zinc-600">
                      Renter: {order.user.name ?? order.user.email}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-zinc-900">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>
                <ul className="mt-2 space-y-1">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="text-xs text-zinc-700">
                      {item.product.title} · {item.quantity} pcs · {item.durationMonths} months
                    </li>
                  ))}
                </ul>
                {order.shipping && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Ship to: {order.shipping.line1}, {order.shipping.city}, {order.shipping.state}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
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
