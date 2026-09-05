/*
  Warnings:

  - You are about to alter the column `proposedAmount` on the `assignmentBids` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `budget` on the `assignments` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to drop the column `taskId` on the `escrows` table. All the data in the column will be lost.
  - You are about to alter the column `totalAmount` on the `escrows` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `platformCommission` on the `escrows` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `expertEarnings` on the `escrows` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `ratePerAssignment` on the `experts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `walletBalance` on the `experts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - A unique constraint covering the columns `[acceptedBidId]` on the table `assignments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assignmentId]` on the table `escrows` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assignmentId` to the `escrows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AssignmentStatus" ADD VALUE 'AWAITING_PAYMENT';

-- DropForeignKey
ALTER TABLE "escrows" DROP CONSTRAINT "escrows_taskId_fkey";

-- DropIndex
DROP INDEX "escrows_taskId_key";

-- AlterTable
ALTER TABLE "assignmentBids" ALTER COLUMN "proposedAmount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "acceptedBidId" TEXT,
ALTER COLUMN "budget" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "escrows" DROP COLUMN "taskId",
ADD COLUMN     "assignmentId" TEXT NOT NULL,
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "platformCommission" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "expertEarnings" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "experts" ALTER COLUMN "ratePerAssignment" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "walletBalance" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- CreateIndex
CREATE UNIQUE INDEX "assignments_acceptedBidId_key" ON "assignments"("acceptedBidId");

-- CreateIndex
CREATE UNIQUE INDEX "escrows_assignmentId_key" ON "escrows"("assignmentId");

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_acceptedBidId_fkey" FOREIGN KEY ("acceptedBidId") REFERENCES "assignmentBids"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrows" ADD CONSTRAINT "escrows_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
