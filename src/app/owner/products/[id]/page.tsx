import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OwnerProductDetailClient } from "./owner-product-detail-client";

export default async function OwnerProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const session = await auth();
    const role = (session?.user as any)?.role as string | undefined;

    if (!session?.user?.email) {
      redirect("/login?callbackUrl=/owner/products");
    }

    if (role !== "OWNER" && role !== "ADMIN" && role !== "LENDER") {
      redirect("/");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      redirect("/login?callbackUrl=/owner/products");
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      redirect("/owner/products");
    }

    // Check if user owns this product
    if (product.ownerId !== user.id && role !== "ADMIN") {
      redirect("/owner/products");
    }

    return (
      <div className="space-y-4">
        <OwnerProductDetailClient product={product} />
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

    console.error("Error loading product detail:", error);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Product not found
        </h1>
        <p className="text-sm text-zinc-600">
          We couldn&apos;t load this product. Please try again later.
        </p>
      </div>
    );
  }
}
