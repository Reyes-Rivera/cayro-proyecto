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
}
