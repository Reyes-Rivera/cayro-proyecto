import { Module } from '@nestjs/common';
import { MercadoPagoController } from './mercado-pago.controller';
import { MercadoPagoService } from './mercado-pago.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
