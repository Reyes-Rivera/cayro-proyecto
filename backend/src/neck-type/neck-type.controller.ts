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
import { NeckTypeService } from './neck-type.service';
import { CreateNeckTypeDto } from './dto/create-neck-type.dto';
import { UpdateNeckTypeDto } from './dto/update-neck-type.dto';

@Controller('neck-type')
export class NeckTypeController {
  constructor(private readonly neckTypeService: NeckTypeService) {}

  @Post()
  async create(@Body() createNeckTypeDto: CreateNeckTypeDto) {
    return await this.neckTypeService.create(createNeckTypeDto);
  }

  @Get()
  async findAll() {
    const res = await this.neckTypeService.findAll();
    if (!res)
      throw new NotFoundException('No se encuentran registros todavía.');
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const res = await this.neckTypeService.findOne(+id);
    if (!res)
      throw new NotFoundException('No se encuentro el tipo de cuello.');
    return res;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNeckTypeDto: UpdateNeckTypeDto,
  ) {
    return this.neckTypeService.update(+id, updateNeckTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.neckTypeService.remove(+id);
  }
}
