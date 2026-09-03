-- The `verificationStatus` column was added without a default even though the
-- schema declares `@default(PENDING)`, which left the database drifted.

-- AlterTable
ALTER TABLE "experts" ALTER COLUMN "verificationStatus" SET DEFAULT 'PENDING';
