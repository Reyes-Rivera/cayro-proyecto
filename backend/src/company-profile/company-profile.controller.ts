import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) { }

  @Post()
  // @Auth([Role.ADMIN])
  async create(@Body() createCompanyProfileDto: CreateCompanyProfileDto) {
    const res = await this.companyProfileService.create(createCompanyProfileDto);
    if (!res) throw new ConflictException("No se pudo crear el perfil de la empresa.");
    return res;
  }

  @Get()
  async findAll() {
    const res = await this.companyProfileService.findAll();
    if (!res) throw new ConflictException("No se encuentan registros aun.");
    return res;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyProfileService.findOne(+id);
  }

  @Patch(':id/:adminId')
  @Auth([Role.ADMIN])
  update(@Param('id') id: string, @Param("adminId") adminId: string, @Body() updateCompanyProfileDto: UpdateCompanyProfileDto) {
    return this.companyProfileService.update(Number(id), updateCompanyProfileDto, Number(adminId));
  }

  @Get('/audit-log/:id')
  async getAuditLog(@Param('id') id: string) {
    return this.companyProfileService.getAudit(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyProfileService.remove(+id);
  }
}
