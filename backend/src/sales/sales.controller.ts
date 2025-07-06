import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { ChangeStatusDto } from './dto/create-sale.dto';
import { createShippingNotificationEmail } from 'src/utils/email';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  findAll() {
    return this.salesService.findAll();
  }
  @Get('orders')
  getOrdes() {
    return this.salesService.getOrders();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      const res = this.salesService.findOne(+id);
      if (!res) throw new NotFoundException('No se encontró la venta.');
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('user-purchases/:id')
  getUserPurchases(@Param('id') id: string) {
    return this.salesService.getUserPurchases(+id);
  }

  @Patch('change-status')
  changeStatus(@Body() body: ChangeStatusDto) {
    return this.salesService.updateStatus(body.id, body.userId, body.status);
  }
  @Patch(':id/:idUser')
  confirmSaleOrder(@Param('id') id: number, @Param('idUser') idUser: number) {
    console.log(id, idUser);
    return this.salesService.confirmSale(+id, +idUser);
  }

 @Post('notify')
  async notifyCustomer(@Body() emailData: any) {
    console.log(emailData);
    return await this.salesService.sendShippingNotification(emailData);
  }
}
