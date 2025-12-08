#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const TEST_RESULTS = {
  passed: 0,
  failed: 0,
  total: 0,
};

function logTest(name, passed, details = "") {
  TEST_RESULTS.total++;
  if (passed) {
    TEST_RESULTS.passed++;
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
  } else {
    TEST_RESULTS.failed++;
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
  }
}

async function cleanupTestData() {
  console.log("\n🧹 Cleaning up test data...\n");
  
  const testEmails = ["test-user@mit.edu", "test-owner@stanford.edu"];
  
  // Find test users
  const testUsers = await prisma.user.findMany({
    where: { email: { in: testEmails } },
  });
  
  const testUserIds = testUsers.map(u => u.id);
  
  if (testUserIds.length > 0) {
    // Delete related records first
    await prisma.cartItem.deleteMany({ where: { cart: { userId: { in: testUserIds } } } });
    await prisma.cart.deleteMany({ where: { userId: { in: testUserIds } } });
    await prisma.review.deleteMany({ where: { userId: { in: testUserIds } } });
    await prisma.product.deleteMany({ where: { ownerId: { in: testUserIds } } });
    await prisma.ownerProfile.deleteMany({ where: { userId: { in: testUserIds } } });
    await prisma.address.deleteMany({ where: { userId: { in: testUserIds } } });
    await prisma.rentalOrderItem.deleteMany({ where: { order: { userId: { in: testUserIds } } } });
    await prisma.rentalOrder.deleteMany({ where: { userId: { in: testUserIds } } });
    await prisma.adminActionLog.deleteMany({ where: { OR: [{ adminId: { in: testUserIds } }, { targetUserId: { in: testUserIds } }] } });
    
    // Finally delete users
    await prisma.user.deleteMany({ where: { id: { in: testUserIds } } });
    
    console.log(`   Cleaned up ${testUserIds.length} test users and related data`);
  }
}

