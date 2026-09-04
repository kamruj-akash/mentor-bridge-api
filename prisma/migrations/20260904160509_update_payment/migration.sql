/*
  Warnings:

  - You are about to drop the column `gateway` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `payments` table. All the data in the column will be lost.
  - The `paymentGateway` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[assignmentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assignmentId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_taskId_fkey";

-- DropIndex
DROP INDEX "payments_taskId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "gateway",
DROP COLUMN "taskId",
ADD COLUMN     "assignmentId" TEXT NOT NULL,
ALTER COLUMN "transactionId" DROP NOT NULL,
DROP COLUMN "paymentGateway",
ADD COLUMN     "paymentGateway" "PaymentGateway" NOT NULL DEFAULT 'BKASH',
ALTER COLUMN "merchantInvoiceNumber" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_assignmentId_key" ON "payments"("assignmentId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
