import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService,CloudinaryService],
  imports: [PrismaModule],
})
export class ProductModule {}
