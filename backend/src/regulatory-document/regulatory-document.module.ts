import { Module } from '@nestjs/common';
import { RegulatoryDocumentService } from './regulatory-document.service';
import { RegulatoryDocumentController } from './regulatory-document.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RegulatoryDocumentController],
  providers: [RegulatoryDocumentService],
})
export class RegulatoryDocumentModule { }
