import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { RegisterDirectorDto } from './dto/register-director.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(role?: string) {
    return this.prisma.user.findMany({
      where: role ? { role: { equals: role as Role } } : {},
      include: {
        class: true, // 🟢 добави това
      },
    });
  }
  async getById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(dto: CreateUserDto, schoolId: string) {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { ...dto, password: hashed, schoolId },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async registerDirector(dto: RegisterDirectorDto) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const school = await this.prisma.school.create({
      data: {
        name: dto.schoolName,
        city: dto.schoolCity,
      },
    });

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        role: 'ADMIN',
        schoolId: school.id,
      },
    });
  }

  async getAllByRoleAndSchool(role: Role, schoolId: string) {
    return this.prisma.user.findMany({
      where: { role, schoolId },
    });
  }
}
