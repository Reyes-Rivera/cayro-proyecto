import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { UserActivityModule } from './user-activity/user-activity.module';
import { RegulatoryDocumentModule } from './regulatory-document/regulatory-document.module';
import { CompanyProfileModule } from './company-profile/company-profile.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { PrismaModule } from './prisma/prisma.module';
import { ColorsModule } from './products/colors/colors.module';
import { GenderModule } from './products/gender/gender.module';
import { CategoryModule } from './products/category/category.module';
import { SizeModule } from './products/size/size.module';
import { SleeveModule } from './products/sleeve/sleeve.module';
import { BrandModule } from './products/brand/brand.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
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
    CategoryModule,
    SizeModule,
    SleeveModule,
    BrandModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
