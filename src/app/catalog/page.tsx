import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function CatalogPage() {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    return renderCatalog(products, categories);
  } catch (error) {
    console.error("Error loading catalog page", error);
    return renderCatalogError();
  }
}

function renderCatalog(
  products: Awaited<ReturnType<typeof prisma.product.findMany>>,
  categories: Awaited<ReturnType<typeof prisma.category.findMany>>,
) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Catalog</h1>
          <p className="text-sm text-zinc-600">
            Browse items available for rent from students and owners.
          </p>
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
            <span className="font-medium text-zinc-700">Categories:</span>
            {categories.map((c: (typeof categories)[number]) => (
              <span
                key={c.id}
                className="rounded-full border border-zinc-300 px-2 py-0.5 text-zinc-700"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}
      </div>
      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
          No products available yet. Check back soon!
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: any) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5 hover:border-zinc-300"
            >
              <div className="aspect-video w-full bg-gradient-to-br from-zinc-100 to-zinc-200" />
              <div className="space-y-1 px-3 py-2">
                <h2 className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:underline">
                  {p.title}
                </h2>
                <p className="text-xs text-zinc-500">
                  {p.category?.name ?? "Uncategorized"}
                </p>
                <p className="text-sm font-medium text-zinc-900">
                  ₹{p.basePricePerMonth} / month
                </p>
                {p.rating !== null && p.ratingCount !== null && p.ratingCount > 0 && (
                  <p className="text-xs text-zinc-500">
                    Rating {p.rating.toFixed(1)} ({p.ratingCount} reviews)
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function renderCatalogError() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Catalog</h1>
      <p className="text-sm text-zinc-600">
        We couldn&apos;t load the catalog right now. Please try again later.
      </p>
    </div>
  );
}
