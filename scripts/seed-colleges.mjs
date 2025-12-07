import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🏫 Seeding colleges...");

  const colleges = [
    { name: "MIT", domain: "mit.edu" },
    { name: "Stanford", domain: "stanford.edu" },
    { name: "Harvard", domain: "harvard.edu" },
    { name: "Berkeley", domain: "berkeley.edu" },
    { name: "Example College", domain: "example.edu" },
  ];

  for (const college of colleges) {
    const existing = await prisma.college.findUnique({
      where: { domain: college.domain },
    });

    if (!existing) {
      await prisma.college.create({
        data: {
          name: college.name,
          domain: college.domain,
          isActive: true,
        },
      });
      console.log(`✅ Created college: ${college.name} (${college.domain})`);
    } else {
      console.log(`⏭️  College already exists: ${college.name}`);
    }
  }

  console.log("✅ College seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding colleges:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
