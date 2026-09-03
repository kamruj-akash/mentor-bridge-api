-- Rebrand: MentorBridge -> Assignment Bridge. Mentors become Experts.
-- Everything here is a rename, so existing rows are preserved.

-- AlterEnum
ALTER TYPE "Role" RENAME VALUE 'MENTOR' TO 'EXPERT';

-- AlterEnum
ALTER TYPE "EscrowStatus" RENAME VALUE 'RELEASED_TO_MENTOR' TO 'RELEASED_TO_EXPERT';

-- RenameEnum
ALTER TYPE "MentorVerificationStatus" RENAME TO "ExpertVerificationStatus";

-- RenameEnum
ALTER TYPE "BookingStatus" RENAME TO "AssignmentStatus";

-- RenameTable
ALTER TABLE "mentors" RENAME TO "experts";

-- RenameColumn
ALTER TABLE "experts" RENAME COLUMN "hourlyRate" TO "ratePerAssignment";

-- RenameColumn
ALTER TABLE "students" RENAME COLUMN "targetExam" TO "academicLevel";

-- RenameConstraint
ALTER TABLE "experts" RENAME CONSTRAINT "mentors_pkey" TO "experts_pkey";

-- RenameConstraint
ALTER TABLE "experts" RENAME CONSTRAINT "mentors_userId_fkey" TO "experts_userId_fkey";

-- RenameIndex
ALTER INDEX "mentors_userId_key" RENAME TO "experts_userId_key";

-- RenameIndex
ALTER INDEX "mentors_university_isVerified_verificationStatus_idx" RENAME TO "experts_university_isVerified_verificationStatus_idx";
