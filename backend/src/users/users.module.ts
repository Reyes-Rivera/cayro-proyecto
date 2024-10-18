import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/User.Schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule.forRoot(),MongooseModule.forFeature([{name:User.name,schema:UserSchema}])],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
