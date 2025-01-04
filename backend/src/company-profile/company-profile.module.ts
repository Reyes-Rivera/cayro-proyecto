import { Module } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { CompanyProfileController } from './company-profile.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyProfile, CompanyProfileSchema } from './schema/CompanySchema';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: CompanyProfile.name,
      schema: CompanyProfileSchema
    },
    
  ]),PrismaModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
})
export class CompanyProfileModule { }
