import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { MercadoPagoService } from './mercado-pago.service';
const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '');

interface CreatePreferenceDto {
  cart: Array<{
    productId: number;
    variantId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
  shippingDetails: {
    references: string;
    betweenStreetOne: string;
    betweenStreetTwo: string;
  };
}

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create-preference')
  async createPreference(@Body() data: CreatePreferenceDto) {
    try {
      // Validaciones básicas
      if (!data)
        throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
      if (!data.cart || !Array.isArray(data.cart) || data.cart.length === 0) {
        throw new HttpException(
          'Cart is required and cannot be empty',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!data.total || typeof data.total !== 'number') {
        throw new HttpException(
          'Total is required and must be a number',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!data.user?.id || !data.user?.email || !data.user?.name) {
        throw new HttpException(
          'User information is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      for (const item of data.cart) {
        if (!item.productId || !item.price || !item.quantity) {
          throw new HttpException(
            'Each cart item must have productId, price, and quantity',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Llamar al servicio
      const preference = await this.mercadoPagoService.createPreference(data);

      return {
        success: true,
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
      };
    } catch (error) {
      console.error('Error in createPreference controller:', error);
      throw new HttpException(
        {
          message: error.message || 'Error creating preference',
          error: 'PREFERENCE_CREATION_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('webhook')
  async handleWebhook(@Res() res: Response, @Body() webhookData: any) {
    try {
      await this.mercadoPagoService.processWebhook(webhookData);
    } catch (error) {
      console.error('Error in webhook controller:', error);
      throw new HttpException(
        {
          message: error.message || 'Error processing webhook',
          error: 'WEBHOOK_PROCESSING_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return res.redirect(frontendUrl);
  }

  @Get('payment/:id')
  async getPaymentDetails(@Param('id') paymentId: string) {
    try {
      if (!paymentId) {
        throw new HttpException(
          'Payment ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const payment =
        await this.mercadoPagoService.getPaymentDetails(paymentId);
      return payment;
    } catch (error) {
      console.error('Error in getPaymentDetails controller:', error);
      throw new HttpException(
        {
          message: error.message || 'Error getting payment details',
          error: 'PAYMENT_DETAILS_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('config')
  getConfiguration() {
    try {
      const envInfo = this.mercadoPagoService.getEnvironmentInfo();
      const validation = this.mercadoPagoService.validateConfiguration();

      return {
        environment: envInfo,
        validation,
      };
    } catch (error) {
      console.error('Error in getConfiguration controller:', error);
      throw new HttpException(
        {
          message: error.message || 'Error getting configuration',
          error: 'CONFIGURATION_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('debug')
  debug(@Body() data: any) {
    return {
      received: data,
      type: typeof data,
      keys: Object.keys(data || {}),
      hasCart: !!data?.cart,
      cartType: typeof data?.cart,
      cartLength: Array.isArray(data?.cart) ? data.cart.length : 'not array',
    };
  }

  /**
   * ✅ ENDPOINTS DE RETORNO DE MERCADO PAGO
   */

  @Get('success')
  async success(@Query('payment_id') paymentId: string, @Res() res: Response) {
    try {
      const payment =
        await this.mercadoPagoService.getPaymentDetails(paymentId);
      console.log('✅ Pago aprobado. Estado:', payment.status);

      if (payment.status === 'approved') {
        return res.send(`
        <html>
          <head>
            <title>Pago Exitoso</title>
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>✅ ¡Pago aprobado!</h1>
            <p>Gracias por tu compra.</p>
            <p>Estado del pago: <strong>${payment.status}</strong></p>
            <a href="http://localhost:3001/pagarreparacion" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
              Regresar a la tienda
            </a>
          </body>
        </html>
      `);
      }

      // Si el pago no fue aprobado, muestra otro mensaje
      return res.send(`
      <h1>❌ El pago no fue aprobado</h1>
      <p>Estado del pago: <strong>${payment.status}</strong></p>
      <a href="http://localhost:3001/pagarreparacion">Volver a intentar</a>
    `);
    } catch (error) {
      console.error('Error en success:', error);
      return res.send(`
      <h1>❌ Error al verificar el pago</h1>
      <p>${error.message}</p>
      <a href="http://localhost:3001/pagarreparacion">Volver al inicio</a>
    `);
    }
  }

  @Get('failure')
  failure(@Res() res: Response) {
    return res.send(`
      <h1>❌ Pago fallido</h1>
      <p>Intenta nuevamente o usa otro método de pago.</p>
      <a href="http://localhost:5173">Volver al inicio</a>
    `);
  }

  @Get('pending')
  pending(@Res() res: Response) {
    return res.send(`
      <h1>⏳ Pago pendiente</h1>
      <p>Estamos esperando la confirmación del pago.</p>
      <a href="http://localhost:5173">Volver al inicio</a>
    `);
  }
}
