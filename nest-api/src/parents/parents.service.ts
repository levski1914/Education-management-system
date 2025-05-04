import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  async getChildren(parentId: string) {
    return this.prisma.user.findMany({
      where: { parentId, role: 'STUDENT' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        class: {
          select: {
            grade: true,
            letter: true,
          },
        },
      },
    });
  }

  async getGrades(childId: string, parentId: string) {
    const child = await this.prisma.user.findFirst({
      where: { id: childId, parentId },
    });

    if (!child) throw new ForbiddenException();

    return this.prisma.grade.findMany({
      where: { studentId: childId },
      include: { subject: true, lesson: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAttendance(childId: string, parentId: string) {
    const child = await this.prisma.user.findFirst({
      where: { id: childId, parentId },
    });
    if (!child) throw new ForbiddenException();

    return this.prisma.attendance.findMany({
      where: { studentId: childId },
      include: {
        lesson: {
          include: { subject: true, teacher: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
