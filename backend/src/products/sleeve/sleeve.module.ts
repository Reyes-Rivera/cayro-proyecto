import { Module } from '@nestjs/common';
import { SleeveService } from './sleeve.service';
import { SleeveController } from './sleeve.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SleeveController],
  providers: [SleeveService],
})
export class SleeveModule {}
