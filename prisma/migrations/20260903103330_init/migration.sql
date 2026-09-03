/*
  Warnings:

  - Added the required column `verificationStatus` to the `mentors` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MentorVerificationStatus" AS ENUM ('PENDING', 'APPROVE', 'REJECT');

-- AlterTable
ALTER TABLE "mentors" ADD COLUMN     "verificationStatus" "MentorVerificationStatus" NOT NULL;
