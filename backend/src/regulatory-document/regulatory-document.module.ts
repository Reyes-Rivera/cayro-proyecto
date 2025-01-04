import { Module } from '@nestjs/common';
import { RegulatoryDocumentService } from './regulatory-document.service';
import { RegulatoryDocumentController } from './regulatory-document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentRegulatory, DocumentRegulatorySchema } from './schemas/RegulatoryDocumentSchema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: DocumentRegulatory.name, schema: DocumentRegulatorySchema },
  ])],
  controllers: [RegulatoryDocumentController],
  providers: [RegulatoryDocumentService],
})
export class RegulatoryDocumentModule { }
