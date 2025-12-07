import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function deleteProduct() {
  const productId = process.argv[2];

  if (!productId) {
    console.log("❌ Usage: node scripts/delete-product.mjs <product-id>");
    console.log("\n📦 Available products:");
    const products = await prisma.product.findMany({
      select: { id: true, title: true, owner: { select: { name: true, email: true } } }
    });
    products.forEach(p => {
      console.log(`  ${p.id}`);
      console.log(`    Title: ${p.title}`);
      console.log(`    Owner: ${p.owner.name || p.owner.email}`);
      console.log("");
    });
    await prisma.$disconnect();
    return;
  }

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true }
    });

    if (!product) {
      console.log(`❌ Product with ID "${productId}" not found`);
      await prisma.$disconnect();
      return;
    }

    console.log(`🗑️  Deleting product: ${product.title}`);
    
    // Delete the product
    await prisma.product.delete({
      where: { id: productId }
    });

    console.log("✅ Product deleted successfully!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteProduct();
