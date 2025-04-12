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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
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
