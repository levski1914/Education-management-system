import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async getAttendanceForStudent(studentId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      include: {
        lesson: {
          include: {
            subject: true,
            teacher: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGradesForStudent(studentId: string) {
    return this.prisma.grade.findMany({
      where: { studentId },
      include: {
        subject: true,
        lesson: {
          include: { teacher: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStudentById(studentId: string) {
    return this.prisma.user.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        school: true,
      },
    });
  }
  async getGradeSummary(studentId: string) {
    const grades = await this.prisma.grade.findMany({
      where: { studentId },
      include: { subject: true },
    });

    const subjectMap = new Map<
      string,
      { name: string; total: number; count: number }
    >();

    for (const g of grades) {
      const subjectId = g.subjectId;
      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, {
          name: g.subject.name,
          total: g.value,
          count: 1,
        });
      } else {
        const existing = subjectMap.get(subjectId)!;
        existing.total += g.value;
        existing.count += 1;
      }
    }

    return Array.from(subjectMap.values()).map((s) => ({
      subject: s.name,
      average: (s.total / s.count).toFixed(2),
    }));
  }

  async getGrades(studentId: string) {
    return this.prisma.grade.findMany({
      where: { studentId },
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAttendance(studentId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      include: {
        lesson: {
          include: {
            subject: true,
            teacher: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
