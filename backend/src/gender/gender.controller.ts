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
import { GenderService } from './gender.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';

@Controller('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Post()
  async create(@Body() createGenderDto: CreateGenderDto) {
    return await this.genderService.create(createGenderDto);
  }

  @Get()
  async findAll() {
    const res = await this.genderService.findAll();
    if (!res)
      throw new NotFoundException('No se encontró ningún genero registrado.');
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const res = await this.genderService.findOne(+id);
    if (!res)
      throw new NotFoundException('El género no se encuentra registrado.');
    return res;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateGenderDto: UpdateGenderDto,
  ) {
    return await this.genderService.update(+id, updateGenderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.genderService.remove(+id);
    if (!res)
      throw new NotFoundException('No se encontró el género seleccionado.');
    return res;
  }
}
