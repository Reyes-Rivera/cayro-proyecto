import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppLogger } from 'src/utils/logger.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: AppLogger,
  ) {}
  async create(createCartDto: CreateCartDto) {
    try {
      const getCartFound = await this.prismaService.cart.findFirst({
        where: { id: createCartDto.userId },
      });
      if (getCartFound) {
        throw new Error('El carrito ya existe.');
      }
      return await this.prismaService.cart.create({
        data: {
          user: {
            connect: {
              id: createCartDto.userId,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error al crear el carrito: \nStack: ${error.stack}`);
      throw new HttpException(
        'Error al crear el carrito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async remove(id: number) {
    try {
      await this.prismaService.cartItem.deleteMany({
        where: { cartId: id },
      });
      return await this.prismaService.cart.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        `Error al eliminar el carrito: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error al eliminar el carrito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
