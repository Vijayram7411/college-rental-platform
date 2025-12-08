import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user owns this product
    if (product.ownerId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to view this product" },
        { status: 403 }
      );
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role as string | undefined;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { ownerProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is admin OR has approved owner profile
    const isAdmin = role === "ADMIN";
    const hasApprovedProfile = user.ownerProfile?.status === "APPROVED";

    if (!isAdmin && !hasApprovedProfile) {
      return NextResponse.json(
        { error: "You need an approved owner profile to edit products" },
        { status: 403 }
      );
    }

    // Check if product exists and user owns it
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existingProduct.ownerId !== user.id && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to edit this product" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      categorySlug,
      basePricePerMonth,
      originalPricePerMonth,
      thumbnailUrl,
      images,
    } = body;

    // Validation
    if (!title || !description || !categorySlug || !basePricePerMonth) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length < 3) {
      return NextResponse.json(
        { error: "At least 3 product images are required" },
        { status: 400 }
      );
    }

    // Find or create category
    let category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      const categoryName = categorySlug
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug,
        },
      });
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        title,
        description,
        categoryId: category.id,
        basePricePerMonth,
        originalPricePerMonth,
        thumbnailUrl: thumbnailUrl || images[0],
        images: JSON.stringify(images),
      },
    });

    return NextResponse.json(
      { message: "Product updated successfully", product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role as string | undefined;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user owns this product or is admin
    if (product.ownerId !== user.id && role !== "ADMIN") {
      return NextResponse.json(
        { error: "You don't have permission to delete this product" },
        { status: 403 }
      );
    }

    // Check if product has active orders
    const activeOrders = await prisma.rentalOrder.findFirst({
      where: {
        items: {
          some: {
            productId: params.id,
          },
        },
        status: {
          in: ["PENDING", "ACTIVE"],
        },
      },
    });

    if (activeOrders) {
      return NextResponse.json(
        { error: "Cannot delete product with active orders" },
        { status: 400 }
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
