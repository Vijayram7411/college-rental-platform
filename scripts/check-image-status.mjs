import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function checkImageStatus() {
  console.log("🖼️  Checking Image Status\n");

  try {
    const products = await prisma.product.findMany({
      include: { category: true, owner: true },
      orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) {
      console.log("❌ No products found");
      return;
    }

    console.log(`Found ${products.length} product(s)\n`);

    products.forEach((product, index) => {
      console.log(`--- Product ${index + 1}: ${product.title} ---`);
      console.log(`ID: ${product.id}`);
      console.log(`Owner: ${product.owner?.name || product.owner?.email}`);
      console.log(`Category: ${product.category?.name || "N/A"}`);
      console.log(`Active: ${product.isActive ? "Yes" : "No"}`);
      
      // Parse images
      let images = [];
      let imageType = "Unknown";
      try {
        images = product.images ? JSON.parse(product.images) : [];
        
        if (images.length > 0) {
          const firstImage = images[0];
          if (firstImage.startsWith("data:image")) {
            imageType = "✅ Base64 (Will display correctly)";
          } else if (firstImage.startsWith("http")) {
            if (firstImage.includes("drive.google.com")) {
              imageType = "❌ Google Drive link (Won't display)";
            } else {
              imageType = "⚠️  External URL (May or may not work)";
            }
          }
        }
      } catch (e) {
        imageType = "❌ Error parsing images";
      }
      
      console.log(`Images: ${images.length} images`);
      console.log(`Type: ${imageType}`);
      console.log(`Thumbnail: ${product.thumbnailUrl ? "Set" : "Not set"}`);
      
      if (images.length > 0) {
        console.log(`First image preview: ${images[0].substring(0, 80)}...`);
      }
      
      console.log("");
    });

    console.log("\n📋 Summary:");
    const base64Count = products.filter(p => {
      try {
        const images = p.images ? JSON.parse(p.images) : [];
        return images.length > 0 && images[0].startsWith("data:image");
      } catch {
        return false;
      }
    }).length;

    const driveCount = products.filter(p => {
      try {
        const images = p.images ? JSON.parse(p.images) : [];
        return images.length > 0 && images[0].includes("drive.google.com");
      } catch {
        return false;
      }
    }).length;

    console.log(`✅ Products with base64 images (working): ${base64Count}`);
    console.log(`❌ Products with Google Drive links (not working): ${driveCount}`);
    console.log(`📦 Total products: ${products.length}`);

    if (driveCount > 0) {
      console.log("\n⚠️  Recommendation:");
      console.log("Delete products with Google Drive links and re-upload with actual image files.");
      console.log("Use: node scripts/delete-product.mjs <product-id>");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkImageStatus();
