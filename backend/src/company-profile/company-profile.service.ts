import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyProfile } from './schema/CompanySchema';
import mongoose, { Model, Types } from 'mongoose';
import { Audit, ContactInfo, SocialLinks } from './entities/company-profile.entity';

@Injectable()
export class CompanyProfileService {
  constructor(@InjectModel(CompanyProfile.name) private companyProfile: Model<CompanyProfile>) { }

  // Crear un nuevo perfil de empresa
  create(createCompanyProfileDto: CreateCompanyProfileDto) {
    const createdCompanyProfile = new this.companyProfile(createCompanyProfileDto);
    return createdCompanyProfile.save();
  }

  // Encontrar todos los perfiles de empresa
  async findAll() {
    return await this.companyProfile.find();
  }

  // Encontrar un perfil de empresa por ID
  findOne(id: number) {
    return `This action returns a #${id} companyProfile`;
  }

  async update(
    id: string,
    updateCompanyProfileDto: UpdateCompanyProfileDto,
    adminId: string
  ): Promise<CompanyProfile> {
    const existingProfile = await this.companyProfile.findById(id).exec();
    if (!existingProfile) {
      throw new NotFoundException(`CompanyProfile with id ${id} not found`);
    }

    // Crear lista de cambios detectados
    const auditEntries: Audit[] = [];

    // Comparar y auditar cambios en el título
    if (updateCompanyProfileDto.title && updateCompanyProfileDto.title !== existingProfile.title) {
      auditEntries.push({
        action: `Actualización de título de "${existingProfile.title}" a "${updateCompanyProfileDto.title}"`,
        adminId,
        date: new Date(),
      });
    }

    // Comparar y auditar cambios en el eslogan
    if (updateCompanyProfileDto.slogan && updateCompanyProfileDto.slogan !== existingProfile.slogan) {
      auditEntries.push({
        action: `Actualización de eslogan de "${existingProfile.slogan}" a "${updateCompanyProfileDto.slogan}"`,
        adminId,
        date: new Date(),
      });
    }

    // Comparar y auditar cambios en el logo
    if (updateCompanyProfileDto.logoUrl && updateCompanyProfileDto.logoUrl !== existingProfile.logoUrl) {
      auditEntries.push({
        action: `Actualización de logo de "${existingProfile.logoUrl}" a "${updateCompanyProfileDto.logoUrl}"`,
        adminId,
        date: new Date(),
      });
    }

    // Comparar y auditar cambios en la información de contacto
    if (updateCompanyProfileDto.contactInfo) {
      const existingContactInfo: ContactInfo = existingProfile.contactInfo;

      if (updateCompanyProfileDto.contactInfo.email && updateCompanyProfileDto.contactInfo.email !== existingContactInfo.email) {
        auditEntries.push({
          action: `Actualización de correo electrónico de "${existingContactInfo.email}" a "${updateCompanyProfileDto.contactInfo.email}"`,
          adminId,
          date: new Date(),
        });
      }

      if (updateCompanyProfileDto.contactInfo.phone && updateCompanyProfileDto.contactInfo.phone !== existingContactInfo.phone) {
        auditEntries.push({
          action: `Actualización de teléfono de "${existingContactInfo.phone}" a "${updateCompanyProfileDto.contactInfo.phone}"`,
          adminId,
          date: new Date(),
        });
      }

      if (updateCompanyProfileDto.contactInfo.address && updateCompanyProfileDto.contactInfo.address !== existingContactInfo.address) {
        auditEntries.push({
          action: `Actualización de dirección de "${existingContactInfo.address}" a "${updateCompanyProfileDto.contactInfo.address}"`,
          adminId,
          date: new Date(),
        });
      }

      // Combinar los nuevos valores de contactInfo con los existentes
      existingProfile.contactInfo = {
        ...existingContactInfo, // Mantener los valores existentes
        ...updateCompanyProfileDto.contactInfo, // Sobrescribir solo los valores nuevos
      };
    }

    // Comparar y auditar cambios en las redes sociales
    if (updateCompanyProfileDto.socialLinks) {
      updateCompanyProfileDto.socialLinks.forEach((newSocialLink) => {
        const oldSocialLink = existingProfile.socialLinks.find(
          (link) => link._id && link._id.toString() === newSocialLink._id?.toString()
        );

        if (!oldSocialLink) {
          // Es una nueva red social, la auditamos y la añadimos
          auditEntries.push({
            action: `Añadida nueva red social: ${newSocialLink.platform} (${newSocialLink.url})`,
            adminId,
            date: new Date(),
          });
          // Añadir el nuevo enlace social
          existingProfile.socialLinks.push({
            ...newSocialLink,
            _id: new Types.ObjectId(), // Generar un nuevo ObjectId para las nuevas redes sociales
          });
        } else {
          // Actualizar la URL o la plataforma si han cambiado
          if (newSocialLink.url !== oldSocialLink.url) {
            auditEntries.push({
              action: `Actualización de URL de la red social ${newSocialLink.platform} de "${oldSocialLink.url}" a "${newSocialLink.url}"`,
              adminId,
              date: new Date(),
            });
            oldSocialLink.url = newSocialLink.url; // Actualizar URL
          }
          if (newSocialLink.platform !== oldSocialLink.platform) {
            auditEntries.push({
              action: `Actualización de plataforma de "${oldSocialLink.platform}" a "${newSocialLink.platform}"`,
              adminId,
              date: new Date(),
            });
            oldSocialLink.platform = newSocialLink.platform; // Actualizar plataforma
          }
        }
      });

      // Marcar explícitamente el campo socialLinks como modificado
      existingProfile.markModified('socialLinks');
    }

    // Actualizar el perfil con los nuevos valores y agregar los cambios de auditoría
    const updatedProfile = await this.companyProfile.findByIdAndUpdate(
      id,
      {
        $set: {
          title: updateCompanyProfileDto.title ?? existingProfile.title,
          slogan: updateCompanyProfileDto.slogan ?? existingProfile.slogan,
          logoUrl: updateCompanyProfileDto.logoUrl ?? existingProfile.logoUrl,
          contactInfo: existingProfile.contactInfo, // Actualizado previamente
          socialLinks: existingProfile.socialLinks, // Asegurarse de que los enlaces sociales están actualizados
        },
        $push: { auditLog: { $each: auditEntries } }, // Agregar entradas al auditLog
      },
      { new: true }
    ).exec();

    return updatedProfile;
  }

  remove(id: number) {
    return `This action removes a #${id} companyProfile`;
  }
}
