import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/users/dto/current-user.decorator';
import { User } from '@prisma/client';
import { CreateMessageDto } from './dto/create-messages.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private prisma: PrismaService) {}
  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: User) {
    const count = await this.prisma.message.count({
      where: {
        receiverId: user.id, // само получени
        NOT: {
          readBy: {
            has: user.id,
          },
        },
      },
    });
    return { count };
  }

  @Put('mark-all-read/:userId')
  async markAllFromUserAsRead(
    @Param('userId') senderId: string,
    @CurrentUser() user: User,
  ) {
    const messages = await this.prisma.message.findMany({
      where: {
        senderId,
        receiverId: user.id,
        NOT: {
          readBy: { has: user.id },
        },
      },
    });

    for (const msg of messages) {
      await this.prisma.message.update({
        where: { id: msg.id },
        data: {
          readBy: { push: user.id },
        },
      });
    }

    return { updated: messages.length };
  }

  @Get('conversations')
  async getConversations(@CurrentUser() user: User) {
    const sent = await this.prisma.message.findMany({
      where: { senderId: user.id, receiverId: { not: null } },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const received = await this.prisma.message.findMany({
      where: { receiverId: user.id },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    const userIds = Array.from(
      new Set([
        ...sent.map((m) => m.receiverId),
        ...received.map((m) => m.senderId),
      ]),
    ).filter(Boolean);

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds as string[] } },
      select: { id: true, firstName: true, lastName: true, role: true },
    });

    // get last message per conversation
    const messages = await Promise.all(
      users.map(async (u) => {
        const lastMsg = await this.prisma.message.findFirst({
          where: {
            OR: [
              { senderId: user.id, receiverId: u.id },
              { senderId: u.id, receiverId: user.id },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });
        return {
          ...u,
          lastMessage: lastMsg?.body || '',
          lastMessageId: lastMsg?.id || '',
          unread: lastMsg ? !lastMsg.readBy.includes(user.id) : false,
        };
      }),
    );

    return messages;
  }

  @Get('conversation/:userId')
  async getConversation(
    @Param('userId') userId: string,
    @CurrentUser() user: User,
  ) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: userId },
          { senderId: userId, receiverId: user.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  @Get('thread/:userId')
  async getThread(
    @Param('userId') otherUserId: string,
    @CurrentUser() user: User,
  ) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: user.id,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: { firstName: true, lastName: true, role: true, id: true },
        },
        receiver: {
          select: { firstName: true, lastName: true, role: true, id: true },
        },
      },
    });
  }

  @Post()
  async sendMessage(@Body() dto: CreateMessageDto, @CurrentUser() user: User) {
    return this.prisma.message.create({
      data: {
        title: dto.title,
        body: dto.body,
        senderId: user.id,
        receiverId: dto.receiverId,
        toRole: dto.toRole,
        classId: dto.classId,
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
            role: true,
          },
        },
      },
    });
  }

  @Get()
  async getMessages(@CurrentUser() user: User) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { receiverId: user.id },
          { toRole: user.role },
          { classId: user.classId },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) throw new Error('Message not found');

    if (!message.readBy.includes(user.id)) {
      await this.prisma.message.update({
        where: { id },
        data: {
          readBy: { push: user.id },
        },
      });
    }

    return { success: true };
  }
}
