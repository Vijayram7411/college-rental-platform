import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🏫 College System Status\n");

  // List all colleges
  const colleges = await prisma.college.findMany({
    include: {
      _count: {
        select: {
          users: true,
          products: true,
        },
      },
    },
  });

  console.log("📋 Colleges:");
  console.log("─".repeat(60));
  for (const college of colleges) {
    console.log(`\n🏫 ${college.name}`);
    console.log(`   Domain: ${college.domain}`);
    console.log(`   Active: ${college.isActive ? "✅" : "❌"}`);
    console.log(`   Users: ${college._count.users}`);
    console.log(`   Products: ${college._count.products}`);
  }

  // Check users without colleges
  const usersWithoutCollege = await prisma.user.count({
    where: { collegeId: null },
  });

  console.log("\n" + "─".repeat(60));
  console.log(`\n👥 Users without college: ${usersWithoutCollege}`);

  // Check products without colleges
  const productsWithoutCollege = await prisma.product.count({
    where: { collegeId: null },
  });

  console.log(`📦 Products without college: ${productsWithoutCollege}`);

  if (usersWithoutCollege > 0 || productsWithoutCollege > 0) {
    console.log("\n⚠️  Run 'node scripts/assign-colleges-to-users.mjs' to fix this");
  } else {
    console.log("\n✅ All users and products have colleges assigned!");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
