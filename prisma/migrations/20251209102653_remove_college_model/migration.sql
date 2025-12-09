/*
  Warnings:

  - You are about to drop the `College` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `collegeId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `collegeId` on the `OwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `collegeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `collegeId` on the `RentalOrder` table. All the data in the column will be lost.
  - You are about to drop the column `collegeId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "College_domain_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "College";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cart" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "Cart";
DROP TABLE "Cart";
ALTER TABLE "new_Cart" RENAME TO "Cart";
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");
CREATE TABLE "new_OwnerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "phone" TEXT,
    "collegeName" TEXT,
    "documentUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OwnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OwnerProfile" ("collegeName", "createdAt", "documentUrl", "id", "phone", "status", "updatedAt", "userId") SELECT "collegeName", "createdAt", "documentUrl", "id", "phone", "status", "updatedAt", "userId" FROM "OwnerProfile";
DROP TABLE "OwnerProfile";
ALTER TABLE "new_OwnerProfile" RENAME TO "OwnerProfile";
CREATE UNIQUE INDEX "OwnerProfile_userId_key" ON "OwnerProfile"("userId");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "basePricePerMonth" INTEGER NOT NULL,
    "originalPricePerMonth" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rating" REAL DEFAULT 0,
    "ratingCount" INTEGER DEFAULT 0,
    "contactNumber" TEXT,
    "ownerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("basePricePerMonth", "categoryId", "contactNumber", "createdAt", "description", "id", "images", "isActive", "originalPricePerMonth", "ownerId", "rating", "ratingCount", "thumbnailUrl", "title", "updatedAt") SELECT "basePricePerMonth", "categoryId", "contactNumber", "createdAt", "description", "id", "images", "isActive", "originalPricePerMonth", "ownerId", "rating", "ratingCount", "thumbnailUrl", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_RentalOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "totalAmount" INTEGER NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "shippingAddressId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RentalOrder_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RentalOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RentalOrder" ("createdAt", "endDate", "id", "shippingAddressId", "startDate", "status", "totalAmount", "updatedAt", "userId") SELECT "createdAt", "endDate", "id", "shippingAddressId", "startDate", "status", "totalAmount", "updatedAt", "userId" FROM "RentalOrder";
DROP TABLE "RentalOrder";
ALTER TABLE "new_RentalOrder" RENAME TO "RentalOrder";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "passwordHash" TEXT,
    "phone" TEXT,
    "aadhaarNumber" TEXT,
    "personPhoto" TEXT,
    "collegeName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("aadhaarNumber", "createdAt", "email", "emailVerified", "id", "image", "name", "passwordHash", "personPhoto", "phone", "role", "updatedAt") SELECT "aadhaarNumber", "createdAt", "email", "emailVerified", "id", "image", "name", "passwordHash", "personPhoto", "phone", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
