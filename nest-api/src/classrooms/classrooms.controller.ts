import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassDto } from './dto/create-class.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly service: ClassroomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateClassDto, @Req() req) {
    const schoolId = req.user.schoolId;

    // 🧪 ЛОГ за проверка
    console.log('📤 REQ.USER.schoolId:', schoolId);

    return this.service.create(dto, req.user.id, schoolId);
  }

  @Get()
  getAll(@Request() req) {
    const schoolId = req.user.schoolId;
    return this.service.getAllForSchool(schoolId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':classId/assign-student/:studentId')
  assignStudent(
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.service.assignStudent(classId, studentId);
  }

  @Put(':classId/teacher/:teacherId')
  assignTeacher(
    @Param('classId') classId: string,
    @Param('teacherId') teacherId: string,
  ) {
    return this.service.assignClassTeacher(classId, teacherId);
  }
}
