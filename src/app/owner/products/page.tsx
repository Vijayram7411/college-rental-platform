import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { ProductActions } from "@/components/product-actions";

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#212121]">Your Products</h1>
          <a
            href="/owner/products/add"
            className="rounded-sm bg-[#ff9f00] px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-[#e68a00]"
          >
            + ADD PRODUCT
          </a>
        </div>
        {products.length === 0 ? (
          <div className="flipkart-shadow rounded-sm bg-white p-8 text-center">
            <div className="mb-4 text-6xl">📦</div>
            <h3 className="mb-2 text-lg font-semibold text-[#212121]">
              No products yet
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Start listing your items for rent and earn money!
            </p>
            <a
              href="/owner/products/add"
              className="inline-block rounded-sm bg-[#2874f0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1c5bbf]"
            >
              Add Your First Product
            </a>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p: any) => (
              <div key={p.id} className="relative">
                <ProductCard product={p} />
                <ProductActions productId={p.id} productTitle={p.title} />
              </div>
            ))}
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
