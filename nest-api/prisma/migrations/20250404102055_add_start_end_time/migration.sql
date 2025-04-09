/*
  Warnings:

  - You are about to drop the column `time` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "time",
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "startTime" TEXT;
