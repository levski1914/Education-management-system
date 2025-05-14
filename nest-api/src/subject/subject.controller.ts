import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectController {
  constructor(private readonly subjectsService: SubjectService) {}
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.subjectsService.findById(id);
  }
  
  @Get()
  getAll(@Req() req) {
    return this.subjectsService.findAll(req.user.schoolId);
  }

  @Post()
  create(@Body() dto: CreateSubjectDto, @Req() req) {
    return this.subjectsService.create(dto.name, req.user.schoolId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.subjectsService.delete(id);
  }
}
