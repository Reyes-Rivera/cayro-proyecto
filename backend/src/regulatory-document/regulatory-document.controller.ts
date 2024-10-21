import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, Put, NotFoundException } from '@nestjs/common';
import { RegulatoryDocumentService } from './regulatory-document.service';
import { CreateRegulatoryDocumentDto } from './dto/create-regulatory-document.dto';
import { UpdateRegulatoryDocumentDto } from './dto/update-regulatory-document.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('regulatory-document')
export class RegulatoryDocumentController {
  constructor(private readonly regulatoryDocumentService: RegulatoryDocumentService) { }

  @Post("policy")
  async createPolicy(@Body() createRegulatoryDocumentDto: CreateRegulatoryDocumentDto) {
    const res = await this.regulatoryDocumentService.createPolicy(createRegulatoryDocumentDto);
    if (!res) throw new ConflictException("Algo salio mal al registrar, intentalo mas tarde.")
    return res;
  }

  @Auth([Role.ADMIN])
  @Get("policy")
  async findAllPolicies() {
    const res = await this.regulatoryDocumentService.findAllPolicies();
    if(!res) throw new NotFoundException("No hay politicas todavia.");
    return res;
  }

  @Get("policy-history")
  async findAllPoliciesHistory() {
    const res = await this.regulatoryDocumentService.findAllPoliciesHistory();
    if(!res) throw new NotFoundException("No hay politicas todavia.");
    return res;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regulatoryDocumentService.findOne(+id);
  }

  @Put('update-policy/:id')
  async updatePolicy(@Param('id') id: string, @Body() updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto) {
    const res = await this.regulatoryDocumentService.updatePolicy(id, updateRegulatoryDocumentDto);
    if (!res) throw new ConflictException("Algo salio mal al actualizar la politica, intentalo mas tarde.")
    return res;
  }

  @Delete('remove-policy/:id')
  async removePolicy(@Param('id') id: string) {
    const res = await this.regulatoryDocumentService.removePolicy(id);
    if (!res) throw new ConflictException("Algo salio mal al eliminar la politica, intentalo mas tarde.")
    return res;
  }
  @Patch('active-policy/:id')
  async activePolicy(@Param('id') id: string) {
    const res = await this.regulatoryDocumentService.activePolicy(id);
    if (!res) throw new ConflictException("Algo salio mal al activar la politica, intentalo mas tarde.")
    return res;
  }
}
