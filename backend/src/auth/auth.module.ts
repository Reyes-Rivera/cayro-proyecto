import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './roles/roles.guard'; // si lo tienes ahí

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET, // usa el correcto aquí
      signOptions: { expiresIn: '15m' }, // opcional pero recomendable
    }),
    UsersModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard], // 👈 registra los guards y estrategias
  exports: [JwtStrategy], // 👈 si quieres usarla en otros módulos
})
export class AuthModule {}
