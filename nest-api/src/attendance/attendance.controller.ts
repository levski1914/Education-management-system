import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceStatus } from '@prisma/client';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

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
