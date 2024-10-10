import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/users/schemas/User.Schema';

@Module({
  imports:[
    JwtModule.register({
      global:true,
      secret: "fhf fhslxo ahs",
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      {name:User.name,schema:UserSchema}
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
