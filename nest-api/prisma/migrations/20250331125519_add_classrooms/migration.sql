/*
  Warnings:

  - You are about to drop the column `section` on the `Classroom` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Classroom` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classTeacherId]` on the table `Classroom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `letter` to the `Classroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Classroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolId` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_teacherId_fkey";

-- AlterTable
ALTER TABLE "Classroom" DROP COLUMN "section",
DROP COLUMN "teacherId",
ADD COLUMN     "classTeacherId" TEXT,
ADD COLUMN     "letter" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "schoolId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_classTeacherId_key" ON "Classroom"("classTeacherId");

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
