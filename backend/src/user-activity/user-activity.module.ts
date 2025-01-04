import { Module } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { UserActivityController } from './user-activity.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserActivityController],
  providers: [UserActivityService],
})
export class UserActivityModule {}
