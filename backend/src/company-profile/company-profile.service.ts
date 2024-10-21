import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyProfile } from './schema/CompanySchema';
import { Model } from 'mongoose';
import { Audit } from './entities/company-profile.entity';

@Injectable()
export class CompanyProfileService {
  constructor(@InjectModel(CompanyProfile.name) private companyProfile: Model<CompanyProfile>) {

  }
  create(createCompanyProfileDto: CreateCompanyProfileDto) {
    const createdCompanyProfile = new this.companyProfile(createCompanyProfileDto);
    return createdCompanyProfile.save();
  }

  findAll() {
    return `This action returns all companyProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyProfile`;
  }

  async update(id: string, updateCompanyProfileDto: UpdateCompanyProfileDto, adminId: string): Promise<CompanyProfile> {
    const existingProfile = await this.companyProfile.findById(id).exec();
    if (!existingProfile) {
      throw new NotFoundException(`CompanyProfile with id ${id} not found`);
    }

    // Crear lista de cambios detectados
    const auditEntries: Audit[] = [];

    if (updateCompanyProfileDto.title && updateCompanyProfileDto.title !== existingProfile.title) {
      auditEntries.push({ action: 'Updated Title', adminId, date: new Date() });
    }

    if (updateCompanyProfileDto.slogan && updateCompanyProfileDto.slogan !== existingProfile.slogan) {
      auditEntries.push({ action: 'Updated Slogan', adminId, date: new Date() });
    }

    if (updateCompanyProfileDto.logoUrl && updateCompanyProfileDto.logoUrl !== existingProfile.logoUrl) {
      auditEntries.push({ action: 'Updated Logo', adminId, date: new Date() });
    }

    if (updateCompanyProfileDto.contactInfo && updateCompanyProfileDto.contactInfo !== existingProfile.contactInfo) {
      auditEntries.push({ action: 'Updated Contact Info', adminId, date: new Date() });
    }

    if (updateCompanyProfileDto.socialLinks && updateCompanyProfileDto.socialLinks !== existingProfile.socialLinks) {
      auditEntries.push({ action: 'Updated Social Links', adminId, date: new Date() });
    }

    // Actualizar el perfil con los nuevos valores
    const updatedProfile = await this.companyProfile.findByIdAndUpdate(
      id,
      {
        $set: updateCompanyProfileDto,
        $push: { auditLog: { $each: auditEntries } } // Agregar entradas al auditLog
      },
      { new: true }
    ).exec();

    return updatedProfile;
  }

  remove(id: number) {
    return `This action removes a #${id} companyProfile`;
  }
}
