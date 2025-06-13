import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prismaService: PrismaService) {}
  create(createSaleDto: CreateSaleDto) {
    return 'This action adds a new sale';
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
  async confirmSale(id: number, userId: number) {
    try {
      const sale = await this.prismaService.sale.update({
        where: { id, userId },
        data: {
          status: 'DELIVERED',
        },
      });
      if (!sale) {
        throw new NotFoundException(
          'La venta seleccionada no se encuentra registrada.',
        );
      }
      return {
        message: 'Venta confirmada con éxito',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al confirmar la venta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
