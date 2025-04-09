import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDirectorDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  schoolName: string;

  @IsString()
  schoolCity: string;
}
