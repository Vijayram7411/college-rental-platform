import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { CatalogClient } from "./catalog-client";

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

    return <CatalogClient products={products as any} categories={categories as any} />;
  } catch (error) {
    console.error("Error loading catalog page", error);
    return renderCatalogError();
  }
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
