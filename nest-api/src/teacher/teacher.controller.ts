import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeacherService } from './teacher.service';
import { CurrentUser } from 'src/users/dto/current-user.decorator';
import { User } from '@prisma/client';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly service: TeacherService) {}

  @Get('my-lessons')
  @UseGuards(JwtAuthGuard)
  getLessons(@Req() req) {
    return this.service.getLessons(req.user.id);
  }
  @Get('my-classes')
  @UseGuards(JwtAuthGuard)
  getMyClasses(@CurrentUser() user: User) {
    return this.service.getTeacherClasses(user.id);
  }

  @Get('my-classrooms')
  @UseGuards(JwtAuthGuard)
  getMyClassrooms(@Req() req) {
    return this.service.getClassrooms(req.user.id);
  }

  @Get('my-students')
  @UseGuards(JwtAuthGuard)
  getMyStudents(@Req() req) {
    return this.service.getStudents(req.user.id);
  }

  @Get('my-schedule')
  @UseGuards(JwtAuthGuard)
  getMySchedule(@Req() req) {
    return this.service.getSchedule(req.user.id);
  }
}
