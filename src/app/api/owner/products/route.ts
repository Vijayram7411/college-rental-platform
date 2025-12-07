import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role as string | undefined;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN and OWNER can add products
    if (role !== "ADMIN" && role !== "OWNER") {
      return NextResponse.json(
        { error: "Only admins and owners can add products" },
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
      // Create category if it doesn't exist
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        categoryId: category.id,
        basePricePerMonth,
        originalPricePerMonth,
        thumbnailUrl: thumbnailUrl || images[0],
        images: JSON.stringify(images), // Store as JSON string for SQLite
        ownerId: user.id,
        collegeId: user.collegeId,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Product added successfully", product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    const products = await prisma.product.findMany({
      where: { ownerId: user.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
