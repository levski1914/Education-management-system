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

  async getStudentAlerts(studentId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [absences, lateness, badGrades] = await Promise.all([
      this.prisma.attendance.count({
        where: {
          studentId,
          status: 'ABSENT',
          createdAt: { gte: oneWeekAgo },
        },
      }),
      this.prisma.attendance.count({
        where: {
          studentId,
          status: 'LATE',
          createdAt: { gte: oneWeekAgo },
        },
      }),
      this.prisma.grade.count({
        where: {
          studentId,
          value: { lt: 3 },
        },
      }),
    ]);

    const alerts: string[] = [];

    if (absences >= 3) alerts.push('⚠️ Чести отсъствия');
    if (lateness >= 2) alerts.push('🔔 Чести закъснения');
    if (badGrades > 0) alerts.push('❗ Има слаби оценки');

    return alerts;
  }

  async getBehaviorStatus(studentId: string) {
    const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 дни

    const attendance = await this.prisma.attendance.findMany({
      where: {
        studentId,
        createdAt: { gte: threshold },
        excused: false, // ❗️ само неизвинени
      },
    });

    const late = attendance.filter((a) => a.status === 'LATE').length;
    const absent = attendance.filter((a) => a.status === 'ABSENT').length;

    const user = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    return {
      late,
      absent,
      hasWarnings: user
        ? !user.isWarningCleared && (late >= 3 || absent >= 3)
        : false,
      isCleared: user ? user.isWarningCleared : false,
    };
  }

  async countStudentsWithWarnings(schoolId: string) {
    const students = await this.prisma.user.findMany({
      where: {
        role: 'STUDENT',
        schoolId,
      },
      include: {
        Attendance: true,
      },
    });

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30);

    const flagged = students.filter((s) => {
      if (s.isWarningCleared) return false; // ⛔️ игнорирай изчистени

      const recent = s.Attendance.filter(
        (a) => new Date(a.createdAt) > thresholdDate && !a.excused, // ❗️
      );

      const latenessCount = recent.filter((a) => a.status === 'LATE').length;
      const absentCount = recent.filter((a) => a.status === 'ABSENT').length;
      return latenessCount >= 3 || absentCount >= 3;
    });

    return {
      students: flagged.length,
    };
  }

  async clearStudentWarning(studentId: string) {
    return this.prisma.user.update({
      where: { id: studentId },
      data: { isWarningCleared: true },
    });
  }
  async excuseAttendance(ids: string[]) {
    return this.prisma.attendance.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        excused: true,
      },
    });
  }
}
