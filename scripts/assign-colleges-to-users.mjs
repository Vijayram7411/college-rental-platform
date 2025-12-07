import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Assigning colleges to existing users...");

  const users = await prisma.user.findMany({
    where: { collegeId: null },
  });

  if (users.length === 0) {
    console.log("✅ All users already have colleges assigned!");
    return;
  }

  for (const user of users) {
    if (!user.email) {
      console.log(`⏭️  Skipping user ${user.id} (no email)`);
      continue;
    }

    const emailDomain = user.email.split("@")[1]?.toLowerCase();
    
    if (!emailDomain) {
      console.log(`⏭️  Skipping user ${user.email} (invalid email)`);
      continue;
    }

    let college = await prisma.college.findUnique({
      where: { domain: emailDomain },
    });

    if (!college) {
      // Create college from domain
      const collegeName = emailDomain
        .split(".")[0]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      college = await prisma.college.create({
        data: {
          name: collegeName,
          domain: emailDomain,
          isActive: true,
        },
      });
      console.log(`✅ Created college: ${collegeName} (${emailDomain})`);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { collegeId: college.id },
    });

    console.log(`✅ Assigned ${user.email} to ${college.name}`);
  }

  // Also update products to match their owner's college
  console.log("\n🔄 Updating products with owner's college...");
  
  const products = await prisma.product.findMany({
    where: { collegeId: null },
    include: { owner: true },
  });

  for (const product of products) {
    if (product.owner.collegeId) {
      await prisma.product.update({
        where: { id: product.id },
        data: { collegeId: product.owner.collegeId },
      });
      console.log(`✅ Updated product "${product.title}" with college`);
    }
  }

  console.log("\n✅ College assignment complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
