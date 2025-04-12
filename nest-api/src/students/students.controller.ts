import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private service: StudentsService) {}

  @Get(':id/grades')
  @UseGuards(JwtAuthGuard)
  getGrades(@Param('id') id: string) {
    return this.service.getGrades(id);
  }

  @Get(':id/attendance')
  @UseGuards(JwtAuthGuard)
  getAttendance(@Param('id') id: string) {
    return this.service.getAttendance(id);
  }
  @Get(':id/grade-summary')
  getGradeSummary(@Param('id') studentId: string) {
    return this.service.getGradeSummary(studentId);
  }

  @Get(':id')
  getStudentInfo(@Param('id') studentId: string) {
    return this.service.getStudentById(studentId);
  }
}
