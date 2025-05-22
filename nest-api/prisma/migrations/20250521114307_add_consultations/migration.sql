-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ConsultationSlot" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "bookedById" TEXT,
    "status" "SlotStatus" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultationSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConsultationSlot" ADD CONSTRAINT "ConsultationSlot_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationSlot" ADD CONSTRAINT "ConsultationSlot_bookedById_fkey" FOREIGN KEY ("bookedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
