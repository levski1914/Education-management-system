import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}
  async getAllSchools() {
    return this.prisma.school.findMany();
  }

  async createSchool(data: { name: string; city: string }) {
    return this.prisma.school.create({
      data,
    });
  }

  async updateSchool(id: string, data: { name?: string; city?: string }) {
    return this.prisma.school.update({
      where: { id },
      data,
    });
  }

  async deleteSchool(id: string) {
    return this.prisma.school.delete({
      where: { id },
    });
  }
}
