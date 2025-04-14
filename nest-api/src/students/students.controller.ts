import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private service: StudentsService) {}
  @Put(':id/clear-warning')
  @UseGuards(JwtAuthGuard)
  clearStudentWarning(@Param('id') studentId: string) {
    return this.service.clearStudentWarning(studentId);
  }

  @Put('excuse')
  @UseGuards(JwtAuthGuard)
  excuse(@Body() body: { ids: string[] }) {
    return this.service.excuseAttendance(body.ids);
  }

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
  @Get(':id/alerts')
  @UseGuards(JwtAuthGuard)
  getAlerts(@Param('id') id: string) {
    return this.service.getStudentAlerts(id);
  }
  @Get(':id/warnings')
  getWarnings(@Param('id') id: string) {
    return this.service.getBehaviorStatus(id);
  }
  @Get('warning-count')
  @UseGuards(JwtAuthGuard)
  async getWarningCount(@Req() req) {
    const schoolId = req.user.schoolId;
    return this.service.countStudentsWithWarnings(schoolId);
  }

  @Get(':id')
  getStudentInfo(@Param('id') studentId: string) {
    return this.service.getStudentById(studentId);
  }
}
