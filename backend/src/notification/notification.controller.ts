// src/notifications/notifications.controller.ts
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { NotificationsService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':userId')
  async getUserNotifications(@Param('userId', ParseIntPipe) userId: number) {
    return await this.notificationsService.getPendingNotifications(userId);
  }
  @Post('verify')
  verify(@Body('code') code: string) {
    return this.notificationsService.verifySmartWatchCode(code);
  }
}
