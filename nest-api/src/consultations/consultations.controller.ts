import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Delete,
  Param,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/users/dto/current-user.decorator';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private prisma: PrismaService) {}

  @Post('create')
  async create(@CurrentUser() user: User, @Body() body: any) {
    const start = new Date(body.date);
    const end = new Date(start.getTime() + body.durationMin * 60000);

    const overlapping = await this.prisma.consultationSlot.findFirst({
      where: {
        teacherId: user.id,
        status: { in: ['AVAILABLE', 'BOOKED'] },
        OR: [
          {
            date: {
              lte: end,
              gte: start,
            },
          },
          {
            AND: [
              {
                date: {
                  lte: start,
                },
              },
              {
                date: {
                  gte: new Date(start.getTime() - 2 * 60 * 60000), // ограничение назад до 2ч по избор
                },
              },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException(
        '❌ Вече съществува слот в този времеви интервал.',
      );
    }

    return this.prisma.consultationSlot.create({
      data: {
        teacherId: user.id,
        date: start,
        durationMin: body.durationMin,
        notes: body.notes || '',
        status: 'AVAILABLE',
      },
    });
  }

  @Get('mine')
  async getMine(@CurrentUser() user: User) {
    return this.prisma.consultationSlot.findMany({
      where: { teacherId: user.id },
      orderBy: { date: 'asc' },
      include: {
        bookedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  @Put(':id')
  async updateSlot(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateConsultationDto,
  ) {
    const slot = await this.prisma.consultationSlot.findUnique({
      where: { id },
    });

    if (!slot || slot.teacherId !== user.id) {
      throw new BadRequestException(
        '⛔ Нямате права да редактирате този слот.',
      );
    }

    const newStart = new Date(body.date);
    const newEnd = new Date(newStart.getTime() + body.durationMin * 60000);

    const overlapping = await this.prisma.consultationSlot.findFirst({
      where: {
        teacherId: user.id,
        id: { not: id },
        status: { in: ['AVAILABLE', 'BOOKED'] },
        date: {
          lte: newEnd,
          gte: newStart,
        },
      },
    });

    if (overlapping) {
      throw new BadRequestException('⛔ Има припокриващ се друг слот.');
    }

    return this.prisma.consultationSlot.update({
      where: { id },
      data: {
        date: newStart,
        durationMin: body.durationMin,
        notes: body.notes || '',
        status: body.status, // добавено
      },
    });
  }

  @Post('book/:id')
  async book(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { notes?: string },
  ) {
    return this.prisma.consultationSlot.update({
      where: { id },
      data: {
        bookedById: user.id,
        status: 'BOOKED',
        notes: body.notes || '',
      },
    });
  }

  @Delete('hard/:id')
  async hardDelete(@CurrentUser() user: User, @Param('id') id: string) {
    const slot = await this.prisma.consultationSlot.findUnique({
      where: { id },
    });

    if (!slot || slot.teacherId !== user.id) {
      throw new Error('Нямате права да изтриете този слот');
    }

    return this.prisma.consultationSlot.delete({
      where: { id },
    });
  }
}
