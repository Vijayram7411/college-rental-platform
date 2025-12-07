import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function testProductDetail() {
  const productId = process.argv[2];
  
  if (!productId) {
    console.log("Usage: node scripts/test-product-detail.mjs <product-id>");
    console.log("\nAvailable products:");
    const products = await prisma.product.findMany({
      select: { id: true, title: true }
    });
    products.forEach(p => console.log(`  ${p.id} - ${p.title}`));
    await prisma.$disconnect();
    return;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
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

    if (!product) {
      console.log("❌ Product not found");
      await prisma.$disconnect();
      return;
    }

    console.log("✅ Product found:");
    console.log(`Title: ${product.title}`);
    console.log(`Active: ${product.isActive}`);
    console.log(`Category: ${product.category?.name || "N/A"}`);
    console.log(`Owner: ${product.owner.name || product.owner.email}`);
    
    // Test image parsing
    try {
      const images = product.images ? JSON.parse(product.images) : [];
      console.log(`\n✅ Images parsed successfully (${images.length} images)`);
      images.forEach((img, i) => {
        const preview = img.substring(0, 100);
        console.log(`  ${i + 1}. ${preview}...`);
      });
    } catch (e) {
      console.log(`\n❌ Error parsing images: ${e.message}`);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testProductDetail();
