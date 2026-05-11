import { Controller, Get, Param, Patch, ParseIntPipe, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:id')
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.findAllByUser(id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('user/:id/read-all')
  markAllAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAllAsRead(id);
  }
}
