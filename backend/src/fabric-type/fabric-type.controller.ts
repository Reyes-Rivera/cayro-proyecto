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
import { FabricTypeService } from './fabric-type.service';
import { CreateFabricTypeDto } from './dto/create-fabric-type.dto';
import { UpdateFabricTypeDto } from './dto/update-fabric-type.dto';

@Controller('fabric-type')
export class FabricTypeController {
  constructor(private readonly fabricTypeService: FabricTypeService) {}

  @Post()
  async create(@Body() createFabricTypeDto: CreateFabricTypeDto) {
    return await this.fabricTypeService.create(createFabricTypeDto);
  }

  @Get()
  async findAll() {
    const res = await this.fabricTypeService.findAll();
    if (!res)
      throw new NotFoundException('No se encuentran registros todavia.');
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.fabricTypeService.findOne(+id);
    if (!res)
      throw new NotFoundException(
        'No se encontró el tipo de tela seleccionado.',
      );
    return res;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFabricTypeDto: UpdateFabricTypeDto,
  ) {
    return this.fabricTypeService.update(+id, updateFabricTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fabricTypeService.remove(+id);
  }
}
