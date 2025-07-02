import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import  { MercadoPagoService } from './mercado-pago.service';

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
  shippingDetails:{references:string,betweenStreetOne:string,betweenStreetTwo:string}
}



@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create-preference')
  async createPreference(@Body() data: CreatePreferenceDto) {
    try {
      

      if (!data) {
        throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
      }

      if (!data.cart || !Array.isArray(data.cart)) {
        throw new HttpException(
          'Cart is required and must be an array',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data.total || typeof data.total !== 'number') {
        throw new HttpException(
          'Total is required and must be a number',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data.user || !data.user.id || !data.user.email || !data.user.name) {
        throw new HttpException(
          'User information is required (id, email, name)',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (data.cart.length === 0) {
        throw new HttpException('Cart cannot be empty', HttpStatus.BAD_REQUEST);
      }

      for (const item of data.cart) {
        if (!item.productId || !item.price || !item.quantity) {
          throw new HttpException(
            'Each cart item must have productId, price, and quantity',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

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
  async handleWebhook(@Body() webhookData: any) {
    try {
      console.log("object");
      const result = await this.mercadoPagoService.processWebhook(webhookData);
      return result;
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
}
