import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Sale, SaleStatus } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private prismaService: PrismaService) {}

  findAll(): Promise<Sale[]> {
    try {
      return this.prismaService.sale.findMany({
        include: {
          user: {
            select: {
              name: true,
              surname: true,
              email: true,
              phone: true,
              userAddresses: {
                where: { isDefault: true },
                include: {
                  address: true,
                },
              },
            },
          },
          saleDetails: {
            select: {
              quantity: true,
              unitPrice: true,
              totalPrice: true,
              productVariant: {
                select: {
                  barcode: true,
                  price: true,
                  product: {
                    select: {
                      name: true,
                    },
                  },
                  color: {
                    select: {
                      name: true,
                    },
                  },
                  size: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Error interno en el servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: number): Promise<Sale> {
    return this.prismaService.sale.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            surname: true,
            email: true,
            phone: true,
            userAddresses: {
              where: { isDefault: true },
              include: {
                address: true,
              },
            },
          },
        },
        saleDetails: {
          select: {
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            productVariant: {
              select: {
                barcode: true,
                price: true,
                product: {
                  select: {
                    name: true,
                  },
                },
                color: {
                  select: {
                    name: true,
                  },
                },
                size: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async confirmSale(id: number, userId: number) {
    try {
      const sale = await this.prismaService.sale.update({
        where: { id },
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
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al confirmar la venta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStatus(id: number, userId: number, state: SaleStatus) {
    try {
      const sale = await this.prismaService.sale.update({
        where: { id, userId },
        data: {
          status: state,
        },
      });
      if (!sale) {
        throw new NotFoundException(
          'La venta seleccionada no se encuentra registrada.',
        );
      }
      return {
        message: 'Estado de la venta confirmado con éxito',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al confirmar la venta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserPurchases(userId: number) {
    try {
      return this.prismaService.sale.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              surname: true,
              email: true,
              phone: true,
              userAddresses: {
                where: { isDefault: true },
                include: {
                  address: true,
                },
              },
            },
          },
          saleDetails: {
            select: {
              quantity: true,
              unitPrice: true,
              totalPrice: true,
              productVariant: {
                select: {
                  barcode: true,
                  price: true,
                  product: {
                    select: {
                      name: true,
                    },
                  },
                  color: {
                    select: {
                      name: true,
                    },
                  },
                  size: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrders() {
    try {
      return this.prismaService.sale.findMany({
        where: { status:{
          notIn: [SaleStatus.DELIVERED, SaleStatus.CANCELLED,],
        } },
        include: {
          user: {
            select: {
              name: true,
              surname: true,
              email: true,
              phone: true,
              userAddresses: {
                where: { isDefault: true },
                include: {
                  address: true,
                },
              },
            },
          },
          saleDetails: {
            select: {
              quantity: true,
              unitPrice: true,
              totalPrice: true,
              productVariant: {
                select: {
                  barcode: true,
                  price: true,
                  product: {
                    select: {
                      name: true,
                    },
                  },
                  color: {
                    select: {
                      name: true,
                    },
                  },
                  size: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
