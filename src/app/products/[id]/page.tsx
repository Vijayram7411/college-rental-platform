import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ProductDetailClient } from "./product-detail-client";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Params) {
  const { id } = await params;
  
  try {
    const session = await auth();
    const userCollegeId = (session?.user as any)?.collegeId;

    const product = await prisma.product.findUnique({
      where: { id },
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

    return <ProductDetailClient product={product} />;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      typeof (error as any).digest === "string" &&
      (error as any).digest.startsWith("NEXT_")
    ) {
      throw error;
    }

    console.error("=== ERROR in Product Detail Page ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", error);
    
    return (
      <div className="flipkart-shadow space-y-4 rounded-sm bg-white p-8 text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold text-[#212121]">Product unavailable</h1>
        <p className="text-sm text-gray-600">
          We couldn&apos;t load this product right now. Please try again later.
        </p>
        <p className="mt-4 text-xs text-gray-500">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }
}
