import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { AddToCartForm } from "@/components/add-to-cart-form";

interface Params {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Params) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        owner: true,
        reviews: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product || !product.isActive) {
      notFound();
    }

    return (
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">{product.title}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {product.category?.name && <span>{product.category.name} · </span>}
              Owned by {product.owner.name ?? "owner"}
            </p>
          </div>
          <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
          <p className="whitespace-pre-wrap text-sm text-zinc-700">
            {product.description}
          </p>
          <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 shadow-sm">
            <p>
              <span className="font-medium text-zinc-900">Price:</span>{" "}
              ₹{product.basePricePerMonth} / month
            </p>
            {product.originalPricePerMonth && (
              <p className="text-xs text-zinc-500">
                Original: ₹{product.originalPricePerMonth} / month
              </p>
            )}
            {product.rating !== null && product.ratingCount !== null && product.ratingCount > 0 && (
              <p className="text-xs text-zinc-500">
                Rating {product.rating.toFixed(1)} ({product.ratingCount} reviews)
              </p>
            )}
          </div>
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-900">Reviews</h2>
            {product.reviews.length === 0 ? (
              <p className="text-sm text-zinc-600">No reviews yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {product.reviews.map((r: any) => (
                  <li key={r.id} className="rounded-md border border-zinc-200 bg-white p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-900">
                        {r.user.name ?? r.user.email ?? "User"}
                      </span>
                      <span className="text-xs text-zinc-500">{r.rating} / 5</span>
                    </div>
                    {r.comment && (
                      <p className="mt-1 text-xs text-zinc-700">{r.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-zinc-500">
              After renting this item you&apos;ll be able to leave a review from your
              orders page.
            </p>
          </section>
        </div>
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <AddToCartForm productId={product.id} />
          <Link
            href="/cart"
            className="block rounded-md border border-zinc-300 px-3 py-2 text-center text-sm font-medium text-zinc-800 hover:bg-zinc-100"
          >
            Go to cart
          </Link>
        </div>
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

    console.error("Error loading product detail page", error);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Product unavailable</h1>
        <p className="text-sm text-zinc-600">
          We couldn&apos;t load this product right now. Please try again later.
        </p>
      </div>
    );
  }
}
