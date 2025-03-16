import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, Put, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { RegulatoryDocumentService } from './regulatory-document.service';
import { CreateRegulatoryDocumentDto } from './dto/create-regulatory-document.dto';
import { UpdateRegulatoryDocumentDto } from './dto/update-regulatory-document.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('regulatory-document')
export class RegulatoryDocumentController {
  constructor(private readonly regulatoryDocumentService: RegulatoryDocumentService) { }
  @Post("policy")
  // @Auth([Role.ADMIN])
  async createPolicy(@Body() createRegulatoryDocumentDto: CreateRegulatoryDocumentDto) {
    const res = await this.regulatoryDocumentService.createPolicy(createRegulatoryDocumentDto);
    if (!res) throw new ConflictException("Algo salio mal al registrar, intentalo mas tarde.")
    return res;
  }
  @Post("terms")
  // @Auth([Role.ADMIN])
  async createTerms(@Body() createRegulatoryDocumentDto: CreateRegulatoryDocumentDto) {
    const res = await this.regulatoryDocumentService.createTerms(createRegulatoryDocumentDto);
    if (!res) throw new ConflictException("Algo salio mal al registrar, intentalo mas tarde.")
    return res;
  }

  @Post("boundary")
  // @Auth([Role.ADMIN])
  async createBoundary(@Body() createRegulatoryDocumentDto: CreateRegulatoryDocumentDto) {
    const res = await this.regulatoryDocumentService.createBoundary(createRegulatoryDocumentDto);
    if (!res) throw new ConflictException("Algo salio mal al registrar, intentalo mas tarde.")
    return res;
  }

  
  @Get("policy")
  async findAllPolicies() {
    const res = await this.regulatoryDocumentService.findAllPolicies();
    if (!res) throw new NotFoundException("No hay politicas todavia.");
    return res;
  }

  @Get("current-policy")
  async findCurrentPolicy() {
    const res = await this.regulatoryDocumentService.findCurrentPolicy();
    if (!res) throw new NotFoundException("No hay politicas todavia.");
    return res;
  }

  @Get("current-term")
  async findCurrentTerms() {
    const res = await this.regulatoryDocumentService.findCurrentTerms();

    if (!res) throw new NotFoundException("No hay politicas todavia.");
    return res;
  }

  @Get("current-boundary")
  async findCurrentBoundary() {
    const res = await this.regulatoryDocumentService.findCurrentBoundary();
    if (!res) throw new NotFoundException("No hay politicas todavia.");
    return res;
  }


  @Get("terms")
  async findAllTerms() {
    const res = await this.regulatoryDocumentService.findAllTerms();
    if (!res) throw new NotFoundException("No hay terminos y condiciones todavia.");
    return res;
  }

  
  @Get("boundary")
  async findAllBoundaries() {
    const res = await this.regulatoryDocumentService.findAllBoundaries();
    if (!res) throw new NotFoundException("No hay terminos y condiciones todavia.");
    return res;
  }

  @Get("policy-history")
  async findAllPoliciesHistory() {
    const res = await this.regulatoryDocumentService.findAllPoliciesHistory();
    if (!res) throw new NotFoundException("No hay politicas todavia.");
    return res;
  }

  @Get("terms-history")
  async findAllTermsHistory() {
    const res = await this.regulatoryDocumentService.findAllTermsHistory();
    if (!res) throw new NotFoundException("No hay terminos y condiciones todavia.");
    return res;
  }

  @Get("boundary-history")
  async findAllBoundaryHistory() {
    const res = await this.regulatoryDocumentService.findAllBoundariesHistory();
    if (!res) throw new NotFoundException("No hay documentos todavia.");
    return res;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regulatoryDocumentService.findOne(+id);
  }

  @Put('update-policy/:id')
  @Auth([Role.ADMIN])
  async updatePolicy(@Param('id') id: string, @Body() updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto) {
    const res = await this.regulatoryDocumentService.updatePolicy(Number(id), updateRegulatoryDocumentDto);
    if (!res) throw new ConflictException("Algo salio mal al actualizar la politica, intentalo mas tarde.")
    return res;
  }

  @Put('update-terms/:id')
  @Auth([Role.ADMIN])
  async updateTemrs(@Param('id') id: string, @Body() updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto) {
    const res = await this.regulatoryDocumentService.updateTerms(Number(id), updateRegulatoryDocumentDto);
    if (!res) throw new ConflictException("Algo salio mal al actualizar, intentalo mas tarde.")
    return res;
  }

  @Put('update-boundary/:id')
  @Auth([Role.ADMIN])
  async updateBoundary(@Param('id') id: string, @Body() updateRegulatoryDocumentDto: UpdateRegulatoryDocumentDto) {
    const res = await this.regulatoryDocumentService.updateBoundary(Number(id), updateRegulatoryDocumentDto);
    if (!res) throw new ConflictException("Algo salio mal al actualizar, intentalo mas tarde.")
    return res;
  }

  @Delete('remove-policy/:id')
  @Auth([Role.ADMIN])
  async removePolicy(@Param('id') id: string) {
    const res = await this.regulatoryDocumentService.removePolicy(Number(id));
    if (!res) throw new ConflictException("Algo salio mal al eliminar la politica, intentalo mas tarde.")
    return res;
  }

  @Delete('remove-terms/:id')
  @Auth([Role.ADMIN])
  async removeTerms(@Param('id') id: string) {
    const res = await this.regulatoryDocumentService.removeTerms(Number(id));
    if (!res) throw new ConflictException("Algo salio mal al eliminar el documento, intentalo mas tarde.")
    return res;
  }

  @Delete('remove-boundary/:id')
  @Auth([Role.ADMIN])
  async removeBoundary(@Param('id') id: string) {
    const res = await this.regulatoryDocumentService.removeBoundary(Number(id));
    if (!res) throw new ConflictException("Algo salio mal al eliminar el documento, intentalo mas tarde.")
    return res;
  }

  @Patch('active-policy/:id')
  @Auth([Role.ADMIN])
  async activePolicy(@Param('id') id: string) {
    const res = await this.regulatoryDocumentService.activePolicy(Number(id));
    if (!res) throw new ConflictException("Algo salio mal al activar la politica, intentalo mas tarde.")
    return res;
  }

  @Patch('active-terms/:id')
  @Auth([Role.ADMIN])
  async activeTerms(@Param('id') id: string) {
    const res = await this.regulatoryDocumentService.activeTerms(Number(id));
    if (!res) throw new ConflictException("Algo salio mal al activar los terminos y condiciones, intentalo mas tarde.")
    return res;
  }
  @Patch('active-boundary/:id')
  @Auth([Role.ADMIN])
  async activeBoundary(@Param('id') id: string) {
    const res = await this.regulatoryDocumentService.activeBoundary(Number(id));
    if (!res) throw new ConflictException("Algo salio mal al activar el documento, intentalo mas tarde.")
    return res;
  }

}
