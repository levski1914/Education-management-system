import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private readonly service: GradesService) {}

  @Post(':studentId')
  createOrUpdate(
    @Param('studentId') studentId: string,
    @Body() dto: { subjectId: string; lessonId?: string; value: number },
  ) {
    return this.service.createOrUpdate(studentId, dto);
  }

  @Get(':studentId')
  getStudentGrades(@Param('studentId') studentId: string) {
    return this.service.getForStudent(studentId);
  }

  @Get('lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  getGradesByLesson(@Param('lessonId') lessonId: string) {
    return this.service.getGradesByLesson(lessonId);
  }
}
