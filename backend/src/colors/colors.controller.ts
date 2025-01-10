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
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  async create(@Body() createColorDto: CreateColorDto): Promise<Color> {
    return await this.colorsService.create(createColorDto);
  }

  @Get()
  async findAll() {
    const res = await this.colorsService.findAll();
    if (!res)
      throw new NotFoundException('No se encuentran colores registrados.');
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const res = await this.colorsService.findOne(+id);
    if (!res)
      throw new NotFoundException('El color no se encuentra registrado.');
    return res;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return await this.colorsService.update(+id, updateColorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const res = await this.colorsService.remove(+id);
    if (!res)
      throw new NotFoundException('El color no se encuentra registrado.');
    return res;
  }
}
