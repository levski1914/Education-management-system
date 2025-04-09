import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { SchoolsService } from './schools/schools.service';
import { SchoolsController } from './schools/schools.controller';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { SubjectModule } from './subject/subject.module';
import { LessonsService } from './lessons/lessons.service';
import { LessonsController } from './lessons/lessons.controller';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [UsersModule, AuthModule, ClassroomsModule, SubjectModule, LessonsModule],
  controllers: [AppController, SchoolsController, LessonsController],
  providers: [AppService, PrismaService, PrismaService, SchoolsService, LessonsService],
})
export class AppModule {}
