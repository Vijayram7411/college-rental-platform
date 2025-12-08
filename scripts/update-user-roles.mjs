import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function updateUserRoles() {
  try {
    console.log("🔄 Updating user roles...");

    // Find all users with approved owner profiles but USER role
    const usersToUpdate = await prisma.user.findMany({
      where: {
        role: "USER",
        ownerProfile: {
          status: "APPROVED",
        },
      },
      include: {
        ownerProfile: true,
      },
    });

    console.log(`Found ${usersToUpdate.length} users to update`);

    // Update each user's role to OWNER
    for (const user of usersToUpdate) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "OWNER" },
      });
      console.log(`✓ Updated ${user.email} to OWNER role`);
    }

    console.log("\n✅ All users updated successfully!");
    console.log(`Total users updated: ${usersToUpdate.length}`);
  } catch (error) {
    console.error("❌ Error updating user roles:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRoles();
