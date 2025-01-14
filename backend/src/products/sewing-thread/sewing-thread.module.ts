import { Module } from '@nestjs/common';
import { SewingThreadService } from './sewing-thread.service';
import { SewingThreadController } from './sewing-thread.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SewingThreadController],
  providers: [SewingThreadService],
})
export class SewingThreadModule {}
