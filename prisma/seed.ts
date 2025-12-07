import { PrismaClient } from "../src/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Books", slug: "books" },
    { name: "Furniture", slug: "furniture" },
    { name: "Sports", slug: "sports" },
    { name: "Musical Instruments", slug: "musical-instruments" },
    { name: "Appliances", slug: "appliances" },
    { name: "Clothing", slug: "clothing" },
    { name: "Tools", slug: "tools" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
