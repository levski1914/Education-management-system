import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { RegisterDirectorDto } from './dto/register-director.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
        children: true,
      },
    });
  }

  async updateOwnProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        profilePic: dto.profilePic,
        extraEmail: dto.extraEmail, // 👈
      },
    });
  }
  async getParentLog(studentId: string) {
    return this.prisma.parentLog.findMany({
      where: { studentId },
      include: {
        parent: true,
      },
      orderBy: {
        createdAt: 'desc',
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
  async assignParent(studentId: string, parentId: string) {
    await this.prisma.user.update({
      where: { id: studentId },
      data: { parentId },
    });

    await this.prisma.parentLog.create({
      data: {
        studentId,
        parentId,
        action: 'ASSIGN',
      },
    });

    return { message: 'Родителят е свързан с ученика.' };
  }

  async unassignParent(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: { parentId: true },
    });

    if (!student?.parentId) return { message: 'Няма родител за премахване.' };

    await this.prisma.user.update({
      where: { id: studentId },
      data: { parentId: null },
    });

    await this.prisma.parentLog.create({
      data: {
        studentId,
        parentId: student.parentId,
        action: 'UNASSIGN',
      },
    });

    return { message: 'Родителят е премахнат от ученика.' };
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

  async getSchedule(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      include: {
        class: {
          include: {
            lessons: {
              include: {
                subject: true,
                teacher: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
        },
      },
    });

    if (!student?.class) return [];

    return student.class.lessons;
  }

  async getSummary(studentId: string) {
    const [grades, attendances, warnings] = await Promise.all([
      this.prisma.grade.findMany({ where: { studentId } }),
      this.prisma.attendance.findMany({ where: { studentId } }),
      this.prisma.message.findMany({
        where: {
          receiverId: studentId,
          title: { contains: 'Забележка' },
        },
      }),
    ]);

    const avgGrade =
      grades.length > 0
        ? grades.reduce((sum, g) => sum + g.value, 0) / grades.length
        : null;

    return {
      avgGrade,
      totalAbsences: attendances.filter((a) => a.status === 'ABSENT').length,
      totalWarnings: warnings.length,
    };
  }
}
