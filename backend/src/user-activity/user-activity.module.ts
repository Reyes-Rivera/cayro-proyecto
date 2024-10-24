import { Module } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { UserActivityController } from './user-activity.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserActivity, UserActivitySchema } from './schema/UserActivitySchema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: UserActivity.name, schema: UserActivitySchema }
  ])],
  controllers: [UserActivityController],
  providers: [UserActivityService],
})
export class UserActivityModule {}
