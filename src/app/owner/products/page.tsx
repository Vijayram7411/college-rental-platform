import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function OwnerProductsPage() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role as string | undefined;

    if (!session?.user?.email) {
      redirect("/login?callbackUrl=/owner/products");
    }

    if (role !== "OWNER" && role !== "ADMIN") {
      redirect("/");
    }

    const owner = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!owner) {
      redirect("/login?callbackUrl=/owner/products");
    }

    const products = await prisma.product.findMany({
      where: { ownerId: owner.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Your products</h1>
        {products.length === 0 ? (
          <p className="text-sm text-zinc-600">
            You haven&apos;t listed any products yet. Use the admin tools or API to
            create products.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {products.map((p: any) => (
              <li
                key={p.id}
                className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900">{p.title}</p>
                  <p className="text-xs text-zinc-600">
                    {p.category?.name ?? "Uncategorized"} · ₹{p.basePricePerMonth} / month
                  </p>
                  {!p.isActive && (
                    <p className="mt-1 inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                      Inactive
                    </p>
                  )}
                </div>
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

    console.error("Error loading owner products page", error);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Your products</h1>
        <p className="text-sm text-zinc-600">
          We couldn&apos;t load your products right now. Please try again later.
        </p>
      </div>
    );
  }
}
