import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async create(
    studentId: string,
    dto: { subjectId: string; lessonId?: string; value: number },
  ) {
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
