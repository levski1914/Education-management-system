import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly service: AttendanceService,
    private prisma: PrismaService,
  ) {}
  @Put(':id/excuse')
  @UseGuards(JwtAuthGuard)
  excuseAttendance(@Param('id') id: string) {
    return this.prisma.attendance.update({
      where: { id },
      data: { excused: true },
    });
  }

  @Post(':studentId')
  mark(
    @Param('studentId') studentId: string,
    @Body() dto: { lessonId: string; status: AttendanceStatus },
  ) {
    return this.service.mark(studentId, dto);
  }

  @Get(':studentId')
  getStudentAttendance(@Param('studentId') studentId: string) {
    return this.service.getForStudent(studentId);
  }
}
