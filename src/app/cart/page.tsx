import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CartItemsClient } from "@/components/cart-items-client";

export default async function CartPage() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      redirect("/login?callbackUrl=/cart");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      redirect("/login?callbackUrl=/cart");
    }

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

    const total =
      cart?.items.reduce(
        (
          sum: number,
          item: (typeof cart.items)[number],
        ) => sum + item.quantity * item.durationMonths * item.pricePerMonth,
        0,
      ) ?? 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Cart</h1>
            <p className="text-sm text-zinc-600">
              Review your items before checking out.
            </p>
          </div>
          {cart && cart.items.length > 0 && (
            <Link
              href="/checkout"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800"
            >
              Proceed to checkout
            </Link>
          )}
        </div>
        {!cart || cart.items.length === 0 ? (
          <p className="text-sm text-zinc-600">
            Your cart is empty. Browse the{" "}
            <Link href="/catalog" className="text-zinc-900 underline-offset-2 hover:underline">
              catalog
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-3">
            <CartItemsClient items={cart.items} />
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800 shadow-sm">
              <p className="flex items-center justify-between">
                <span>Total estimated amount</span>
                <span className="text-base font-semibold">₹{total}</span>
              </p>
            </div>
          </div>
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

    console.error("Error loading cart page", error);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Cart</h1>
        <p className="text-sm text-zinc-600">
          We couldn&apos;t load your cart right now. Please try again later.
        </p>
      </div>
    );
  }
}
