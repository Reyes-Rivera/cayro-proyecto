import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegulatoryDocumentDto } from './dto/create-regulatory-document.dto';
import { UpdateRegulatoryDocumentDto } from './dto/update-regulatory-document.dto';
import { DocumentTypeInter, Status } from './entities/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegulatoryDocumentService {
  constructor(private prismaService: PrismaService) {}

  async createPolicy(createRegulatoryDocumentDto: CreateRegulatoryDocumentDto) {
    const latestPolicy = await this.prismaService.documentRegulatory.findFirst({
      where: {
        type: DocumentTypeInter.policy,
      },
      orderBy: {
        version: 'desc',
      },
    });

    if (latestPolicy) {
      await this.prismaService.documentRegulatory.update({
        where: { id: latestPolicy.id },
        data: {
          isCurrentVersion: false,
          status: Status.not_current,
          updatedAt: new Date(),
        },
      });

      const newPolicy = await this.prismaService.documentRegulatory.create({
        data: {
          title: createRegulatoryDocumentDto.title,
          content: createRegulatoryDocumentDto.content,
          version: latestPolicy.version + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          effectiveDate: createRegulatoryDocumentDto.effectiveDate,
          isDeleted: false,
          isCurrentVersion: true,
          previousVersionId: latestPolicy.id, // Reference to the previous policy
          status: Status.current, // Adjust based on your `Status` enum mapping
          type: DocumentTypeInter.policy, // Adjust based on your `DocumentTypeInter` enum mapping
        },
      });

      return newPolicy;
    }

    const initialPolicy = await this.prismaService.documentRegulatory.create({
      data: {
        title: createRegulatoryDocumentDto.title,
        content: createRegulatoryDocumentDto.content,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: createRegulatoryDocumentDto.effectiveDate,
        isDeleted: false,
        isCurrentVersion: true,
        status: Status.current,
        type: DocumentTypeInter.policy,
      },
    });

    return initialPolicy;
  }

  async createTerms(createRegulatoryDocumentDto: CreateRegulatoryDocumentDto) {
    const documentFound = await this.prismaService.documentRegulatory.findFirst(
      {
        where: { type: DocumentTypeInter.terms },
        orderBy: { version: 'desc' },
      },
    );

    if (documentFound) {
      // Actualizar el documento anterior
      await this.prismaService.documentRegulatory.update({
        where: { id: documentFound.id },
        data: {
          isCurrentVersion: false,
          status: Status.not_current,
          updatedAt: new Date(),
        },
      });

      // Crear un nuevo documento basado en el encontrado
      const newDocument = await this.prismaService.documentRegulatory.create({
        data: {
          title: createRegulatoryDocumentDto.title,
          content: createRegulatoryDocumentDto.content,
          version: documentFound.version + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          effectiveDate: createRegulatoryDocumentDto.effectiveDate,
          isDeleted: false,
          isCurrentVersion: true,
          previousVersionId: documentFound.id,
          status: Status.current,
          type: DocumentTypeInter.terms,
        },
      });

      return newDocument;
    }

    // Crear el primer documento en caso de que no exista uno previo
    const newDocument = await this.prismaService.documentRegulatory.create({
      data: {
        title: createRegulatoryDocumentDto.title,
        content: createRegulatoryDocumentDto.content,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: createRegulatoryDocumentDto.effectiveDate,
        isDeleted: false,
        isCurrentVersion: true,
        status: Status.current,
        type: DocumentTypeInter.terms,
      },
    });

    return newDocument;
  }

  async createBoundary(
    createRegulatoryDocumentDto: CreateRegulatoryDocumentDto,
  ) {
    const documentFound = await this.prismaService.documentRegulatory.findFirst(
      {
        where: { type: DocumentTypeInter.boundary },
        orderBy: { version: 'desc' },
      },
    );

    if (documentFound) {
      // Actualizar el documento anterior
      await this.prismaService.documentRegulatory.update({
        where: { id: documentFound.id },
        data: {
          isCurrentVersion: false,
          status: Status.not_current,
          updatedAt: new Date(),
        },
      });

      // Crear un nuevo documento basado en el encontrado
      const newDocument = await this.prismaService.documentRegulatory.create({
        data: {
          title: createRegulatoryDocumentDto.title,
          content: createRegulatoryDocumentDto.content,
          version: documentFound.version + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          effectiveDate: createRegulatoryDocumentDto.effectiveDate,
          isDeleted: false,
          isCurrentVersion: true,
          previousVersionId: documentFound.id,
          status: Status.current,
          type: DocumentTypeInter.boundary,
        },
      });

      return newDocument;
    }

    // Crear el primer documento en caso de que no exista uno previo
    const newDocument = await this.prismaService.documentRegulatory.create({
      data: {
        title: createRegulatoryDocumentDto.title,
        content: createRegulatoryDocumentDto.content,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: createRegulatoryDocumentDto.effectiveDate,
        isDeleted: false,
        isCurrentVersion: true,
        status: Status.current,
        type: DocumentTypeInter.boundary,
      },
    });

    return newDocument;
  }

  async findAllPolicies() {
    const res = await this.prismaService.documentRegulatory.findMany({
      where: {
        isDeleted: false,
        type: DocumentTypeInter.policy,
      },
    });
    return res;
  }

  async findAllTerms() {
    const res = await this.prismaService.documentRegulatory.findMany({
      where: {
        isDeleted: false,
        type: DocumentTypeInter.terms,
      },
    });
    return res;
  }
  async findAllBoundaries() {
    const res = await this.prismaService.documentRegulatory.findMany({
      where: {
        isDeleted: false,
        type: DocumentTypeInter.boundary,
      },
    });
    return res;
  }

  async findAllPoliciesHistory() {
    const res = await this.prismaService.documentRegulatory.findMany({
      where: {
        type: DocumentTypeInter.policy,
      },
    });
    return res;
  }

  async findAllTermsHistory() {
    const res = await this.prismaService.documentRegulatory.findMany({
      where: {
        type: DocumentTypeInter.terms,
      },
    });
    return res;
  }

  async findAllBoundariesHistory() {
    const res = await this.prismaService.documentRegulatory.findMany({
      where: {
        type: DocumentTypeInter.boundary,
      },
    });
    return res;
  }

  async findCurrentPolicy() {
    const res = await this.prismaService.documentRegulatory.findFirst({
      where: {
        isDeleted: false,
        type: DocumentTypeInter.policy,
        isCurrentVersion: true,
      },
    });
    return res[0];
  }

  async findCurrentTerms() {
    const res = await this.prismaService.documentRegulatory.findFirst({
      where: {
        isDeleted: false,
        type: DocumentTypeInter.terms,
        isCurrentVersion: true,
      },
    });

    return res[0];
  }

  async findCurrentBoundary() {
    const res = await this.prismaService.documentRegulatory.findFirst({
      where: {
        isDeleted: false,
        type: DocumentTypeInter.boundary,
        isCurrentVersion: true,
      },
    });
    return res[0];
  }

  async updatePolicy(
    id: number,
    updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto,
  ) {
    const lastPolicy = await this.prismaService.documentRegulatory.findFirst({
      where: { type: DocumentTypeInter.policy },
      orderBy: { version: 'desc' },
    });

    const policyFound = await this.prismaService.documentRegulatory.findUnique({
      where: { id },
    });

    if (!policyFound) {
      throw new NotFoundException(
        'La política no se encuentra registrada o ha sido eliminada.',
      );
    }

    // Actualizar el documento actual como no vigente
    await this.prismaService.documentRegulatory.update({
      where: { id },
      data: {
        isCurrentVersion: false,
        status: Status.not_current,
        updatedAt: new Date(),
      },
    });

    // Crear una nueva versión del documento
    const newPolicy = await this.prismaService.documentRegulatory.create({
      data: {
        title: updateRegulatoryDocumentDto.title,
        content: updateRegulatoryDocumentDto.content,
        version: lastPolicy ? lastPolicy.version + 1 : 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: updateRegulatoryDocumentDto.effectiveDate,
        isDeleted: false,
        isCurrentVersion: true,
        previousVersionId: policyFound.id,
        status: Status.current,
        type: DocumentTypeInter.policy,
      },
    });

    return newPolicy;
  }

  async updateTerms(
    id: number,
    updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto,
  ) {
    // Obtener el último documento de tipo "terms"
    const lastDoc = await this.prismaService.documentRegulatory.findFirst({
      where: { type: DocumentTypeInter.terms },
      orderBy: { version: 'desc' },
    });

    // Verificar si existe el documento actual por ID
    const docFound = await this.prismaService.documentRegulatory.findUnique({
      where: { id },
    });

    if (!docFound) {
      throw new NotFoundException(
        'El documento no se encuentra registrado o ha sido eliminado.',
      );
    }

    // Actualizar el documento actual como no vigente
    await this.prismaService.documentRegulatory.update({
      where: { id },
      data: {
        isCurrentVersion: false,
        status: Status.not_current,
        updatedAt: new Date(),
      },
    });

    // Crear una nueva versión del documento
    const newTerms = await this.prismaService.documentRegulatory.create({
      data: {
        title: updateRegulatoryDocumentDto.title,
        content: updateRegulatoryDocumentDto.content,
        version: lastDoc ? lastDoc.version + 1 : 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: updateRegulatoryDocumentDto.effectiveDate,
        isDeleted: false,
        isCurrentVersion: true,
        previousVersionId: docFound.id,
        status: Status.current,
        type: DocumentTypeInter.terms,
      },
    });

    return newTerms;
  }

  async updateBoundary(
    id: number,
    updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto,
  ) {
    // Obtener el último documento de tipo "boundary"
    const lastDoc = await this.prismaService.documentRegulatory.findFirst({
      where: { type: DocumentTypeInter.boundary },
      orderBy: { version: 'desc' },
    });

    // Verificar si existe el documento actual por ID
    const docFound = await this.prismaService.documentRegulatory.findUnique({
      where: { id },
    });

    if (!docFound) {
      throw new NotFoundException(
        'El documento no se encuentra registrado o ha sido eliminado.',
      );
    }

    // Actualizar el documento actual como no vigente
    await this.prismaService.documentRegulatory.update({
      where: { id },
      data: {
        isCurrentVersion: false,
        status: Status.not_current,
        updatedAt: new Date(),
      },
    });

    // Crear una nueva versión del documento
    const newBoundary = await this.prismaService.documentRegulatory.create({
      data: {
        title: updateRegulatoryDocumentDto.title,
        content: updateRegulatoryDocumentDto.content,
        version: lastDoc ? lastDoc.version + 1 : 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: updateRegulatoryDocumentDto.effectiveDate,
        isDeleted: false,
        isCurrentVersion: true,
        previousVersionId: docFound.id,
        status: Status.current,
        type: DocumentTypeInter.boundary,
      },
    });

    return newBoundary;
  }

  async removePolicy(id: number) {
    const policyFound = await this.prismaService.documentRegulatory.update({
      where: { id },
      data: {
        isDeleted: true,
        isCurrentVersion: false,
        status: Status.removed,
      },
    });
    return policyFound;
  }

  async removeTerms(id: number) {
    const docFound = await this.prismaService.documentRegulatory.update({
      where: { id },
      data: {
        isDeleted: true,
        isCurrentVersion: false,
        status: Status.removed,
      },
    });
    return docFound;
  }

  async removeBoundary(id: number) {
    const docFound = await this.prismaService.documentRegulatory.update({
      where: { id },
      data: {
        isDeleted: true,
        isCurrentVersion: false,
        status: Status.removed,
      },
    });
    return docFound;
  }

  async activePolicy(id: number) {
    await this.prismaService.documentRegulatory.updateMany({
      where: {
        type: DocumentTypeInter.policy,
        id: { not: id },
        isDeleted: false,
      },
      data: {
        isCurrentVersion: false,
        status: Status.not_current,
      },
    });
    const policyFound = await this.prismaService.documentRegulatory.update({
      where: { id },
      data: {
        isDeleted: false,
        isCurrentVersion: true,
        status: Status.current,
      },
    });

    return policyFound;
  }

  async activeTerms(id: number) {
    await this.prismaService.documentRegulatory.updateMany({
      where: {
        type: DocumentTypeInter.terms,
        id: { not: id },
        isDeleted: false,
      },
      data: {
        isCurrentVersion: false,
        status: Status.not_current,
      },
    });
    const docFound = await this.prismaService.documentRegulatory.update({
      where: { id },
      data: {
        isDeleted: false,
        isCurrentVersion: true,
        status: Status.current,
      },
    });
    return docFound;
  }

  async activeBoundary(id: number) {
    await this.prismaService.documentRegulatory.updateMany({
      where: {
        type: DocumentTypeInter.boundary,
        id: { not: id },
        isDeleted: false,
      },
      data: {
        isCurrentVersion: false,
        status: Status.not_current,
      },
    });
    const docFound = await this.prismaService.documentRegulatory.update({
      where: { id },
      data: {
        isDeleted: false,
        isCurrentVersion: true,
        status: Status.current,
      },
    });
    return docFound;
  }

  findOne(id: number) {
    return `This action returns a #${id} regulatoryDocument`;
  }
}
