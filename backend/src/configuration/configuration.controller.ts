import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) { }

  @Post()
  @Auth([Role.ADMIN])
  create(@Body() createConfigurationDto: CreateConfigurationDto) {
    return this.configurationService.create(createConfigurationDto);
  }

  @Get()
  findAll() {
    return this.configurationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configurationService.findOne(+id);
  }

  @Patch(':id')
  @Auth([Role.ADMIN])
  async update(@Param('id') id: string, @Body() updateConfigurationDto: UpdateConfigurationDto) {
    console.log(updateConfigurationDto)
    return await this.configurationService.update(id, updateConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configurationService.remove(+id);
  }
}
