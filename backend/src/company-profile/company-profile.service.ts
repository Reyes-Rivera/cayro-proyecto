import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  // Crear un nuevo perfil de empresa
  async create(createCompanyProfileDto: CreateCompanyProfileDto) {
    const { socialLinks, ...companyData } = createCompanyProfileDto;

    const createdSocialLinks = [];
    for (const socialLink of socialLinks) {
      const createdLink = await this.prismaService.socialLinks.create({
        data: {
          platform: socialLink.platform,
          url: socialLink.url,
        },
      });
      createdSocialLinks.push(createdLink.id);
    }

    // Crear el perfil de la compañía y asociar las redes sociales
    // Paso 1: Crear la compañía
    const companyProfile = await this.prismaService.companyProfile.create({
      data: {
        ...companyData, // Datos de la compañía
      },
      include: {
        socialLinks: true,
      },
    });

    // Paso 2: Asociar las redes sociales creadas a la compañía
    await this.prismaService.companyProfile.update({
      where: {
        id: companyProfile.id, // Usamos el id de la compañía recién creada
      },
      data: {
        socialLinks: {
          connect: createdSocialLinks.map((socialLinkId: number) => ({
            companyId_socialLinkId: {
              // Usamos la clave compuesta
              companyId: companyProfile.id, 
              socialLinkId,
            },
          })),
        },
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

  // Actualizar un perfil de empresa
  async update(
    id: number,
    updateCompanyProfileDto: UpdateCompanyProfileDto,
    adminId: number,
  ) {
    const existingProfile = await this.prismaService.companyProfile.findUnique({
      where: { id },
      include: { 
        socialLinks: { 
          include: { 
            socialLink: true // Access related socialLink object
          }
        } 
      }, 
    });
  
    if (!existingProfile) {
      throw new NotFoundException(`Perfil de empresa con id ${id} no encontrado`);
    }
  
    const auditEntries: any[] = [];
  
    // Comparar y registrar cambios en los campos básicos (title, slogan, logoUrl)
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
  
    // Manejo de cambios en contactInfo (Json)
    if (updateCompanyProfileDto.contactInfo) {
      const existingContactInfo = existingProfile.contactInfo;
      const newContactInfo = updateCompanyProfileDto.contactInfo;
  
      // Comparar cada campo del objeto contactInfo y registrar los cambios
      for (const [key, value] of Object.entries(newContactInfo)) {
        if (existingContactInfo?.[key] !== value) {
          auditEntries.push({
            action: `Actualización de ${key} de "${existingContactInfo?.[key]}" a "${value}"`,
            adminId,
            date: new Date(),
          });
        }
      }
    }
  
    // Manejo de cambios en socialLinks
    let socialLinksUpdate: any = {};
  
    if (updateCompanyProfileDto.socialLinks) {
      const createLinks: any[] = [];
      const updateLinks: any[] = [];
  
      for (const newLink of updateCompanyProfileDto.socialLinks) {
        const existingLink = existingProfile.socialLinks.find(
          (link) => link.socialLinkId === newLink.id,
        );
  
        if (!existingLink) {
          createLinks.push({
            companyId: id,
            socialLinkId: newLink.id,
          });
  
          auditEntries.push({
            action: `Añadida nueva red social: ${newLink.platform} (${newLink.url})`,
            adminId,
            date: new Date(),
          });
        } else {
          // If the platform or URL has changed, prepare to update the social link
          if (newLink.url !== existingLink.socialLink.url) {
            updateLinks.push({
              where: { companyId_socialLinkId: { companyId: id, socialLinkId: existingLink.socialLinkId } },
              data: { socialLink: { update: { url: newLink.url } } },
            });
  
            auditEntries.push({
              action: `Actualización de URL de ${existingLink.socialLink.platform} de "${existingLink.socialLink.url}" a "${newLink.url}"`,
              adminId,
              date: new Date(),
            });
          }
          if (newLink.platform !== existingLink.socialLink.platform) {
            updateLinks.push({
              where: { companyId_socialLinkId: { companyId: id, socialLinkId: existingLink.socialLinkId } },
              data: { socialLink: { update: { platform: newLink.platform } } },
            });
  
            auditEntries.push({
              action: `Actualización de plataforma de "${existingLink.socialLink.platform}" a "${newLink.platform}"`,
              adminId,
              date: new Date(),
            });
          }
        }
      }
  
      socialLinksUpdate = {
        create: createLinks,
        updateMany: updateLinks,
      };
    }
  
    // Actualizar el perfil y agregar auditorías
    const updatedProfile = await this.prismaService.companyProfile.update({
      where: { id },
      data: {
        ...updateCompanyProfileDto,
        socialLinks: socialLinksUpdate,
        auditLog: {
          createMany: {
            data: auditEntries,
          },
        },
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
