import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/users/schemas/User.Schema';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports:[
    ConfigModule.forRoot(),
    JwtModule.register({
      global:true,
      secret: "fhf fhslxo ahs",
    }),
    MongooseModule.forFeature([
      {name:User.name,schema:UserSchema}
    ]),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
