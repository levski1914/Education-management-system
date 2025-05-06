import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prismaService: PrismaService) {}

  async getLessons(teacherId: string) {
    return this.prismaService.lesson.findMany({
      where: { teacherId },
      include: { subject: true, classroom: true },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async getClassrooms(teacherId: string) {
    const lessons = await this.prismaService.lesson.findMany({
      where: { teacherId },
      select: {
        classroom: {
          include: {
            school: true,
            students: true,
          },
        },
      },
      distinct: ['classroomId'],
    });

    return lessons.map((l) => l.classroom);
  }
  async getTeacherClasses(teacherId: string) {
    return this.prismaService.classroom.findMany({
      where: {
        classTeacherId: teacherId,
      },
      include: {
        school: true,
        students: true,
      },
    });
  }

  async getStudents(teacherId: string) {
    const lessons = await this.prismaService.lesson.findMany({
      where: { teacherId },
      select: {
        classroom: {
          include: {
            students: true,
          },
        },
      },
    });

    const allStudents = lessons.flatMap((l) => l.classroom.students);
    const unique = new Map();
    for (const student of allStudents) {
      unique.set(student.id, student);
    }

    return Array.from(unique.values());
  }

  async getSchedule(teacherId: string) {
    return this.prismaService.lesson.findMany({
      where: { teacherId },
      include: {
        subject: true,
        classroom: true,
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }
}
