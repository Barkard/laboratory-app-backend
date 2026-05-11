import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { id_user: number; title: string; message: string }) {
    console.log(`[DEBUG] Creating notification for UserID: ${data.id_user} | Title: ${data.title}`);
    return this.prisma.notification.create({
      data,
    });
  }


  async findAllByUser(id_user: number) {
    console.log(`[DEBUG] Fetching notifications for UserID: ${id_user}`);
    return this.prisma.notification.findMany({
      where: { id_user },
      orderBy: { created_at: 'desc' },
      take: 20,
    });
  }


  async markAsRead(id_notification: number) {
    return this.prisma.notification.update({
      where: { id_notification },
      data: { read: true },
    });
  }

  async markAllAsRead(id_user: number) {
    return this.prisma.notification.updateMany({
      where: { id_user, read: false },
      data: { read: true },
    });
  }
}
