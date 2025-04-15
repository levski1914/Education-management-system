import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lessons.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async getAllForClassroom(classroomId: string) {
    return this.prisma.lesson.findMany({
      where: { classroomId },
      include: {
        subject: true,
        teacher: true,
      },
      orderBy: {
        dayOfWeek: 'asc',
      },
    });
  }

  async create(dto: CreateLessonDto) {
    if (!dto.subjectId)
      throw new BadRequestException('❌ Subject ID is required');
    if (!dto.teacherId)
      throw new BadRequestException('❌ Teacher ID is required');
    if (!dto.classroomId)
      throw new BadRequestException('❌ Classroom ID is required');

    return this.prisma.lesson.create({
      data: {
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        classroomId: dto.classroomId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
  }

  async delete(id: string) {
    // 1. Изтриваме всички attendance записи за този урок
    await this.prisma.attendance.deleteMany({
      where: { lessonId: id },
    });

    // 2. След това изтриваме урока
    return this.prisma.lesson.delete({ where: { id } });
  }

  async getForClassroom(classroomId: string) {
    return this.prisma.lesson.findMany({
      where: { classroomId },
      include: {
        subject: true,
        teacher: true,
        classroom: {
          include: {
            students: true, // 🧑‍🎓 за лявото меню
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }
}
