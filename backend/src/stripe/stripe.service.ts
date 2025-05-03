import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Cart } from './entities/Cart.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil',
    });
  }

  async createPaymentIntent(cart: Cart) {
    const amount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const amountInCents = Math.round(amount * 100);

    // Para registrar los productos vendidos en metadata
    const metadata: Record<string, string> = {};
    cart.forEach((item, index) => {
      metadata[`item_${index}_productId`] = item.productId;
      metadata[`item_${index}_variantId`] = item.variantId;
      metadata[`item_${index}_name`] = item.name;
      metadata[`item_${index}_quantity`] = String(item.quantity);
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'mxn',
      payment_method_types: ['card'],
      metadata,
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}
