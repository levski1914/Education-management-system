import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string) {
    return this.prisma.subject.findMany({ where: { schoolId } });
  }

  async create(name: string, schoolId: string) {
    return this.prisma.subject.create({
      data: { name, schoolId },
    });
  }
  async findById(id: string) {
    return this.prisma.subject.findUnique({ where: { id } });
  }
  
  async delete(id: string) {
    return this.prisma.subject.delete({ where: { id } });
  }
}
