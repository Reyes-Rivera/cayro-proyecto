import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SewingThreadService } from './sewing-thread.service';
import { CreateSewingThreadDto } from './dto/create-sewing-thread.dto';
import { UpdateSewingThreadDto } from './dto/update-sewing-thread.dto';

@Controller('sewing-thread')
export class SewingThreadController {
  constructor(private readonly sewingThreadService: SewingThreadService) {}

  @Post()
  create(@Body() createSewingThreadDto: CreateSewingThreadDto) {
    return this.sewingThreadService.create(createSewingThreadDto);
  }

  @Get()
  async findAll() {
    const res = await this.sewingThreadService.findAll();
    if (!res)
      throw new NotFoundException(
        'No se encuentra ningun hilo de costura registrado.',
      );
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const res = await this.sewingThreadService.findOne(id);
    if (!res)
      throw new ConflictException(
        'El tipo de hilo seleccionado no se encuentra registrado.',
      );
    return res;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateSewingThreadDto: UpdateSewingThreadDto,
  ) {
    return await this.sewingThreadService.update(+id, updateSewingThreadDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.sewingThreadService.remove(+id);
  }
}
