import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDirectorDto } from './dto/register-director.dto';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import { CurrentUser } from './dto/current-user.decorator';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':studentId/schedule')
  getStudentSchedule(@Param('studentId') studentId: string) {
    return this.usersService.getSchedule(studentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':studentId/summary')
  getStudentSummary(@Param('studentId') studentId: string) {
    return this.usersService.getSummary(studentId);
  }

  @Put(':parentId/assign-child/:studentId')
  @UseGuards(JwtAuthGuard)
  assignChildToParent(
    @Param('parentId') parentId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.usersService.assignParent(studentId, parentId);
  }

  @Put(':studentId/unassign-parent')
  @UseGuards(JwtAuthGuard)
  unassignParent(@Param('studentId') studentId: string) {
    return this.usersService.unassignParent(studentId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        children: {
          include: { class: true },
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':studentId/details')
  async getStudentDetails(@Param('studentId') studentId: string) {
    const grades = await this.prisma.grade.findMany({
      where: { studentId },
      include: { subject: true },
    });
    const attendances = await this.prisma.attendance.findMany({
      where: { studentId },
    });
    const warnings = await this.prisma.message.findMany({
      where: { receiverId: studentId, toRole: null },
    });

    return { grades, attendances, warnings };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':studentId/parent-log')
  getParentLog(@Param('studentId') studentId: string) {
    return this.usersService.getParentLog(studentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Query('role') role: string, @Req() req: any) {
    const schoolId = req.user.schoolId;
    return this.usersService.getAll(role, schoolId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateUserDto, @Req() req) {
    const schoolId = req.user.schoolId;
    return this.usersService.create(dto, schoolId);
  }

  @Get('dashboard-data') // 🟢 Сложи първо това!
  @UseGuards(JwtAuthGuard)
  async getAdminDashboard(@Req() req) {
    const userId = req.user.id;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { school: true },
    });

    if (!user) {
      console.error('❌ User not found in DB for ID:', userId);
      throw new Error('User not found');
    }
    const schoolId = user.schoolId;

    const [teachers, students, parents] = await Promise.all([
      this.prisma.user.count({ where: { schoolId, role: 'TEACHER' } }),
      this.prisma.user.count({ where: { schoolId, role: 'STUDENT' } }),
      this.prisma.user.count({ where: { schoolId, role: 'PARENT' } }),
    ]);

    return {
      school: user.school,
      stats: { teachers, students, parents },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-role/:role')
  getByRoleAndShool(@Param('role') role: Role, @Request() req) {
    return this.usersService.getAllByRoleAndSchool(role, req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Post('register-director')
  registerDirector(@Body() dto: RegisterDirectorDto) {
    return this.usersService.registerDirector(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateOwnProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateOwnProfile(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    if (!user.schoolId) {
      throw new Error('School ID is required');
    }
    return this.usersService.update(id, updateUserDto, user.schoolId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.schoolId) {
      throw new Error('School ID is required');
    }
    return this.usersService.remove(id, user.schoolId);
  }
}
