import { Module } from '@nestjs/common';
import { FabricTypeService } from './fabric-type.service';
import { FabricTypeController } from './fabric-type.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [FabricTypeController],
  providers: [FabricTypeService],
})
export class FabricTypeModule {}
