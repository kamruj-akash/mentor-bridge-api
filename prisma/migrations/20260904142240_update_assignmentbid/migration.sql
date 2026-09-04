/*
  Warnings:

  - You are about to drop the `AssignmentBids` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssignmentBids" DROP CONSTRAINT "AssignmentBids_expertId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentBids" DROP CONSTRAINT "AssignmentBids_taskId_fkey";

-- DropTable
DROP TABLE "AssignmentBids";

-- CreateTable
CREATE TABLE "assignmentBids" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "proposedAmount" DOUBLE PRECISION NOT NULL,
    "estimatedDelivery" TIMESTAMP(3) NOT NULL,
    "coverNote" TEXT NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignmentBids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assignmentBids_assignmentId_expertId_key" ON "assignmentBids"("assignmentId", "expertId");

-- AddForeignKey
ALTER TABLE "assignmentBids" ADD CONSTRAINT "assignmentBids_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignmentBids" ADD CONSTRAINT "assignmentBids_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
