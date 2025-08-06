import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './reports.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('grades/by-class')
  async getGradesByClass(
    @Query('classId') classId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.reportService.getGradesByClass(classId, fromDate, toDate);
  }
}
