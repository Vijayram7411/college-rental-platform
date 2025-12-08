import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Fixing college IDs...");

  // Get the first college
  const college = await prisma.college.findFirst();
  if (!college) {
    console.error("❌ No college found.");
    return;
  }

  console.log(`✅ Using college: ${college.name} (${college.id})`);

  // Update all users to be in this college
  const userResult = await prisma.user.updateMany({
    where: {
      collegeId: { not: college.id },
    },
    data: {
      collegeId: college.id,
    },
  });

  console.log(`✅ Updated ${userResult.count} users to college ${college.name}`);

  // Update all products to be in this college
  const productResult = await prisma.product.updateMany({
    where: {
      collegeId: { not: college.id },
    },
    data: {
      collegeId: college.id,
    },
  });

  console.log(`✅ Updated ${productResult.count} products to college ${college.name}`);

  console.log("✅ All done!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
