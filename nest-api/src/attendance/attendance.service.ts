import { Injectable } from '@nestjs/common';
import { AttendanceStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async mark(
    studentId: string,
    dto: { lessonId: string; status: AttendanceStatus },
  ) {
    const existing = await this.prisma.attendance.findFirst({
      where: {
        studentId,
        lessonId: dto.lessonId,
      },
    });

    if (existing) {
      return this.prisma.attendance.update({
        where: { id: existing.id },
        data: { status: dto.status },
      });
    }

    return this.prisma.attendance.create({
      data: {
        studentId,
        lessonId: dto.lessonId,
        status: dto.status,
      },
    });
  }

  async getForStudent(studentId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      include: { lesson: true },
    });
  }
}
