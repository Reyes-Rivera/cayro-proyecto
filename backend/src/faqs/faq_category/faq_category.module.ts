import { Module } from '@nestjs/common';
import { FaqCategoryService } from './faq_category.service';
import { FaqCategoryController } from './faq_category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [FaqCategoryController],
  providers: [FaqCategoryService],
})
export class FaqCategoryModule {}
