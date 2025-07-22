import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  MercadoPagoConfig,
  Preference,
  Payment,
  PaymentRefund,
} from 'mercadopago';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private preference: Preference;
  private payment: Payment;
  private refund: PaymentRefund;

  constructor(private prismaService: PrismaService) {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) throw new Error('MERCADOPAGO_ACCESS_TOKEN is required');

    if (!process.env.FRONTEND_URL || !process.env.BACKEND_URL)
      throw new Error('FRONTEND_URL and BACKEND_URL must be configured');

    this.client = new MercadoPagoConfig({ accessToken });
    this.preference = new Preference(this.client);
    this.payment = new Payment(this.client);
    this.refund = new PaymentRefund(this.client);
  }
  async refundPayment(paymentId: string) {
    try {
      const refund = await this.refund.create({ payment_id: paymentId });
      return refund;
    } catch (error) {
      throw new HttpException(
        `Error al reembolsar: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private calculateShippingCost(cart: any[]): number {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems <= 5) return 200;
    if (totalItems <= 10) return 250;
    if (totalItems <= 15) return 300;
    if (totalItems <= 20) return 350;
    if (totalItems <= 25) return 400;
    const extraGroups = Math.ceil((totalItems - 25) / 5);
    return 400 + extraGroups * 50;
  }

  async createPreference(data: {
    cart: any[];
    total: number;
    user: { id: string; email: string; name: string };
    shippingDetails: {
      references: string;
      betweenStreetOne: string;
      betweenStreetTwo: string;
    };
  }) {
    try {
      const { cart, user, shippingDetails } = data;

      const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '');
      const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');

      if (!frontendUrl || frontendUrl === 'undefined') {
        throw new Error('FRONTEND_URL no está definido correctamente');
      }

      if (!backendUrl || backendUrl === 'undefined') {
        throw new Error('BACKEND_URL no está definido correctamente');
      }

      for (const item of cart) {
        const variant = await this.prismaService.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant) {
          throw new HttpException(
            `Variante con ID ${item.variantId} no encontrada`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // const availableStock = variant.stock - (variant.reserved || 0);

        // if (availableStock < item.quantity) {
        //   throw new HttpException(
        //     `Stock insuficiente para la variante ${variant.id}. Disponible: ${availableStock}, solicitado: ${item.quantity}`,
        //     HttpStatus.BAD_REQUEST,
        //   );
        // }
      }

      // await this.prismaService.$transaction(async (prisma) => {
      //   for (const item of cart) {
      //     await prisma.productVariant.update({
      //       where: { id: item.variantId },
      //       data: {
      //         reserved: { increment: item.quantity },
      //       },
      //     });
      //   }
      // });

      const items = [];
      for (const item of cart) {
        const variant = await this.prismaService.productVariant.findFirst({
          where: { id: item.variantId },
          include: { product: true },
        });

        items.push({
          id: variant.product.id.toString(),
          title: variant.product.name || `Producto ${variant.product.id}`,
          quantity: item.quantity,
          unit_price: Number(variant.price),
          currency_id: 'MXN',
        });
      }

      const shippingCost = this.calculateShippingCost(cart);

      const preferenceData = {
        items,
        payer: { email: user.email },
        back_urls: {
          success: 'https://fvxgnkp2-5173.usw3.devtunnels.ms/checkout/success',
          failure: 'https://fvxgnkp2-5173.usw3.devtunnels.ms/checkout/failure',
          pending: 'https://fvxgnkp2-5173.usw3.devtunnels.ms/checkout/pending',
        },

        auto_return: 'approved',
        notification_url: `${backendUrl}/mercadopago/webhook`,
        external_reference: `order_${user.id}_${Date.now()}`,
        shipments: { cost: shippingCost, mode: 'not_specified' },
        metadata: {
          shipping_details: JSON.stringify(shippingDetails),
          user_id: user.id,
          cart: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
      };


      const preference = await this.preference.create({ body: preferenceData });
      return preference;
    } catch (error) {
      console.error('Error creating MercadoPago preference:', error);

      let errorMessage = `Error creating payment preference: ${error.message}`;

      if (error.response?.data) {
        const apiError = error.response.data;
        if (apiError.message) {
          errorMessage = `MercadoPago API Error: ${apiError.message}`;
        }
        if (apiError.cause && Array.isArray(apiError.cause)) {
          const causes = apiError.cause
            .map((c) => c.description || c.message)
            .join(', ');
          errorMessage += ` - Causes: ${causes}`;
        }
      }

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ... resto de los métodos permanecen igual
  async getPaymentDetails(paymentId: string) {
    try {
      return await this.payment.get({ id: paymentId });
    } catch (error) {
      console.error('Error getting payment details:', error);
      throw error;
    }
  }

  async processWebhook(webhookData: any) {
    const type =
      webhookData.type ||
      webhookData.topic ||
      webhookData.action?.split('.')[0];
    if (type !== 'payment') return { status: 'ignored', type };

    const paymentId = webhookData.data?.id || webhookData.resource;
    if (!paymentId)
      throw new HttpException(
        'paymentId no encontrado',
        HttpStatus.BAD_REQUEST,
      );

    const payment = await this.getPaymentDetails(paymentId);
    const metadata = payment.metadata;

    if (['rejected', 'cancelled', 'expired'].includes(payment.status)) {
      const cartItems = metadata?.cart;

      if (Array.isArray(cartItems)) {
        for (const item of cartItems) {
          await this.prismaService.productVariant.update({
            where: { id: item.variantId },
            data: {
              reserved: { decrement: item.quantity },
            },
          });
        }
      }

      return {
        paymentId,
        status: payment.status,
        processed: false,
        released: true,
      };
    }

    if (payment.status !== 'approved')
      return { paymentId, status: payment.status, processed: false };

    const userId = Number(metadata.user_id);

    const userCart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: { items: { include: { productVariant: true } } },
    });

    const address = (
      await this.prismaService.userAddress.findFirst({
        where: { userId, isDefault: true },
        include: { address: true },
      })
    )?.address;

    const employee = await this.prismaService.employee.findFirst({
      where: { active: true },
      orderBy: { id: 'asc' },
    });

    if (!userCart || !userCart.items.length || !address || !employee)
      throw new Error('Faltan datos del usuario, carrito o dirección');

    const sale = await this.prismaService.$transaction(async (prisma) => {
      // Validar stock por si algo cambió
      for (const item of userCart.items) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.productVariant.id },
        });

        if (!variant || variant.stock < item.quantity) {
          await this.refundPayment(paymentId);
          throw new HttpException(
            `Stock insuficiente para ${variant?.id}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const saleRecord = await prisma.sale.create({
        data: {
          userId,
          addressId: address.id,
          employeeId: employee.id,
          subtotalAmount: new Prisma.Decimal(
            userCart.items.reduce(
              (sum, i) => sum + i.productVariant.price * i.quantity,
              0,
            ),
          ),
          shippingCost: new Prisma.Decimal(0),
          totalAmount: new Prisma.Decimal(
            userCart.items.reduce(
              (sum, i) => sum + i.productVariant.price * i.quantity,
              0,
            ),
          ),
          saleReference: payment.external_reference || `MP_${paymentId}`,
          saleDetails: {
            create: userCart.items.map((i) => ({
              productVariantId: i.productVariant.id,
              quantity: i.quantity,
              unitPrice: i.productVariant.price,
              totalPrice: i.productVariant.price * i.quantity,
            })),
          },
        },
      });

      for (const item of userCart.items) {
        await prisma.productVariant.update({
          where: { id: item.productVariant.id },
          data: {
            stock: { decrement: item.quantity },
            reserved: { decrement: item.quantity },
          },
        });
      }

      await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });

      return saleRecord;
    });

    return {
      paymentId,
      status: payment.status,
      saleId: sale.id,
      processed: true,
    };
  }

  getEnvironmentInfo() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const isProduction = accessToken?.startsWith('APP_USR-');
    const isTest = accessToken?.startsWith('TEST-');

    return {
      environment: process.env.NODE_ENV || 'development',
      credentialType: isProduction ? 'PRODUCTION' : isTest ? 'TEST' : 'UNKNOWN',
      isProduction,
      isTest,
      tokenPreview: accessToken?.substring(0, 15) + '...',
      frontendUrl: process.env.FRONTEND_URL,
      backendUrl: process.env.BACKEND_URL,
      recommendations: {
        forDevelopment: 'Usa credenciales TEST- para desarrollo',
        forProduction: 'Usa credenciales APP_USR- para producción',
        currentStatus: isTest
          ? 'Configuración correcta para desarrollo'
          : isProduction
            ? 'Credenciales de producción detectadas'
            : 'Credenciales no válidas',
      },
    };
  }

  validateConfiguration() {
    const issues = [];

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      issues.push('MERCADOPAGO_ACCESS_TOKEN no está configurado');
    }

    if (!process.env.FRONTEND_URL) {
      issues.push('FRONTEND_URL no está configurado');
    }

    if (!process.env.BACKEND_URL) {
      issues.push('BACKEND_URL no está configurado');
    }

    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl && !frontendUrl.startsWith('http')) {
      issues.push('FRONTEND_URL debe empezar con http:// o https://');
    }

    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl && !backendUrl.startsWith('http')) {
      issues.push('BACKEND_URL debe empezar con http:// o https://');
    }

    return {
      isValid: issues.length === 0,
      issues,
      config: {
        frontendUrl,
        backendUrl,
        hasAccessToken: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
      },
    };
  }
}
