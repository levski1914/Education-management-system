/*
  Warnings:

  - A unique constraint covering the columns `[egn]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "egn" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "profilePic" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_egn_key" ON "User"("egn");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
