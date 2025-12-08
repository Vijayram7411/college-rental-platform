import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

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

async function main() {
  console.log("Seeding categories...");
  
  for (const category of categories) {
    try {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
      console.log(`✓ ${category.name}`);
    } catch (error) {
      console.error(`✗ ${category.name}:`, error.message);
    }
  }
  
  console.log("\n✅ Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
