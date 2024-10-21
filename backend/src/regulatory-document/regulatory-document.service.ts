import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegulatoryDocumentDto } from './dto/create-regulatory-document.dto';
import { UpdateRegulatoryDocumentDto } from './dto/update-regulatory-document.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentRegulatory } from './schemas/RegulatoryDocumentSchema';
import { Model } from 'mongoose';
import { DocumentTypeInter, Status } from "./entities/enums";

@Injectable()
export class RegulatoryDocumentService {
  constructor(@InjectModel(DocumentRegulatory.name) private documentRegulatory: Model<DocumentRegulatory>) { }

  async createPolicy(createRegulatoryDocumentDto: CreateRegulatoryDocumentDto) {
    const policyFound = await this.documentRegulatory
      .findOne({ type: DocumentTypeInter.policy })
      .sort({ version: -1 })
      .limit(1);
    if (policyFound) {
      policyFound.isCurrentVersion = false;
      policyFound.status = Status.not_current;
      policyFound.updatedAt = new Date();
      await policyFound.save();
      const res = new this.documentRegulatory({
        title: createRegulatoryDocumentDto.title,
        content: createRegulatoryDocumentDto.content,
        version: policyFound.version + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: createRegulatoryDocumentDto.effectiveDate,
        isDeleted: false,
        isCurrentVersion: true,
        previousVersionId: policyFound._id,
        status: Status.current,
        type: DocumentTypeInter.policy,
      })
      await res.save();
      return res;
    }
    const res = new this.documentRegulatory({
      title: createRegulatoryDocumentDto.title,
      content: createRegulatoryDocumentDto.content,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      effectiveDate: createRegulatoryDocumentDto.effectiveDate,
      isDeleted: false,
      isCurrentVersion: true,
      status: Status.current,
      type: DocumentTypeInter.policy
    });
    await res.save();
    return res;
  }

  async findAllPolicies() {
    const res = await this.documentRegulatory.find({isDeleted:false,type:DocumentTypeInter.policy});
    return res;
  }

  async findAllPoliciesHistory() {
    const res = await this.documentRegulatory.find({type:DocumentTypeInter.policy});
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} regulatoryDocument`;
  }

  async updatePolicy(id: string, updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto) {
    const lastPolicy = await this.documentRegulatory
    .findOne({ type: DocumentTypeInter.policy })
    .sort({ version: -1 })
    .limit(1);
    const policyFound = await this.documentRegulatory.findById(id);
    policyFound.isCurrentVersion = false;
    policyFound.status = Status.not_current;
    policyFound.updatedAt = new Date();
    await policyFound.save();
    if(!policyFound) throw new NotFoundException("La politica no se encuentra resgistrada o ha sido eliminada.");
    const res = new this.documentRegulatory({
      title: updateRegulatoryDocumentDto.title,
      content: updateRegulatoryDocumentDto.content,
      version: lastPolicy.version + 1,
      createdAt:new Date(),
      updatedAt: new Date(),
      effectiveDate: updateRegulatoryDocumentDto.effectiveDate,
      isDeleted: false,
      isCurrentVersion: true,
      previousVersionId: policyFound._id,
      status: Status.current,
      type: DocumentTypeInter.policy,
    })
    await res.save();
    return res;
  }

  async removePolicy(id: string) {
    const policyFound = await this.documentRegulatory.findById(id);
    policyFound.isDeleted = true;
    policyFound.isCurrentVersion = false;
    policyFound.status = Status.removed;
    await policyFound.save();
    return policyFound;
  }

  async activePolicy(id: string) {
    
    await this.documentRegulatory.updateMany({isDeleted:false},{isCurrentVersion:false,status:Status.not_current});

    const policyFound = await this.documentRegulatory.findById(id);
    policyFound.isDeleted = false;
    policyFound.isCurrentVersion = true;
    policyFound.status = Status.current;
    await policyFound.save();

    return policyFound;

  }
}
