import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { UserActivityModule } from './user-activity/user-activity.module';
import { RegulatoryDocumentModule } from './regulatory-document/regulatory-document.module';
import { CompanyProfileModule } from './company-profile/company-profile.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { PrismaModule } from './prisma/prisma.module';
import { ColorsModule } from './colors/colors.module';
import { GenderModule } from './gender/gender.module';
import { FabricTypeModule } from './fabric-type/fabric-type.module';
import { NeckTypeModule } from './neck-type/neck-type.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    AuthModule,
    EmployeesModule,
    UserActivityModule,
    RegulatoryDocumentModule,
    CompanyProfileModule,
    ConfigurationModule,
    PrismaModule,
    ColorsModule,
    GenderModule,
    FabricTypeModule,
    NeckTypeModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
