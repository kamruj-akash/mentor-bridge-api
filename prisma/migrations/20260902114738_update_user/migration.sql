/*
  Warnings:

  - You are about to drop the column `imagePublicId` on the `users` table. All the data in the column will be lost.
  - The `imageUrl` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "imagePublicId",
ADD COLUMN     "phoneNo" TEXT,
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" JSONB;
