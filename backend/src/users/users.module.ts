import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/User.Schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserActivity, UserActivitySchema } from 'src/user-activity/schema/UserActivitySchema';
import { Configuration, ConfigurationSchema } from 'src/configuration/schema/schemaconfig';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_REST_PASS,
  }), ConfigModule.forRoot(), MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: UserActivity.name, schema: UserActivitySchema },
    {
      name:Configuration.name,
      schema:ConfigurationSchema
    }
  ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
