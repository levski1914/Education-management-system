import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  subjectId: string;

  @IsString()
  teacherId: string;

  @IsString()
  classroomId: string;

  @IsInt()
  dayOfWeek: number; // 1=Понеделник, 7=Неделя

  @IsString()
  startTime: string; // "08:00"

  @IsString()
  endTime: string; // "09:00"
}
