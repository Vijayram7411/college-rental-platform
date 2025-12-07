import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      redirect("/login?callbackUrl=/me/orders");
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      redirect("/login?callbackUrl=/me/orders");
    }

    const orders = await prisma.rentalOrder.findMany({
      where: { userId: user.id },
      include: {
        items: { include: { product: true } },
        shipping: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Your orders</h1>
          <p className="text-sm text-zinc-600">
            Track your active rentals and past orders.
          </p>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-600">You have no rental orders yet.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {orders.map((order: (typeof orders)[number]) => (
              <li
                key={order.id}
                className="rounded-lg border border-zinc-200 bg-white p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-zinc-500">#{order.id}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleString()} · {order.status}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-zinc-900">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>
                <ul className="mt-2 space-y-1">
                  {order.items.map((item: (typeof order.items)[number]) => (
                    <li key={item.id} className="text-xs text-zinc-700">
                      {item.product.title} · {item.quantity} pcs · {item.durationMonths} days
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

    console.error("Error loading orders page", error);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Your orders</h1>
        <p className="text-sm text-zinc-600">
          We couldn&apos;t load your orders right now. Please try again later.
        </p>
      </div>
    );
  }
}
