import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_REST_PASS,
  }),PrismaModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports:[EmployeesService]
})
export class EmployeesModule {}
