import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegulatoryDocumentDto } from './dto/create-regulatory-document.dto';
import { UpdateRegulatoryDocumentDto } from './dto/update-regulatory-document.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentRegulatory } from './schemas/RegulatoryDocumentSchema';
import { Model } from 'mongoose';
import { DocumentTypeInter, Status } from "./entities/enums";
import { Employee } from 'src/employees/schemas/Eployee.schema';

@Injectable()
export class RegulatoryDocumentService {
  constructor(
    @InjectModel(DocumentRegulatory.name) private documentRegulatory: Model<DocumentRegulatory>,
  ) { }

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

  async createTerms(createRegulatoryDocumentDto: CreateRegulatoryDocumentDto) {
    const documentFound = await this.documentRegulatory
      .findOne({ type: DocumentTypeInter.terms })
      .sort({ version: -1 })
      .limit(1);
    if (documentFound) {
      documentFound.isCurrentVersion = false;
      documentFound.status = Status.not_current;
      documentFound.updatedAt = new Date();
      await documentFound.save();
      const res = new this.documentRegulatory({
        title: createRegulatoryDocumentDto.title,
        content: createRegulatoryDocumentDto.content,
        version: documentFound.version + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: createRegulatoryDocumentDto.effectiveDate,
        isDeleted: false,
        isCurrentVersion: true,
        previousVersionId: documentFound._id,
        status: Status.current,
        type: DocumentTypeInter.terms,
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
      type: DocumentTypeInter.terms
    });
    await res.save();
    return res;
  }

  async createBoundary(createRegulatoryDocumentDto: CreateRegulatoryDocumentDto) {
    const documentFound = await this.documentRegulatory
      .findOne({ type: DocumentTypeInter.boundary })
      .sort({ version: -1 })
      .limit(1);
    if (documentFound) {
      documentFound.isCurrentVersion = false;
      documentFound.status = Status.not_current;
      documentFound.updatedAt = new Date();
      await documentFound.save();
      const res = new this.documentRegulatory({
        title: createRegulatoryDocumentDto.title,
        content: createRegulatoryDocumentDto.content,
        version: documentFound.version + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: createRegulatoryDocumentDto.effectiveDate,
        isDeleted: false,
        isCurrentVersion: true,
        previousVersionId: documentFound._id,
        status: Status.current,
        type: DocumentTypeInter.boundary,
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
      type: DocumentTypeInter.boundary
    });
    await res.save();
    return res;
  }

  async findAllPolicies() {
    const res = await this.documentRegulatory.find({ isDeleted: false, type: DocumentTypeInter.policy });
    return res;
  }

  async findAllTerms() {
    const res = await this.documentRegulatory.find({ isDeleted: false, type: DocumentTypeInter.terms });
    return res;
  }
  async findAllBoundaries() {
    const res = await this.documentRegulatory.find({ isDeleted: false, type: DocumentTypeInter.boundary });
    return res;
  }

  async findAllPoliciesHistory() {
    const res = await this.documentRegulatory.find({ type: DocumentTypeInter.policy });
    return res;
  }

  async findAllTermsHistory() {
    const res = await this.documentRegulatory.find({ type: DocumentTypeInter.terms });
    return res;
  }

  async findAllBoundariesHistory() {
    const res = await this.documentRegulatory.find({ type: DocumentTypeInter.boundary });
    return res;
  }

  async findCurrentPolicy() {
    const res = await this.documentRegulatory.find({
        isDeleted: false,
        type: DocumentTypeInter.policy,
        isCurrentVersion: true,
    });
    return res[0] ; // Devolver el primer elemento o `null` si no existe
  }

  async findCurrentTerms() {
    const res = await this.documentRegulatory.find({
        isDeleted: false,
        type: DocumentTypeInter.terms,
        isCurrentVersion: true,
    });
    return res[0] ; // Devolver el primer elemento o `null` si no existe
  }

  async findCurrentBoundary() {
    const res = await this.documentRegulatory.find({
        isDeleted: false,
        type: DocumentTypeInter.boundary,
        isCurrentVersion: true,
    });
    return res[0];
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
    if (!policyFound) throw new NotFoundException("La politica no se encuentra resgistrada o ha sido eliminada.");
    const res = new this.documentRegulatory({
      title: updateRegulatoryDocumentDto.title,
      content: updateRegulatoryDocumentDto.content,
      version: lastPolicy.version + 1,
      createdAt: new Date(),
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

  async updateTerms(id: string, updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto) {
    const lastDoc = await this.documentRegulatory
      .findOne({ type: DocumentTypeInter.terms })
      .sort({ version: -1 })
      .limit(1);
    const docFound = await this.documentRegulatory.findById(id);
    docFound.isCurrentVersion = false;
    docFound.status = Status.not_current;
    docFound.updatedAt = new Date();
    await docFound.save();
    if (!docFound) throw new NotFoundException("El docuemnto no se encuentra resgistrada o ha sido eliminada.");
    const res = new this.documentRegulatory({
      title: updateRegulatoryDocumentDto.title,
      content: updateRegulatoryDocumentDto.content,
      version: lastDoc.version + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      effectiveDate: updateRegulatoryDocumentDto.effectiveDate,
      isDeleted: false,
      isCurrentVersion: true,
      previousVersionId: docFound._id,
      status: Status.current,
      type: DocumentTypeInter.terms,
    })
    await res.save();
    return res;
  }

  async updateBoundary(id: string, updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto) {
    const lastDoc = await this.documentRegulatory
      .findOne({ type: DocumentTypeInter.boundary })
      .sort({ version: -1 })
      .limit(1);
    const docFound = await this.documentRegulatory.findById(id);
    docFound.isCurrentVersion = false;
    docFound.status = Status.not_current;
    docFound.updatedAt = new Date();
    await docFound.save();
    if (!docFound) throw new NotFoundException("El docuemnto no se encuentra resgistrado o ha sido eliminada.");
    const res = new this.documentRegulatory({
      title: updateRegulatoryDocumentDto.title,
      content: updateRegulatoryDocumentDto.content,
      version: lastDoc.version + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      effectiveDate: updateRegulatoryDocumentDto.effectiveDate,
      isDeleted: false,
      isCurrentVersion: true,
      previousVersionId: docFound._id,
      status: Status.current,
      type: DocumentTypeInter.boundary,
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

  async removeTerms(id: string) {
    const docFound = await this.documentRegulatory.findById(id);
    docFound.isDeleted = true;
    docFound.isCurrentVersion = false;
    docFound.status = Status.removed;
    await docFound.save();
    return docFound;
  }

  async removeBoundary(id: string) {
    const docFound = await this.documentRegulatory.findById(id);
    docFound.isDeleted = true;
    docFound.isCurrentVersion = false;
    docFound.status = Status.removed;
    await docFound.save();
    return docFound;
  }

  async activePolicy(id: string) {

    await this.documentRegulatory.updateMany({ isDeleted: false, type: DocumentTypeInter.policy }, { isCurrentVersion: false, status: Status.not_current });
    const policyFound = await this.documentRegulatory.findById(id);
    policyFound.isDeleted = false;
    policyFound.isCurrentVersion = true;
    policyFound.status = Status.current;
    await policyFound.save();

    return policyFound;

  }

  async activeTerms(id: string) {
    await this.documentRegulatory.updateMany({ isDeleted: false, type: DocumentTypeInter.terms }, { isCurrentVersion: false, status: Status.not_current });
    const docFound = await this.documentRegulatory.findById(id);
    docFound.isDeleted = false;
    docFound.isCurrentVersion = true;
    docFound.status = Status.current;
    await docFound.save();

    return docFound;

  }

  async activeBoundary(id: string) {
    await this.documentRegulatory.updateMany({ isDeleted: false, type: DocumentTypeInter.boundary }, { isCurrentVersion: false, status: Status.not_current });
    const docFound = await this.documentRegulatory.findById(id);
    docFound.isDeleted = false;
    docFound.isCurrentVersion = true;
    docFound.status = Status.current;
    await docFound.save();
    return docFound;
  }

  findOne(id: number) {
    return `This action returns a #${id} regulatoryDocument`;
  }

}
