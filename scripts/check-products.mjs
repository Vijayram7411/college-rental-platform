import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function checkProducts() {
  console.log("📦 Checking Products in Database\n");

  try {
    const products = await prisma.product.findMany({
      include: { category: true, owner: true },
      orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) {
      console.log("❌ No products found in database");
      console.log("\nTo add a product:");
      console.log("1. Make yourself admin: node scripts/make-admin.mjs your-email@example.com");
      console.log("2. Go to: http://localhost:3000/owner/products/add");
      console.log("3. Fill the form and submit");
      return;
    }

    console.log(`✅ Found ${products.length} product(s)\n`);

    products.forEach((product, index) => {
      console.log(`--- Product ${index + 1} ---`);
      console.log(`ID: ${product.id}`);
      console.log(`Title: ${product.title}`);
      console.log(`Category: ${product.category?.name || "N/A"}`);
      console.log(`Owner: ${product.owner?.name || product.owner?.email || "N/A"}`);
      console.log(`Price: ₹${product.basePricePerMonth}/month`);
      console.log(`Active: ${product.isActive ? "Yes" : "No"}`);
      console.log(`Thumbnail: ${product.thumbnailUrl || "N/A"}`);
      
      // Parse images
      let images = [];
      try {
        images = product.images ? JSON.parse(product.images) : [];
      } catch (e) {
        console.log(`Images: ERROR parsing - ${product.images}`);
      }
      
      if (images.length > 0) {
        console.log(`Images (${images.length}):`);
        images.forEach((img, i) => {
          console.log(`  ${i + 1}. ${img}`);
        });
      } else {
        console.log(`Images: None`);
      }
      
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
