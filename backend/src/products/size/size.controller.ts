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
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  async create(@Body() createSizeDto: CreateSizeDto) {
    return await this.sizeService.create(createSizeDto);
  }

  @Get()
  async findAll() {
    const res = await this.sizeService.findAll();
    if (!res)
      throw new NotFoundException(
        'No se encuentran tallas registradas todavía.',
      );
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const res = await this.sizeService.findOne(id);
    if (!res)
      throw new NotFoundException(
        'No se encuentran tallas registradas todavía.',
      );
    return res;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizeService.update(+id, updateSizeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.sizeService.remove(+id);
  }
}
