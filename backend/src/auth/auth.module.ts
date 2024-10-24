import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/users/schemas/User.Schema';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { Employee, EmployeeSchema } from 'src/employees/schemas/Eployee.schema';
import { UserActivity, UserActivitySchema } from 'src/user-activity/schema/UserActivitySchema';
import { Configuration, ConfigurationSchema } from 'src/configuration/schema/schemaconfig';
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: "fhf fhslxo ahs",
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: UserActivity.name, schema: UserActivitySchema },
      { name: Configuration.name, schema: ConfigurationSchema },

    ]),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
