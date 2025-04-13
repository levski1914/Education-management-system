import { Module } from '@nestjs/common';
import { StudentFilesService } from './student-files.service';
import { StudentFilesController } from './student-files.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [StudentFilesService, PrismaService],
  controllers: [StudentFilesController],
})
export class StudentFilesModule {}
