import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Configuration } from '@prisma/client';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {
  constructor(private prismaService: PrismaService) {}
  async create(data: CreateConfigurationDto) {
    const configurationData = {
      timeTokenLogin: data.timeTokenLogin,
      timeTokenEmail: data.timeTokenEmail,
      attemptsLogin: data.attemptsLogin,
      emailVerificationInfo: data.emailVerificationInfo,
      emailLogin: data.emailLogin, 
      emailResetPass: data.emailResetPass,
    };
  
    return this.prismaService.configuration.create({
      data: configurationData,
    });
  }
  

  async findAll():Promise<Configuration[]> {
    return this.prismaService.configuration.findMany();
  }

  async update(
    id: number,
    updateConfigurationDto: UpdateConfigurationDto,
  ): Promise<Configuration> {
    try {
      // Filtrar campos undefined sin transformar objetos a JSON
      const updateData = Object.entries(updateConfigurationDto)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => {
          acc[key] = value; // Pasar el valor tal como está
          return acc;
        }, {});
  
      const existingConfig = await this.prismaService.configuration.update({
        where: { id: id },
        data: updateData,
      });
  
      if (!existingConfig) {
        throw new NotFoundException(`Configuration with ID ${id} not found`);
      }
  
      return existingConfig;
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw new Error('An error occurred while updating the configuration');
    }
  }
  
}
