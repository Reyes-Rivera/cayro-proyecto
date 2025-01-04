import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports:[PrismaModule],
  controllers: [ConfigurationController],
  providers: [ConfigurationService,PrismaService],
  exports:[ConfigurationService]
})
export class ConfigurationModule {}
