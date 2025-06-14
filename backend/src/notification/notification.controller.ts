// src/notifications/notifications.controller.ts
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { NotificationsService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Get(":userId")
  async getUserNotifications(@Param('userId') userId: string, @Query('since') since?: string) {
    const sinceTimestamp = since ? Number.parseInt(since, 10) : undefined
    return await this.notificationsService.getPendingNotifications(Number.parseInt(userId, 10), sinceTimestamp)
  }

  @Get(":userId/poll")
  async pollNotifications(@Param('userId') userId: string, @Query('lastUpdate') lastUpdate?: string) {
    if (!lastUpdate) {
      // Si no hay lastUpdate, devolver todas las notificaciones
      const notifications = await this.notificationsService.getPendingNotifications(Number.parseInt(userId, 10))
      return {
        hasUpdates: true,
        notifications,
        timestamp: Date.now(),
      }
    }

    const lastUpdateTimestamp = Number.parseInt(lastUpdate, 10)
    return await this.notificationsService.checkForUpdates(+userId, lastUpdateTimestamp)
  }

  @Post('verify')
  verify(@Body('code') code: string) {
    return this.notificationsService.verifySmartWatchCode(code);
  }
}