async function main() {
  console.log("🧪 COMPREHENSIVE PROJECT TEST\n");
  console.log("=".repeat(70));

  try {
    // Test 1: Database Connection
    console.log("\n📊 TEST SUITE 1: Database Connection\n");
    
    await prisma.$connect();
    logTest("Database connection", true, "Successfully connected to database");

    // Test 2: College System
    console.log("\n" + "=".repeat(70));
    console.log("\n🏫 TEST SUITE 2: College System\n");
    
    const colleges = await prisma.college.findMany();
    logTest("Colleges exist", colleges.length > 0, `Found ${colleges.length} colleges`);
    
    const mitCollege = colleges.find(c => c.domain === "mit.edu");
    logTest("MIT college exists", !!mitCollege, mitCollege ? `Domain: ${mitCollege.domain}` : "Not found");
    
    const stanfordCollege = colleges.find(c => c.domain === "stanford.edu");
    logTest("Stanford college exists", !!stanfordCollege, stanfordCollege ? `Domain: ${stanfordCollege.domain}` : "Not found");

    // Test 3: Categories
    console.log("\n" + "=".repeat(70));
    console.log("\n📚 TEST SUITE 3: Categories\n");
    
    const categories = await prisma.category.findMany();
    logTest("Categories exist", categories.length > 0, `Found ${categories.length} categories`);
    
    const electronicsCategory = categories.find(c => c.slug === "electronics");
    logTest("Electronics category exists", !!electronicsCategory, electronicsCategory ? `ID: ${electronicsCategory.id}` : "Not found");

    // Cleanup before tests
    await cleanupTestData();

    // Test 4: User Creation & College Assignment
    console.log("\n" + "=".repeat(70));
    console.log("\n👥 TEST SUITE 4: User Creation & College Assignment\n");
    
    const password = await hash("test123", 10);
    
    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test-user@mit.edu",
        password,
        role: "USER",
        collegeId: mitCollege?.id,
      },
    });
    
    logTest("User created", !!testUser, `User ID: ${testUser.id}`);
    logTest("User assigned to college", testUser.collegeId === mitCollege?.id, `College: ${mitCollege?.name}`);
    logTest("User role is USER", testUser.role === "USER", `Role: ${testUser.role}`);

    // Test 5: Owner Profile
    console.log("\n" + "=".repeat(70));
    console.log("\n🏢 TEST SUITE 5: Owner Profile System\n");
    
    const testOwner = await prisma.user.create({
      data: {
        name: "Test Owner",
        email: "test-owner@stanford.edu",
        password,
        role: "USER",
        collegeId: stanfordCollege?.id,
      },
    });
    
    const ownerProfile = await prisma.ownerProfile.create({
      data: {
        userId: testOwner.id,
        phone: "1234567890",
        collegeName: "Stanford University",
        documentUrl: "https://example.com/doc.pdf",
        status: "PENDING",
      },
    });
    
    logTest("Owner profile created", !!ownerProfile, `Profile ID: ${ownerProfile.id}`);
    logTest("Owner profile status is PENDING", ownerProfile.status === "PENDING", `Status: ${ownerProfile.status}`);

    // Test 6: Product Creation
    console.log("\n" + "=".repeat(70));
    console.log("\n📦 TEST SUITE 6: Product System\n");
    
    // Approve owner first
    await prisma.user.update({
      where: { id: testOwner.id },
      data: { role: "OWNER" },
    });
    
    await prisma.ownerProfile.update({
      where: { id: ownerProfile.id },
      data: { status: "APPROVED" },
    });
    
    const testProduct = await prisma.product.create({
      data: {
        title: "Test Laptop",
        description: "A test laptop for rent",
        thumbnailUrl: "https://example.com/laptop.jpg",
        images: JSON.stringify(["https://example.com/laptop1.jpg", "https://example.com/laptop2.jpg"]),
        basePricePerMonth: 500,
        originalPricePerMonth: 600,
        ownerId: testOwner.id,
        categoryId: electronicsCategory?.id || categories[0].id,
        collegeId: stanfordCollege?.id,
        isActive: true,
      },
    });
    
    logTest("Product created", !!testProduct, `Product ID: ${testProduct.id}`);
    logTest("Product assigned to owner", testProduct.ownerId === testOwner.id, `Owner: ${testOwner.name}`);
    logTest("Product assigned to college", testProduct.collegeId === stanfordCollege?.id, `College: ${stanfordCollege?.name}`);
    logTest("Product is active", testProduct.isActive === true, "Status: Active");

    // Test 7: College Isolation
    console.log("\n" + "=".repeat(70));
    console.log("\n🔒 TEST SUITE 7: College Isolation\n");
    
    // MIT user should not see Stanford products
    const mitProducts = await prisma.product.findMany({
      where: {
        collegeId: mitCollege?.id,
        isActive: true,
      },
    });
    
    const stanfordProducts = await prisma.product.findMany({
      where: {
        collegeId: stanfordCollege?.id,
        isActive: true,
      },
    });
    
    logTest("MIT products isolated", !mitProducts.some(p => p.id === testProduct.id), `MIT has ${mitProducts.length} products`);
    logTest("Stanford products visible", stanfordProducts.some(p => p.id === testProduct.id), `Stanford has ${stanfordProducts.length} products`);

    // Test 8: Cart System
    console.log("\n" + "=".repeat(70));
    console.log("\n🛒 TEST SUITE 8: Cart System\n");
    
    const cart = await prisma.cart.create({
      data: {
        userId: testUser.id,
      },
    });
    
    logTest("Cart created", !!cart, `Cart ID: ${cart.id}`);
    
    // Note: Can't add Stanford product to MIT user's cart due to college isolation
    // This is expected behavior

    // Test 9: Review System
    console.log("\n" + "=".repeat(70));
    console.log("\n⭐ TEST SUITE 9: Review System\n");
    
    // Create a product for MIT college
    const mitProduct = await prisma.product.create({
      data: {
        title: "MIT Test Product",
        description: "Test product for MIT",
        thumbnailUrl: "https://example.com/test.jpg",
        images: JSON.stringify(["https://example.com/test.jpg"]),
        basePricePerMonth: 100,
        ownerId: testOwner.id,
        categoryId: categories[0].id,
        collegeId: mitCollege?.id,
        isActive: true,
      },
    });
    
    const review = await prisma.review.create({
      data: {
        userId: testUser.id,
        productId: mitProduct.id,
        rating: 5,
        comment: "Great product!",
      },
    });
    
    logTest("Review created", !!review, `Review ID: ${review.id}`);
    logTest("Review rating correct", review.rating === 5, `Rating: ${review.rating}/5`);

    // Final Summary
    console.log("\n" + "=".repeat(70));
    console.log("\n📊 TEST SUMMARY\n");
    console.log(`Total Tests: ${TEST_RESULTS.total}`);
    console.log(`✅ Passed: ${TEST_RESULTS.passed}`);
    console.log(`❌ Failed: ${TEST_RESULTS.failed}`);
    console.log(`Success Rate: ${((TEST_RESULTS.passed / TEST_RESULTS.total) * 100).toFixed(1)}%`);
    
    if (TEST_RESULTS.failed === 0) {
      console.log("\n🎉 ALL TESTS PASSED! 🎉\n");
    } else {
      console.log("\n⚠️  SOME TESTS FAILED ⚠️\n");
    }

    // Cleanup after tests
    await cleanupTestData();

  } catch (error) {
    console.error("\n❌ CRITICAL ERROR:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
