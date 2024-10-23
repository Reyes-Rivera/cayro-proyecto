import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Post()
 async create(@Body() createCompanyProfileDto: CreateCompanyProfileDto) {
    const res = await this.companyProfileService.create(createCompanyProfileDto);
    if(!res) throw new ConflictException("No se pudo crear el perfil de la empresa.");
    return res;
  }

  @Get()
  async findAll() {
    const res = await this.companyProfileService.findAll();
    if(!res) throw new ConflictException("No se encuentan registros aun.");
    return res;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyProfileService.findOne(+id);
  }

  @Patch(':id/:adminId')
  update(@Param('id') id: string,@Param("adminId") adminId:string, @Body() updateCompanyProfileDto: UpdateCompanyProfileDto) {
    return this.companyProfileService.update(id, updateCompanyProfileDto,adminId);
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyProfileService.remove(+id);
  }
}
