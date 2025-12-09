/*
  Warnings:

  - You are about to drop the `College` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `collegeId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `collegeId` on the `OwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `collegeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `collegeId` on the `RentalOrder` table. All the data in the column will be lost.
  - You are about to drop the column `collegeId` on the `User` table. All the data in the column will be lost.

*/

-- Drop foreign key constraints first
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_collegeId_fkey";
ALTER TABLE "OwnerProfile" DROP CONSTRAINT IF EXISTS "OwnerProfile_collegeId_fkey";
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_collegeId_fkey";
ALTER TABLE "Cart" DROP CONSTRAINT IF EXISTS "Cart_collegeId_fkey";
ALTER TABLE "RentalOrder" DROP CONSTRAINT IF EXISTS "RentalOrder_collegeId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "College_domain_key";

-- DropTable
DROP TABLE IF EXISTS "College";

-- AlterTable: Remove collegeId columns and add collegeName to User
ALTER TABLE "Cart" DROP COLUMN IF EXISTS "collegeId";
ALTER TABLE "OwnerProfile" DROP COLUMN IF EXISTS "collegeId";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "collegeId";
ALTER TABLE "RentalOrder" DROP COLUMN IF EXISTS "collegeId";
ALTER TABLE "User" DROP COLUMN IF EXISTS "collegeId";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "collegeName" TEXT;
