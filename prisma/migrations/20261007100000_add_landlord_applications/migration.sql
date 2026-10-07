-- CreateEnum
CREATE TYPE "LandlordApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "landlord_applications" (
    "id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "reviewed_by_id" TEXT,
    "business_name" TEXT NOT NULL,
    "business_address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "message" TEXT,
    "status" "LandlordApplicationStatus" NOT NULL DEFAULT 'pending',
    "rejection_reason" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landlord_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "landlord_applications_applicant_id_created_at_idx"
ON "landlord_applications"("applicant_id", "created_at");

-- CreateIndex
CREATE INDEX "landlord_applications_status_created_at_idx"
ON "landlord_applications"("status", "created_at");

-- AddForeignKey
ALTER TABLE "landlord_applications"
ADD CONSTRAINT "landlord_applications_applicant_id_fkey"
FOREIGN KEY ("applicant_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landlord_applications"
ADD CONSTRAINT "landlord_applications_reviewed_by_id_fkey"
FOREIGN KEY ("reviewed_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
