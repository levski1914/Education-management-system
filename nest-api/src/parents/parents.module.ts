import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ParentsService, PrismaService],
  controllers: [ParentsController],
})
export class ParentsModule {}
