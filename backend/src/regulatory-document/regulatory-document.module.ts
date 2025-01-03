import { Module } from '@nestjs/common';
import { RegulatoryDocumentService } from './regulatory-document.service';
import { RegulatoryDocumentController } from './regulatory-document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentRegulatory, DocumentRegulatorySchema } from './schemas/RegulatoryDocumentSchema';
import { Employee, EmployeeSchema } from 'src/employees/schemas/Eployee.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: DocumentRegulatory.name, schema: DocumentRegulatorySchema },
  ])],
  controllers: [RegulatoryDocumentController],
  providers: [RegulatoryDocumentService],
})
export class RegulatoryDocumentModule { }
