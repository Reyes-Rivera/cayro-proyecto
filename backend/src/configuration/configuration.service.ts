import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Configuration } from './entities/configuration.entity';
import { Model } from 'mongoose';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(Configuration.name) private readonly configurationModel: Model<Configuration>
  ) { }
  async create(createConfigurationDto: CreateConfigurationDto): Promise<Configuration> {
    const newConfiguration = new this.configurationModel(createConfigurationDto);
    return newConfiguration.save();
  }

  findAll() {
    return this.configurationModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} configuration`;
  }

  async update(id: string, updateConfigurationDto: UpdateConfigurationDto): Promise<Configuration> {
    try {
      const existingConfig = await this.configurationModel.findByIdAndUpdate(
        id,
        { $set: updateConfigurationDto },
        { new: true, runValidators: true }
      );

      if (!existingConfig) {
        throw new NotFoundException(`Configuration with ID ${id} not found`);
      }

      return existingConfig;
    } catch (error) {
      console.log(error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} configuration`;
  }
}
