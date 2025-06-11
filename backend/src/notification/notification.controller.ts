// src/notifications/notifications.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':userId')
  async getUserNotifications(@Param('userId', ParseIntPipe) userId: number) {
    return await this.notificationsService.getPendingNotifications(userId);
  }
}
