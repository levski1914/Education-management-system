import { Role } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  receiverId?: string;

  @IsOptional()
  toRole?: Role;

  @IsOptional()
  classId?: string;
}
