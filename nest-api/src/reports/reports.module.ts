import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportService } from './reports.service';
import { ReportController } from './reports.controller';

@Module({
  providers: [ReportService, PrismaService],
  controllers: [ReportController],
})
export class ReportsModule {}
