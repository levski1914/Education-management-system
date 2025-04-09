/*
  Warnings:

  - A unique constraint covering the columns `[grade,letter,schoolId]` on the table `Classroom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Classroom_grade_letter_schoolId_key" ON "Classroom"("grade", "letter", "schoolId");
