import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  async create(@Body() createMaterialDto: CreateMaterialDto) {
    return await this.materialService.create(createMaterialDto);
  }

  @Get()
  async findAll() {
    const res = await this.materialService.findAll();
    if (!res)
      throw new NotFoundException('No se encuentran registros todavia.');
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.materialService.findOne(+id);
    if (!res)
      throw new NotFoundException('El material seleccionado no se encuentra registrado.');
    return res;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialService.update(+id, updateMaterialDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.materialService.remove(+id);
  }
}
