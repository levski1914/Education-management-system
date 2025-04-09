import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: 'PARENT' | 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPERADMIN';
}
