import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyProfile } from '@prisma/client';

@Injectable()
export class CompanyProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  // Crear un nuevo perfil de empresa
  async create(
    createCompanyProfileDto: CreateCompanyProfileDto,
  ): Promise<CompanyProfile> {
    const { title, slogan, logoUrl, contactInfo, socialLinks } =
      createCompanyProfileDto;
    
    const companyProfile = await this.prismaService.companyProfile.create({
      data: {
        title,
        slogan,
        logoUrl,
        contactInfo, 
        socialLinks, // Aquí convertimos el array a JSON
      },
    });

    return companyProfile;
  }
  // Encontrar todos los perfiles de empresa
  async findAll() {
    return await this.prismaService.companyProfile.findMany();
  }

  // Encontrar un perfil de empresa por ID
  async findOne(id: number) {
    const companyProfile = await this.prismaService.companyProfile.findUnique({
      where: { id },
    });
    if (!companyProfile) {
      throw new NotFoundException(
        `Perfil de empresa con id ${id} no encontrado`,
      );
    }
    return companyProfile;
  }
  async update(
    id: number,
    updateCompanyProfileDto: UpdateCompanyProfileDto,
    adminId: number,
  ) {
    const existingProfile = await this.prismaService.companyProfile.findUnique({
      where: { id },
      include: { auditLog: true },
    });

    if (!existingProfile) {
      throw new NotFoundException(
        `Perfil de empresa con id ${id} no encontrado`,
      );
    }

    const auditEntries: any[] = [];

    // Comparar y registrar cambios en los campos básicos
    const fieldsToAudit = ['title', 'slogan', 'logoUrl'] as const;
    for (const field of fieldsToAudit) {
      if (
        updateCompanyProfileDto[field] &&
        updateCompanyProfileDto[field] !== existingProfile[field]
      ) {
        auditEntries.push({
          action: `Actualización de ${field} de "${existingProfile[field]}" a "${updateCompanyProfileDto[field]}"`,
          adminId,
          date: new Date(),
        });
      }
    }

    // Manejo de cambios en socialLinks (JSON)
    if (updateCompanyProfileDto.socialLinks) {
      const existingSocialLinks = existingProfile.socialLinks;

      if (
        JSON.stringify(updateCompanyProfileDto.socialLinks) !==
        JSON.stringify(existingSocialLinks)
      ) {
        auditEntries.push({
          action: `Actualización de socialLinks`,
          adminId,
          date: new Date(),
        });
      }
    }

    // Actualizar el perfil y agregar auditorías
    const updatedProfile = await this.prismaService.companyProfile.update({
      where: { id },
      data: {
        ...updateCompanyProfileDto,
        auditLog: {
          createMany: {
            data: auditEntries,
          },
        },
        socialLinks: updateCompanyProfileDto.socialLinks, // Aquí asignamos socialLinks correctamente
      },
    });

    return updatedProfile;
  }

  // Obtener auditorías de un perfil
  async getAudit(companyProfileId: number) {
    const auditLog = await this.prismaService.audit.findMany({
      where: { companyId: companyProfileId },
      include: {
        admin: true, // Incluimos la relación del administrador
      },
      orderBy: { date: 'desc' },
    });

    return auditLog.map((audit) => ({
      action: audit.action,
      date: audit.date,
      userName: audit.admin
        ? `${audit.admin.name} ${audit.admin.surname}`
        : 'Empleado eliminado.',
    }));
  }

  // Eliminar un perfil de empresa
  async remove(id: number) {
    const existingProfile = await this.prismaService.companyProfile.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      throw new NotFoundException(
        `Perfil de empresa con id ${id} no encontrado`,
      );
    }

    await this.prismaService.companyProfile.delete({ where: { id } });
    return existingProfile;
  }
}
