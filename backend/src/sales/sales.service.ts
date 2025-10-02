import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Sale, SaleStatus } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { createShippingNotificationEmail } from 'src/utils/email';
import { FilterSalesDto } from './dto/filter-dto';
import { SalesAnalysisResponseDto } from './dto/create-sale.dto';
@Injectable()
export class SalesService {
  constructor(private prismaService: PrismaService) {}
  async sendShippingNotification(emailData: any): Promise<{ message: string }> {
    try {
      const companyInfo = await this.prismaService.companyProfile.findFirst();
      if (!companyInfo) {
        throw new InternalServerErrorException(
          'Información de la compañía no disponible',
        );
      }

      const configInfo = await this.prismaService.configuration.findFirst();
      if (!configInfo) {
        throw new InternalServerErrorException(
          'Configuración del sistema no disponible',
        );
      }

      const currentYear = new Date().getFullYear();

      const html = createShippingNotificationEmail(
        emailData,
        companyInfo,
        configInfo,
        currentYear,
      );

      await this.sendEmail(emailData.customerEmail, html);

      return { message: 'Correo enviado correctamente' };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al enviar el correo',
      );
    }
  }

  async sendEmail(correo: string, html: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_COMPANY,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_COMPANY,
        to: correo,
        subject: 'Rastreo de pedido',
        html: html,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al enviar el correo electrónico',
      );
    }
  }
  async findAll(filters: FilterSalesDto): Promise<Sale[]> {
    const {
      startDate,
      endDate,
      employeeId,
      userId,
      productName,
      minTotal,
      maxTotal,
      reference,
      clientName,
      clientEmail,
      city,
      state,
      status = SaleStatus.DELIVERED,
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      status,
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      ...(employeeId && { employeeId: Number(employeeId) }),
      ...(userId && { userId: Number(userId) }),
      ...(minTotal !== undefined || maxTotal !== undefined
        ? {
            totalAmount: {
              ...(minTotal !== undefined && { gte: minTotal }),
              ...(maxTotal !== undefined && { lte: maxTotal }),
            },
          }
        : {}),
      ...(reference && { saleReference: { contains: reference } }),
      ...(clientName || clientEmail
        ? {
            user: {
              ...(clientName && { name: { contains: clientName } }),
              ...(clientEmail && { email: { contains: clientEmail } }),
            },
          }
        : {}),
      ...(city || state
        ? {
            address: {
              ...(city && { city: { contains: city } }),
              ...(state && { state: { contains: state } }),
            },
          }
        : {}),
    };

    // Búsqueda previa por producto usando filtrado manual
    if (productName) {
      const allProducts = await this.prismaService.product.findMany({
        select: { id: true, name: true },
      });

      const productIds = allProducts
        .filter((p) => p.name.toLowerCase().includes(productName.toLowerCase()))
        .map((p) => p.id);

      where.saleDetails = {
        some: {
          productVariant: {
            productId: { in: productIds.length > 0 ? productIds : [0] },
          },
        },
      };
    }

    try {
      const res = await this.prismaService.sale.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              surname: true,
              email: true,
              phone: true,
              userAddresses: {
                where: { isDefault: true },
                include: { address: true },
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
                  product: { select: { name: true } },
                  color: true,
                  size: { select: { name: true } },
                  images: true,
                },
              },
            },
          },
          address: true,
        },
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },
      });
      console.log(res);
      return res;
    } catch (error) {
      console.error(error);
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
          address: true,
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
                  images: true,
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
        where: {
          status: {
            notIn: [SaleStatus.DELIVERED, SaleStatus.CANCELLED],
          },
          isTaken: false,
        },
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
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserSaleReferences(userId: number): Promise<object[]> {
    const sales = await this.prismaService.sale.findMany({
      where: { userId },
      select: {
        references: true,
        betweenStreetOne: true,
        betweenStreetTwo: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    const references = sales.map((s) => {
      return {
        reference: s.references,
        betweenStreetOne: s.betweenStreetOne,
        betweenStreetTwo: s.betweenStreetTwo,
      };
    });
    return references;
  }
  async getSalesForAnalysis(
    page: number = 1,
    limit: number = 1000,
  ): Promise<SalesAnalysisResponseDto> {
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      this.prismaService.sale.findMany({
        skip,
        take: limit,
        where: {
          status: 'DELIVERED', // Solo ventas completadas
        },
        include: {
          saleDetails: {
            include: {
              productVariant: {
                include: {
                  product: {
                    include: {
                      category: true,
                      brand: true,
                    },
                  },
                  color: true,
                  size: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.sale.count({
        where: {
          status: 'DELIVERED',
        },
      }),
    ]);

    const data = sales.flatMap((sale) =>
      sale.saleDetails.map((detail) => ({
        id: sale.id,
        userId: sale.user.id,
        productName: detail.productVariant.product.name,
        category: detail.productVariant.product.category.name,
        brand: detail.productVariant.product.brand.name,
        price: detail.productVariant.price,
        color: detail.productVariant.color.name,
        size: detail.productVariant.size.name,
        quantity: detail.quantity,
        saleDate: sale.createdAt,
      })),
    );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
