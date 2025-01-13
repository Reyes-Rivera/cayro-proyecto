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
import { SleeveService } from './sleeve.service';
import { CreateSleeveDto } from './dto/create-sleeve.dto';
import { UpdateSleeveDto } from './dto/update-sleeve.dto';

@Controller('sleeve')
export class SleeveController {
  constructor(private readonly sleeveService: SleeveService) {}

  @Post()
  async create(@Body() createSleeveDto: CreateSleeveDto) {
    return await this.sleeveService.create(createSleeveDto);
  }

  @Get()
  async findAll() {
    const res = await this.sleeveService.findAll();
    if (!res)
      throw new NotFoundException('No se encuentran registros todavía.');
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const res = await this.sleeveService.findOne(+id);
    if(!res) throw new NotFoundException("El tipo de manga seleccionado no se encuentra registrado.")
    return res;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateSleeveDto: UpdateSleeveDto) {
    return await this.sleeveService.update(+id, updateSleeveDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.sleeveService.remove(+id);
  }
}
