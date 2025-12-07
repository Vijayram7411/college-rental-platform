import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function makeAdmin() {
  console.log("🔧 Make User Admin\n");

  // Get email from command line argument
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Please provide an email address");
    console.log("\nUsage: node scripts/make-admin.mjs your-email@example.com");
    process.exit(1);
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    // Update to ADMIN
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`✅ Successfully made ${email} an ADMIN`);
    console.log(`\nUser Details:`);
    console.log(`  Name: ${user.name || "N/A"}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ADMIN`);
    console.log(`\nYou can now access:`);
    console.log(`  - Admin Owners: http://localhost:3000/admin/owners`);
    console.log(`  - Admin Actions: http://localhost:3000/admin/actions`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
