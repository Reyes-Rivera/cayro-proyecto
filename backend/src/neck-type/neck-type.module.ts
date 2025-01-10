import { Module } from '@nestjs/common';
import { NeckTypeService } from './neck-type.service';
import { NeckTypeController } from './neck-type.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [NeckTypeController],
  providers: [NeckTypeService],
})
export class NeckTypeModule {}
