-- DropIndex
DROP INDEX "mentors_university_isVerified_idx";

-- AlterTable
ALTER TABLE "mentors" ADD COLUMN     "rejectionReason" TEXT;

-- CreateIndex
CREATE INDEX "mentors_university_isVerified_verificationStatus_idx" ON "mentors"("university", "isVerified", "verificationStatus");
