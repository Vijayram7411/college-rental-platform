import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { CatalogProductCard } from "./catalog-product-card";

export default async function CatalogPage() {
  try {
    const session = await auth();
    const collegeId = (session?.user as any)?.collegeId;

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { 
          isActive: true,
          collegeId: collegeId || undefined,
        },
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
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-gray-300 bg-white px-4 py-3 flipkart-shadow">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">Catalog</h1>
          <p className="text-sm text-gray-600">
            Browse items available for rent from students and owners.
          </p>
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="font-semibold text-[#212121]">Categories:</span>
            {categories.map((c: (typeof categories)[number]) => (
              <span
                key={c.id}
                className="rounded-sm border border-gray-300 bg-gray-50 px-2 py-0.5 text-[#212121]"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}
      </div>
      {products.length === 0 ? (
        <div className="flipkart-shadow rounded-sm bg-white p-8 text-center">
          <div className="mb-4 text-6xl">📦</div>
          <p className="text-sm text-gray-600">
            No products available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p: any) => (
            <CatalogProductCard key={p.id} product={p} />
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
