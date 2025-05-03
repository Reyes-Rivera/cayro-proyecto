import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Cart } from './entities/Cart.entity';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { cart: Cart }) {
    try {
      return await this.stripeService.createPaymentIntent(body.cart);
    } catch (error) {
      console.error('❌ Error creando PaymentIntent', error);
      return { error: 'Error creando PaymentIntent' };
    }
  }
}
