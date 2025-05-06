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
import { GradesModule } from './grades/grades.module';
import { AttendanceModule } from './attendance/attendance.module';
import { StudentsModule } from './students/students.module';
import { StudentsService } from './students/students.service';
import { StudentsController } from './students/students.controller';
import { StudentFilesModule } from './student-files/student-files.module';
import { ParentsModule } from './parents/parents.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ClassroomsModule,
    SubjectModule,
    LessonsModule,
    GradesModule,
    AttendanceModule,
    StudentsModule,
    StudentFilesModule,
    ParentsModule,
    TeacherModule,
  ],
  controllers: [
    AppController,
    SchoolsController,
    LessonsController,
    StudentsController,
  ],
  providers: [
    AppService,
    PrismaService,
    PrismaService,
    SchoolsService,
    LessonsService,
    StudentsService,
  ],
})
export class AppModule {}
