import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getGradesByClass(classId: string, from: Date, to: Date) {
    const grades = await this.prisma.grade.findMany({
      where: {
        student: {
          classId: classId,
        },
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        subject: true,
        student: true,
      },
    });

    if (grades.length === 0) {
      return {
        average: 0,
        topStudents: [],
        subjects: [],
        count: 0,
      };
    }

    // Средна оценка
    const avg = grades.reduce((sum, g) => sum + g.value, 0) / grades.length;

    // По предмети
    const subjectMap = new Map<
      string,
      { name: string; total: number; count: number }
    >();
    for (const grade of grades) {
      const key = grade.subjectId;
      const name = grade.subject.name;
      if (!subjectMap.has(key)) {
        subjectMap.set(key, { name, total: 0, count: 0 });
      }
      const entry = subjectMap.get(key)!;
      entry.total += grade.value;
      entry.count++;
    }

    const subjects = Array.from(subjectMap.values()).map((s) => ({
      name: s.name,
      avg: (s.total / s.count).toFixed(2),
    }));

    // Топ ученици
    const studentMap = new Map<
      string,
      { name: string; total: number; count: number }
    >();
    for (const grade of grades) {
      const key = grade.studentId;
      const name = `${grade.student.firstName} ${grade.student.lastName}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, { name, total: 0, count: 0 });
      }
      const entry = studentMap.get(key)!;
      entry.total += grade.value;
      entry.count++;
    }

    const topStudents = Array.from(studentMap.values())
      .map((s) => ({ name: s.name, avg: (s.total / s.count).toFixed(2) }))
      .sort((a, b) => +b.avg - +a.avg)
      .slice(0, 5);

    return {
      average: avg.toFixed(2),
      topStudents,
      subjects,
      count: grades.length,
    };
  }
}
