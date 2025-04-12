import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(
    studentId: string,
    dto: { subjectId: string; lessonId?: string; value: number },
  ) {
    const existing = await this.prisma.grade.findFirst({
      where: {
        studentId,
        subjectId: dto.subjectId,
        lessonId: dto.lessonId,
      },
    });

    if (existing) {
      return this.prisma.grade.update({
        where: { id: existing.id },
        data: { value: dto.value },
      });
    }

    return this.prisma.grade.create({
      data: {
        value: dto.value,
        subjectId: dto.subjectId,
        studentId,
        lessonId: dto.lessonId,
      },
    });
  }

  async getForStudent(studentId: string) {
    return this.prisma.grade.findMany({
      where: { studentId },
      include: { subject: true, lesson: true },
    });
  }
  async getGradesByLesson(lessonId: string) {
    return this.prisma.grade.findMany({
      where: { lessonId },
      select: {
        id: true,
        value: true,
        studentId: true,
        subjectId: true,
      },
    });
  }
}
