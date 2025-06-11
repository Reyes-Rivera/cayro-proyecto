import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService,PrismaService],
})
export class NotificationModule {}
