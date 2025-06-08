import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SlotStatus } from '@prisma/client';

export class UpdateConsultationDto {
  @IsDateString()
  date: string;

  @IsInt()
  @Min(5, { message: 'Минималната продължителност е 5 минути' })
  durationMin: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(SlotStatus, { message: 'Невалиден статус' })
  status?: SlotStatus;
}
