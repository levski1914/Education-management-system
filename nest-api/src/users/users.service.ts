import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { RegisterDirectorDto } from './dto/register-director.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(role?: string, schoolId?: string) {
    return this.prisma.user.findMany({
      where: {
        ...(role ? { role: role as Role } : {}),
        ...(schoolId ? { schoolId } : {}),
      },
      include: {
        class: true,
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

  async update(userId: string, dto: UpdateUserDto, schoolId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.schoolId !== schoolId) {
      throw new ForbiddenException('Нямате достъп до този потребител');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }
  async remove(userId: string, schoolId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.schoolId !== schoolId) {
      throw new ForbiddenException('Нямате достъп до този потребител');
    }

    // 🛑 Изтрий свързани уроци първо
    await this.prisma.lesson.deleteMany({
      where: { teacherId: userId },
    });

    return this.prisma.user.delete({ where: { id: userId } });
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
