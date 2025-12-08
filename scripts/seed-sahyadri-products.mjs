import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Sahyadri College products...");

  // Find Sahyadri College
  const college = await prisma.college.findFirst({
    where: { 
      OR: [
        { name: { contains: "Sahyadri" } },
        { name: { contains: "SCEM" } },
      ]
    },
  });

  if (!college) {
    console.error("❌ Sahyadri College not found. Please run seed-mangalore-colleges.mjs first.");
    return;
  }

  console.log(`✅ Found college: ${college.name}`);

  // Get or create a demo user for Sahyadri
  let demoUser = await prisma.user.findFirst({
    where: { 
      email: "sahyadri.lender@example.com",
    },
  });

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        name: "Sahyadri Demo Lender",
        email: "sahyadri.lender@example.com",
        passwordHash: "$2a$10$YourHashedPasswordHere",
        role: "LENDER",
        college: {
          connect: { id: college.id },
        },
      },
    });
    console.log("✅ Created Sahyadri demo lender user");
  }

  // Get categories
  const electronics = await prisma.category.findFirst({ where: { slug: "electronics" } });
  const books = await prisma.category.findFirst({ where: { slug: "books" } });
  const sports = await prisma.category.findFirst({ where: { slug: "sports" } });
  const clothing = await prisma.category.findFirst({ where: { slug: "clothing" } });
  const musicalInstruments = await prisma.category.findFirst({ where: { slug: "musical-instruments" } });

  // Sahyadri-specific demo products
  const sahyadriProducts = [
    {
      title: "HP Pavilion Gaming Laptop",
      description: "Perfect for gaming and coding. Intel i5, 8GB RAM, GTX 1650 graphics. Includes gaming mouse and cooling pad. Great for CS students and gamers.",
      basePricePerMonth: 120,
      originalPricePerMonth: 160,
      categoryId: electronics?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
      ]),
      contactNumber: "9123456789",
      isActive: true,
      ownerId: demoUser.id,
      collegeId: college.id,
      rating: 4.7,
      ratingCount: 9,
    },
    {
      title: "Wireless Bluetooth Headphones",
      description: "Sony WH-1000XM4 with active noise cancellation. Perfect for studying, music, and online classes. 30-hour battery life with quick charging.",
      basePricePerMonth: 40,
      originalPricePerMonth: 55,
      categoryId: electronics?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
      ]),
      contactNumber: "9123456789",
      isActive: true,
      ownerId: demoUser.id,
      collegeId: college.id,
      rating: 4.9,
      ratingCount: 14,
    },
    {
      title: "Complete Engineering Notes Bundle",
      description: "Handwritten notes for Semester 3-4 covering all subjects. Includes solved previous year papers and important formulas. Perfect for exam preparation.",
      basePricePerMonth: 20,
      originalPricePerMonth: 30,
      categoryId: books?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500",
        "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=500",
      ]),
      contactNumber: "9123456789",
      isActive: true,
      ownerId: demoUser.id,
      collegeId: college.id,
      rating: 4.8,
      ratingCount: 18,
    },
    {
      title: "Cricket Kit - Complete Set",
      description: "Professional cricket kit with bat, pads, gloves, helmet, and bag. Perfect for college tournaments and practice sessions. Well maintained equipment.",
      basePricePerMonth: 35,
      originalPricePerMonth: 50,
      categoryId: sports?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500",
        "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=500",
      ]),
      contactNumber: "9123456789",
      isActive: true,
      ownerId: demoUser.id,
      collegeId: college.id,
      rating: 4.6,
      ratingCount: 11,
    },
    {
      title: "Formal Blazer - Black",
      description: "Premium quality black blazer perfect for presentations, interviews, and college events. Size: Medium. Dry cleaned and well maintained.",
      basePricePerMonth: 15,
      originalPricePerMonth: 25,
      categoryId: clothing?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
      ]),
      contactNumber: "9123456789",
      isActive: true,
      ownerId: demoUser.id,
      collegeId: college.id,
      rating: 4.5,
      ratingCount: 7,
    },
    {
      title: "Acoustic Guitar with Accessories",
      description: "Yamaha F310 acoustic guitar with carry bag, extra strings, picks, and tuner. Perfect for beginners and college band practice. Great sound quality.",
      basePricePerMonth: 60,
      originalPricePerMonth: 80,
      categoryId: musicalInstruments?.id || null,
      thumbnailUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500",
        "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=500",
      ]),
      contactNumber: "9123456789",
      isActive: true,
      ownerId: demoUser.id,
      collegeId: college.id,
      rating: 4.9,
      ratingCount: 13,
    },
  ];

  // Create products
  for (const productData of sahyadriProducts) {
    const existing = await prisma.product.findFirst({
      where: { 
        title: productData.title,
        collegeId: college.id,
      },
    });

    if (!existing) {
      await prisma.product.create({ data: productData });
      console.log(`✅ Created: ${productData.title}`);
    } else {
      console.log(`⏭️  Skipped (already exists): ${productData.title}`);
    }
  }

  console.log(`✅ Sahyadri College products seeding completed!`);
  console.log(`📍 College: ${college.name}`);
  console.log(`📦 Total products added: ${sahyadriProducts.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Sahyadri products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
