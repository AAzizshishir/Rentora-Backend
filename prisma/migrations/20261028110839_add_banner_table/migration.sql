/*
  Warnings:

  - You are about to drop the column `business_address` on the `landlord_applications` table. All the data in the column will be lost.
  - You are about to drop the column `business_name` on the `landlord_applications` table. All the data in the column will be lost.
  - You are about to drop the column `experience_years` on the `landlord_applications` table. All the data in the column will be lost.
  - Added the required column `property_address` to the `landlord_applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `property_city` to the `landlord_applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `property_name` to the `landlord_applications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BannerPlacement" AS ENUM ('HOME_HERO', 'SEARCH_PAGE', 'TENANT_DASHBOARD', 'LANDLORD_DASHBOARD');

-- AlterTable
ALTER TABLE "landlord_applications" DROP COLUMN "business_address",
DROP COLUMN "business_name",
DROP COLUMN "experience_years",
ADD COLUMN     "property_address" TEXT NOT NULL,
ADD COLUMN     "property_city" TEXT NOT NULL,
ADD COLUMN     "property_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT,
    "altText" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "placement" "BannerPlacement" NOT NULL DEFAULT 'HOME_HERO',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banners_placement_isActive_sortOrder_idx" ON "banners"("placement", "isActive", "sortOrder");
