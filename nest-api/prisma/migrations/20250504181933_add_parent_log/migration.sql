-- CreateTable
CREATE TABLE "ParentLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "ParentLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParentLog" ADD CONSTRAINT "ParentLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentLog" ADD CONSTRAINT "ParentLog_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
