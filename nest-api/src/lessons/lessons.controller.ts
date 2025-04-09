import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLessonDto } from './dto/create-lessons.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-classroom/:id')
  getAllForClassroom(@Param('id') classId: string) {
    return this.lessonsService.getAllForClassroom(classId);
  }
  @Get('classroom/:id')
  getByClassroom(@Param('id') classroomId: string) {
    return this.lessonsService.getForClassroom(classroomId);
  }
}
