import { IsString, IsInt } from 'class-validator';

export class CreateClassDto {
  @IsInt()
  grade: number;

  @IsString()
  letter: string;

  schoolId?: string;
}
