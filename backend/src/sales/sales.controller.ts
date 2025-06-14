import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { ChangeStatusDto, CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleStatus } from '@prisma/client';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
  @Post('change-status')
  changeStatus(@Body() body: ChangeStatusDto) {
    return this.salesService.updateStatus(body.id, body.userId, body.status);
  }
  @Patch(':id/:idUser')
  confirmSaleOrder(
    @Param('id') id: number,
    @Param('id') idUser: number,
  ) {
    console.log(id, idUser);
    return this.salesService.confirmSale(+id, +idUser);
  }
}
