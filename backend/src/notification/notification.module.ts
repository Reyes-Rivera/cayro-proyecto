import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService,PrismaService],
})
export class NotificationModule {}
