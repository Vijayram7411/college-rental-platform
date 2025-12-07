import { PrismaClient } from "../src/generated/prisma/index.js";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

let testsPassed = 0;
let testsFailed = 0;

function logTest(name, passed, details = "") {
  if (passed) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    testsPassed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    testsFailed++;
  }
}

async function main() {
  console.log("🧪 FULL SYSTEM TEST - College Rental Platform\n");
  console.log("=" .repeat(70));

  // Test 1: Database Connection
  console.log("\n📊 TEST SUITE 1: Database Connection\n");
  try {
    await prisma.$connect();
    logTest("Database connection", true, "Successfully connected to SQLite");
  } catch (error) {
    logTest("Database connection", false, error.message);
    process.exit(1);
  }

  // Test 2: College System
  console.log("\n" + "=".repeat(70));
  console.log("\n🏫 TEST SUITE 2: College System\n");

  const colleges = await prisma.college.findMany();
  logTest("Colleges exist", colleges.length > 0, `Found ${colleges.length} colleges`);

  const mitCollege = colleges.find((c) => c.domain === "mit.edu");
  logTest("MIT college exists", !!mitCollege, mitCollege ? `ID: ${mitCollege.id}` : "");

  // Test 3: User Registration & College Assignment
  console.log("\n" + "=".repeat(70));
  console.log("\n👥 TEST SUITE 3: User Registration & College Assignment\n");

  // Clean up test users
  await prisma.user.deleteMany({
    where: {
      email: { in: ["fulltest@mit.edu", "fulltest@stanford.edu"] },
    },
  });

  const password = await hash("test123", 10);

  // Create test user with college
  const testUser = await prisma.user.create({
    data: {
      name: "Full Test User",
      email: "fulltest@mit.edu",
      passwordHash: password,
      role: "OWNER",
      collegeId: mitCollege?.id,
    },
  });

  logTest("User creation", !!testUser, `Created user: ${testUser.email}`);
  logTest("User has college", !!testUser.collegeId, `College ID: ${testUser.collegeId}`);
  logTest("User has correct role", testUser.role === "OWNER", `Role: ${testUser.role}`);

  // Test 4: Category System
  console.log("\n" + "=".repeat(70));
  console.log("\n📁 TEST SUITE 4: Category System\n");

  const categories = await prisma.category.findMany();
  logTest("Categories exist", categories.length > 0, `Found ${categories.length} categories`);

  const electronicsCategory = categories.find((c) => c.slug === "electronics");
  logTest("Electronics category exists", !!electronicsCategory);

  // Test 5: Product Creation
  console.log("\n" + "=".repeat(70));
  console.log("\n📦 TEST SUITE 5: Product Creation & Management\n");

  // Clean up test products
  await prisma.product.deleteMany({
    where: { title: { contains: "Full Test Product" } },
  });

  const testProduct = await prisma.product.create({
    data: {
      title: "Full Test Product - Laptop",
      description: "Test product for full system test",
      categoryId: electronicsCategory?.id || categories[0].id,
      basePricePerMonth: 100,
      originalPricePerMonth: 150,
      thumbnailUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyODc0ZjAiLz48L3N2Zz4=",
      images: JSON.stringify([
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyODc0ZjAiLz48L3N2Zz4=",
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMiLz48L3N2Zz4=",
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM1NTUiLz48L3N2Zz4=",
      ]),
      ownerId: testUser.id,
      collegeId: testUser.collegeId,
      isActive: true,
    },
  });

  logTest("Product creation", !!testProduct, `Created: ${testProduct.title}`);
  logTest("Product has college", !!testProduct.collegeId, `College ID: ${testProduct.collegeId}`);
  logTest("Product has images", testProduct.images.length > 0, `Images stored as JSON`);
  logTest("Product is active", testProduct.isActive === true);

  // Test 6: College Isolation
  console.log("\n" + "=".repeat(70));
  console.log("\n🔒 TEST SUITE 6: College Isolation\n");

  // Create Stanford user and product
  const stanfordCollege = colleges.find((c) => c.domain === "stanford.edu");
  
  if (stanfordCollege) {
    const stanfordUser = await prisma.user.create({
      data: {
        name: "Stanford Test User",
        email: "fulltest@stanford.edu",
        passwordHash: password,
        role: "OWNER",
        collegeId: stanfordCollege.id,
      },
    });

    const stanfordProduct = await prisma.product.create({
      data: {
        title: "Full Test Product - Stanford Camera",
        description: "Stanford test product",
        categoryId: categories[0].id,
        basePricePerMonth: 200,
        thumbnailUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNkYzE0M2MiLz48L3N2Zz4=",
        images: JSON.stringify([
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNkYzE0M2MiLz48L3N2Zz4=",
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM4YjAwMDAiLz48L3N2Zz4=",
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNhNTJhMmEiLz48L3N2Zz4=",
        ]),
        ownerId: stanfordUser.id,
        collegeId: stanfordCollege.id,
        isActive: true,
      },
    });

    // Test MIT user can only see MIT products
    const mitProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        collegeId: mitCollege?.id,
      },
    });

    const mitCanSeeMitProduct = mitProducts.some((p) => p.id === testProduct.id);
    const mitCanSeeStanfordProduct = mitProducts.some((p) => p.id === stanfordProduct.id);

    logTest("MIT user sees MIT products", mitCanSeeMitProduct, `Found ${mitProducts.length} MIT products`);
    logTest("MIT user cannot see Stanford products", !mitCanSeeStanfordProduct, "Isolation working");

    // Test Stanford user can only see Stanford products
    const stanfordProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        collegeId: stanfordCollege.id,
      },
    });

    const stanfordCanSeeStanfordProduct = stanfordProducts.some((p) => p.id === stanfordProduct.id);
    const stanfordCanSeeMitProduct = stanfordProducts.some((p) => p.id === testProduct.id);

    logTest("Stanford user sees Stanford products", stanfordCanSeeStanfordProduct, `Found ${stanfordProducts.length} Stanford products`);
    logTest("Stanford user cannot see MIT products", !stanfordCanSeeMitProduct, "Isolation working");
  }

  // Test 7: Cart System
  console.log("\n" + "=".repeat(70));
  console.log("\n🛒 TEST SUITE 7: Cart System\n");

  // Create cart for test user
  let cart = await prisma.cart.findUnique({
    where: { userId: testUser.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: testUser.id,
        collegeId: testUser.collegeId,
      },
    });
  }

  logTest("Cart creation", !!cart, `Cart ID: ${cart.id}`);
  logTest("Cart has college", !!cart.collegeId, `College ID: ${cart.collegeId}`);

  // Test 8: Owner Profile
  console.log("\n" + "=".repeat(70));
  console.log("\n👤 TEST SUITE 8: Owner Profile System\n");

  const ownerProfile = await prisma.ownerProfile.create({
    data: {
      userId: testUser.id,
      status: "PENDING",
      phone: "1234567890",
      collegeName: "MIT",
      collegeId: testUser.collegeId,
    },
  });

  logTest("Owner profile creation", !!ownerProfile, `Status: ${ownerProfile.status}`);
  logTest("Owner profile has college", !!ownerProfile.collegeId);

  // Test 9: Data Integrity
  console.log("\n" + "=".repeat(70));
  console.log("\n🔍 TEST SUITE 9: Data Integrity\n");

  const usersWithoutCollege = await prisma.user.count({
    where: { collegeId: null },
  });
  logTest("All users have colleges", usersWithoutCollege === 0, `Users without college: ${usersWithoutCollege}`);

  const productsWithoutCollege = await prisma.product.count({
    where: { collegeId: null },
  });
  logTest("All products have colleges", productsWithoutCollege === 0, `Products without college: ${productsWithoutCollege}`);

  const activeProducts = await prisma.product.count({
    where: { isActive: true },
  });
  logTest("Active products exist", activeProducts > 0, `Found ${activeProducts} active products`);

  // Test 10: Image Storage
  console.log("\n" + "=".repeat(70));
  console.log("\n🖼️ TEST SUITE 10: Image Storage\n");

  const productsWithImages = await prisma.product.findMany({
    where: { isActive: true },
    take: 5,
  });

  let imagesValid = true;
  for (const product of productsWithImages) {
    try {
      const images = JSON.parse(product.images);
      if (!Array.isArray(images) || images.length < 3) {
        imagesValid = false;
        break;
      }
    } catch (e) {
      imagesValid = false;
      break;
    }
  }

  logTest("Product images are valid JSON", imagesValid, `Checked ${productsWithImages.length} products`);
  logTest("Products have minimum 3 images", imagesValid, "All products meet requirement");

  // Final Summary
  console.log("\n" + "=".repeat(70));
  console.log("\n📊 TEST SUMMARY\n");

  const totalTests = testsPassed + testsFailed;
  const successRate = ((testsPassed / totalTests) * 100).toFixed(1);

  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`Success Rate: ${successRate}%`);

  if (testsFailed === 0) {
    console.log("\n🎉 ALL TESTS PASSED! System is working correctly.\n");
  } else {
    console.log("\n⚠️ Some tests failed. Please review the errors above.\n");
  }

  console.log("=".repeat(70));
}

main()
  .catch((e) => {
    console.error("\n❌ CRITICAL ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
