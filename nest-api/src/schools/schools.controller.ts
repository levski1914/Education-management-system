import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolService: SchoolsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.schoolService.getAllSchools();
  }

  @Post()
  createSchool(@Body() body: { name: string; city: string }) {
    return this.schoolService.createSchool(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; city?: string },
  ) {
    return this.schoolService.updateSchool(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.schoolService.deleteSchool(id);
  }
}
