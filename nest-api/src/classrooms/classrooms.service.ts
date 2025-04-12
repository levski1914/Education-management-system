import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClassDto, userId: string, schoolId: string) {
    const name = `${dto.grade}${dto.letter}`;

    if (!schoolId) {
      throw new BadRequestException('❌ School ID is missing!');
    }

    try {
      return await this.prisma.classroom.create({
        data: {
          name,
          grade: dto.grade,
          letter: dto.letter,
          schoolId,
        },
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException('❌ Този клас вече съществува.');
      }
      throw err;
    }
  }
  async getAllForSchool(schoolId: string) {
    return this.prisma.classroom.findMany({
      where: { schoolId },
      include: { students: true, classTeacher: true },
    });
  }

  async assignStudent(classId: string, studentId: string) {
    return this.prisma.user.update({
      where: { id: studentId },
      data: { classId },
    });
  }

  async assignClassTeacher(classId: string, teacherId: string) {
    return this.prisma.classroom.update({
      where: { id: classId },
      data: { classTeacherId: teacherId },
    });
  }

  async getOneById(id: string) {
    return this.prisma.classroom.findUnique({
      where: { id },
      include: { students: true, classTeacher: true },
    });
  }
}
