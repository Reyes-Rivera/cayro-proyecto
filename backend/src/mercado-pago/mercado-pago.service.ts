import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private preference: Preference;
  private payment: Payment;

  constructor(private prismaService: PrismaService) {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN is required');
    }

    if (!process.env.FRONTEND_URL || !process.env.BACKEND_URL) {
      throw new Error('FRONTEND_URL and BACKEND_URL must be configured');
    }

    this.client = new MercadoPagoConfig({
      accessToken: accessToken,
      options: {
        timeout: 5000,
        idempotencyKey: 'abc',
      },
    });

    this.preference = new Preference(this.client);
    this.payment = new Payment(this.client);
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

      const items = [];

      for (const item of cart) {
        const variant = await this.prismaService.productVariant.findFirst({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) {
          throw new HttpException(
            `Variante no encontrada: ${item.variantId}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        items.push({
          id: variant.product.id.toString(),
          title: variant.product.name || `Producto ${variant.product.id}`,
          quantity: item.quantity,
          unit_price: Number(variant.price),
          currency_id: 'MXN',
          description: `Producto ID: ${variant.product.id}, Variante ID: ${variant.id}`,
        });
      }

      const shippingCost = this.calculateShippingCost(cart);

      const preferenceData = {
        items,
        payer: {
          email: 'testuser1361034783@gmail.com',
        },
        back_urls: {
          success: `${frontendUrl}/checkout/success`,
          failure: `${frontendUrl}/checkout/failure`,
          pending: `${frontendUrl}/checkout/pending`,
        },
        notification_url: `${backendUrl}/mercadopago/webhook`,
        statement_descriptor: 'TU_TIENDA',
        external_reference: `order_${user.id}_${Date.now()}`,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        ).toISOString(),
        payment_methods: {
          installments: 12,
          excluded_payment_methods: [],
          excluded_payment_types: [],
        },
        shipments: {
          cost: shippingCost,
          mode: 'not_specified',
        },
        binary_mode: false,
        metadata: {
          shippingDetails,
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

  async getPaymentDetails(paymentId: string) {
    try {
      return await this.payment.get({ id: paymentId });
    } catch (error) {
      console.error('Error getting payment details:', error);
      throw error;
    }
  }

  async processWebhook(webhookData: any) {
    try {
      console.log('Webhook recibido:', JSON.stringify(webhookData, null, 2));


      // Detectar el tipo de evento
      const type =
        webhookData.type ||
        webhookData.topic ||
        webhookData.action?.split('.')[0];

      if (!type || type !== 'payment') {
        console.log('Webhook type not handled:', type);
        return { status: 'ignored', type };
      }

      // Extraer el ID del pago
      const paymentId =
        webhookData.data?.id ||
        (typeof webhookData.resource === 'string' &&
        /^\d+$/.test(webhookData.resource)
          ? webhookData.resource
          : null);

      if (!paymentId) {
        console.warn('paymentId no encontrado en el webhook:', webhookData);
        throw new HttpException(
          'paymentId no encontrado en el webhook',
          HttpStatus.BAD_REQUEST,
        );
      }

      const payment = await this.getPaymentDetails(paymentId);

      if (payment.status !== 'approved') {
        return { paymentId, status: payment.status, processed: false };
      }

      const metadata = payment.metadata;
      if (!metadata?.user_id) {
        throw new Error('user_id no encontrado en metadata del pago');
      }

      const userId = Number(metadata.user_id);

      const userCart = await this.prismaService.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: true,
                  color: true,
                  size: true,
                },
              },
            },
          },
        },
      });

      if (!userCart || userCart.items.length === 0) {
        throw new Error('Carrito del usuario no encontrado o vacío');
      }

      const userAddress = await this.prismaService.userAddress.findFirst({
        where: { userId, isDefault: true },
        include: { address: true },
      });

      if (!userAddress || !userAddress.address) {
        throw new Error('No se encontró dirección por defecto del usuario');
      }

      const address = userAddress.address;

      const employee = await this.prismaService.employee.findFirst({
        where: { active: true },
        orderBy: { id: 'asc' },
      });

      if (!employee) {
        throw new Error('No hay empleados activos registrados');
      }

      let totalAmount = 0;
      const saleDetailsData = [];

      for (const cartItem of userCart.items) {
        const variant = cartItem.productVariant;
        const unitPrice = variant.price;
        const quantity = cartItem.quantity;
        const totalPrice = unitPrice * quantity;

        totalAmount += totalPrice;

        saleDetailsData.push({
          productVariantId: variant.id,
          quantity,
          unitPrice,
          totalPrice,
        });
      }

      const shippingCost = this.calculateShippingCost(userCart.items);

      const sale = await this.prismaService.$transaction(async (prisma) => {
        const newSale = await prisma.sale.create({
          data: {
            userId,
            addressId: address.id,
            employeeId: employee.id,
            subtotalAmount: new Prisma.Decimal(totalAmount),
            shippingCost: new Prisma.Decimal(shippingCost),
            totalAmount: new Prisma.Decimal(totalAmount + shippingCost),
            references: payment.external_reference || `MP_${paymentId}`,
            saleDetails: {
              create: saleDetailsData,
            },
          },
          include: {
            saleDetails: {
              include: {
                productVariant: {
                  include: {
                    product: true,
                    color: true,
                    size: true,
                  },
                },
              },
            },
            user: true,
            address: true,
            employee: true,
          },
        });

        await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });

        return newSale;
      });

      return {
        paymentId,
        status: payment.status,
        saleId: sale.id,
        totalAmount: sale.totalAmount,
        processed: true,
        message: 'Venta creada exitosamente',
      };
    } catch (error) {
      console.error('Error general en el webhook:', error);
      throw new HttpException(
        {
          message: 'Error al procesar el webhook de MercadoPago',
          error: error.message,
          paymentId: webhookData?.data?.id,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
          ? '✅ Configuración correcta para desarrollo'
          : isProduction
            ? '⚠️  Credenciales de producción detectadas'
            : '❌ Credenciales no válidas',
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
