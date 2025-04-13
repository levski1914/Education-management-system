import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentFilesService {
  constructor(private prisma: PrismaService) {}
  async saveFile(name: string, url: string, studentId: string) {
    return this.prisma.studentFile.create({
      data: { name, url, studentId },
    });
  }

  async getFilesForStudent(studentId: string) {
    return this.prisma.studentFile.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFile(id: string) {
    return this.prisma.studentFile.delete({ where: { id } });
  }
}
