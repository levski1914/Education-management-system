import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParentsService } from './parents.service';

@Controller('parents')
@Controller('parents')
@UseGuards(JwtAuthGuard)
export class ParentsController {
  constructor(private service: ParentsService) {}

  @Get('me/children')
  getChildren(@Req() req) {
    return this.service.getChildren(req.user.id);
  }

  @Get('me/children/:id/grades')
  getGrades(@Req() req, @Param('id') childId: string) {
    return this.service.getGrades(childId, req.user.id);
  }

  @Get('me/children/:id/attendance')
  getAttendance(@Req() req, @Param('id') childId: string) {
    return this.service.getAttendance(childId, req.user.id);
  }
}
