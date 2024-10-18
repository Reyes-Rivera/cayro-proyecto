import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schemas/Eployee.schema';
import { User, UserSchema } from 'src/users/schemas/User.Schema';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_REST_PASS,
  }), ConfigModule.forRoot(), MongooseModule.forFeature([
    { name: Employee.name, schema: EmployeeSchema },
    { name: User.name, schema: UserSchema }
  ])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports:[EmployeesService]
})
export class EmployeesModule {}
