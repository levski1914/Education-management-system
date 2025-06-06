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
      throw new BadRequestException('❌ Вече съществува слот в този времеви интервал.');
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

  @Post('book/:id')
  async book(@CurrentUser() user: User, @Param('id') id: string) {
    return this.prisma.consultationSlot.update({
      where: { id },
      data: {
        bookedById: user.id,
        status: 'BOOKED',
      },
    });
  }

  @Delete(':id')
  async cancel(@CurrentUser() user: User, @Param('id') id: string) {
    const slot = await this.prisma.consultationSlot.findUnique({
      where: { id },
    });

    if (!slot || slot.teacherId !== user.id) {
      throw new BadRequestException('⛔ Нямате права да изтриете този слот.');
    }

    return this.prisma.consultationSlot.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
