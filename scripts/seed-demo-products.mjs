import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding demo products...");

  // Get or create a demo user (lender)
  let demoUser = await prisma.user.findFirst({
    where: { email: "demo.lender@example.com" },
  });

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        name: "Demo Lender",
        email: "demo.lender@example.com",
        passwordHash: "$2a$10$YourHashedPasswordHere", // This won't be used for login
        role: "LENDER",
        collegeName: "Demo College",
      },
    });
    console.log("✅ Created demo lender user");
  }

  // Get categories
  const electronics = await prisma.category.findFirst({ where: { slug: "electronics" } });
  const books = await prisma.category.findFirst({ where: { slug: "books" } });
  const sports = await prisma.category.findFirst({ where: { slug: "sports" } });
  const appliances = await prisma.category.findFirst({ where: { slug: "appliances" } });
  const furniture = await prisma.category.findFirst({ where: { slug: "furniture" } });

  // Demo products data
  const demoProducts = [
    {
      title: "MacBook Pro 14-inch M1",
      description: "High-performance laptop perfect for coding, design work, and video editing. Includes charger and protective case. Well maintained and regularly cleaned.",
      basePricePerMonth: 150,
      originalPricePerMonth: 200,
      categoryId: electronics?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
      ]),
      contactNumber: "9876543210",
      isActive: true,
      ownerId: demoUser.id,
      rating: 4.8,
      ratingCount: 12,
    },
    {
      title: "Canon EOS 1500D DSLR Camera",
      description: "Perfect for photography enthusiasts and beginners. Comes with 18-55mm lens, memory card, and camera bag. Great for events, portraits, and travel photography.",
      basePricePerMonth: 80,
      originalPricePerMonth: 100,
      categoryId: electronics?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
      ]),
      contactNumber: "9876543210",
      isActive: true,
      ownerId: demoUser.id,
      rating: 4.5,
      ratingCount: 8,
    },
    {
      title: "Engineering Textbook Bundle",
      description: "Complete set of 5 engineering textbooks including Mathematics, Physics, and Computer Science. All books in excellent condition with minimal highlighting.",
      basePricePerMonth: 30,
      originalPricePerMonth: 50,
      categoryId: books?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500",
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
      ]),
      contactNumber: "9876543210",
      isActive: true,
      ownerId: demoUser.id,
      rating: 4.7,
      ratingCount: 15,
    },
    {
      title: "Badminton Racket Set with Shuttlecocks",
      description: "Professional quality badminton racket set. Includes 2 rackets, 6 shuttlecocks, and carrying case. Perfect for sports enthusiasts and tournaments.",
      basePricePerMonth: 25,
      originalPricePerMonth: 35,
      categoryId: sports?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500",
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500",
      ]),
      contactNumber: "9876543210",
      isActive: true,
      ownerId: demoUser.id,
      rating: 4.6,
      ratingCount: 10,
    },
    {
      title: "Mini Refrigerator - 50L Capacity",
      description: "Compact mini fridge perfect for dorm rooms. Energy efficient, quiet operation, and includes freezer compartment. Ideal for storing snacks and beverages.",
      basePricePerMonth: 120,
      originalPricePerMonth: 150,
      categoryId: appliances?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500",
        "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500",
      ]),
      contactNumber: "9876543210",
      isActive: true,
      ownerId: demoUser.id,
      rating: 4.9,
      ratingCount: 20,
    },
  ];

  // Create products
  for (const productData of demoProducts) {
    const existing = await prisma.product.findFirst({
      where: { title: productData.title },
    });

    if (!existing) {
      await prisma.product.create({ data: productData });
      console.log(`✅ Created: ${productData.title}`);
    } else {
      console.log(`⏭️  Skipped (already exists): ${productData.title}`);
    }
  }

  console.log("✅ Demo products seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding demo products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
