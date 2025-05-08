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
            students: true,
            school: true,
          },
        },
      },
      distinct: ['classroomId'],
    });

    return lessons.map((l) => l.classroom);
  }

  async getSubjects(teacherId: string) {
    return this.prismaService.subject.findMany({
      where: {
        lessons: {
          some: {
            teacherId,
          },
        },
      },
    });
  }
  async addAttendance(teacherId: string, dto: any) {
    // Може да добавиш проверка дали teacher има право да отбелязва за този клас
    return this.prismaService.attendance.create({
      data: {
        status: dto.status,
        studentId: dto.studentId,
        lessonId: dto.lessonId,
        createdAt: new Date(dto.date),
        excused: dto.excused || false,
      },
    });
  }
  async addGrade(teacherId: string, dto: any) {
    const lesson = await this.prismaService.lesson.findFirst({
      where: {
        teacherId,
        subjectId: dto.subjectId,
      },
    });

    return this.prismaService.grade.create({
      data: {
        value: dto.value,
        studentId: dto.studentId,
        subjectId: dto.subjectId,
        lessonId: lesson?.id,
      },
    });
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

 // TeacherService.ts
async getStudentsInClass(classId: string) {

  return this.prismaService.user.findMany({
    where: { classId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profilePic: true,
      egn: true,
      parent: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      Grade: true,
      Attendance: true,
    },
  });
  
}

}
