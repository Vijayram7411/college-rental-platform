import { PrismaClient } from "@prisma/client";

// The `@prisma/extension-accelerate` extension is optional. Some environments
// where this project is built may not have the package installed which causes
// TypeScript/Build failures. Use a plain Prisma client here to keep the seed
// script portable. If you want the extension features, install the package
// and restore the `$extends(withAccelerate())` usage.

const prisma = new PrismaClient();

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
