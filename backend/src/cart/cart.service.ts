import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { CreateCartDto, CreateCartItemDto } from './dto/create-cart.dto';
import type { UpdateCartItemDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCartDto: CreateCartDto) {
    try {
      const existingCart = await this.prismaService.cart.findFirst({
        where: { userId: createCartDto.userId },
      });
      if (existingCart) {
        return existingCart;
      }
      return await this.prismaService.cart.create({
        data: {
          user: {
            connect: {
              id: createCartDto.userId,
            },
          },
        },
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: {
                    include: {
                      brand: true,
                      category: true,
                    },
                  },
                  color: true,
                  size: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error creating cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserCart(userId: number) {
    try {
      return await this.prismaService.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: {
                    include: {
                      brand: true,
                      category: true,
                    },
                  },
                  color: true,
                  size: true,
                  images: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error finding user cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addItemToCart(createCartItemDto: CreateCartItemDto) {
    try {
      // Check if cart exists
      const cart = await this.prismaService.cart.findUnique({
        where: { id: createCartItemDto.cartId },
      });
      if (!cart) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }

      // Check if product variant exists and has stock
      const productVariant = await this.prismaService.productVariant.findUnique(
        {
          where: { id: createCartItemDto.productVariantId },
          include: {
            product: true,
            color: true,
            size: true,
            images: true,
          },
        },
      );

      if (!productVariant) {
        throw new HttpException(
          'Product variant not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Check if item already exists in cart
      const existingItem = await this.prismaService.cartItem.findFirst({
        where: {
          cartId: createCartItemDto.cartId,
          productVariantId: createCartItemDto.productVariantId,
        },
      });

      const requestedQuantity = createCartItemDto.quantity;
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const totalQuantity = currentQuantity + requestedQuantity;

      // Validate stock availability
      if (totalQuantity > productVariant.stock) {
        const availableToAdd = productVariant.stock - currentQuantity;
        if (availableToAdd <= 0) {
          throw new HttpException(
            'Ya tienes la cantidad máxima disponible de este producto en tu carrito',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          throw new HttpException(
            `Solo puedes agregar ${availableToAdd} unidades más. Stock disponible: ${productVariant.stock}, en carrito: ${currentQuantity}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (existingItem) {
        // Update quantity if item exists
        const updatedItem = await this.prismaService.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: totalQuantity,
          },
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    brand: true,
                    category: true,
                  },
                },
                color: true,
                size: true,
                images: true,
              },
            },
          },
        });
        return updatedItem;
      } else {
        // Create new cart item
        const newItem = await this.prismaService.cartItem.create({
          data: {
            cart: {
              connect: {
                id: createCartItemDto.cartId,
              },
            },
            productVariant: {
              connect: {
                id: createCartItemDto.productVariantId,
              },
            },
            quantity: requestedQuantity,
          },
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    brand: true,
                    category: true,
                  },
                },
                color: true,
                size: true,
                images: true,
              },
            },
          },
        });
        return newItem;
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
     
      throw new HttpException(
        'Error adding item to cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCartItem(
    cartItemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    try {
      // Check if cart item exists
      const cartItem = await this.prismaService.cartItem.findUnique({
        where: { id: cartItemId },
        include: { productVariant: true },
      });
      if (!cartItem) {
        throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
      }

      // Validate quantity against stock
      if (updateCartItemDto.quantity > cartItem.productVariant.stock) {
        throw new HttpException(
          `Cantidad solicitada excede el stock disponible. Stock: ${cartItem.productVariant.stock}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.prismaService.cartItem.update({
        where: { id: cartItemId },
        data: {
          quantity: updateCartItemDto.quantity,
        },
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  brand: true,
                  category: true,
                },
              },
              color: true,
              size: true,
              images: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error updating cart item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeItemFromCart(cartItemId: number) {
    try {
      // Check if cart item exists
      const cartItem = await this.prismaService.cartItem.findUnique({
        where: { id: cartItemId },
      });
      if (!cartItem) {
        throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
      }

      return await this.prismaService.cartItem.delete({
        where: { id: cartItemId },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
     
      throw new HttpException(
        'Error removing item from cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async clearCart(cartId: number) {
    try {
      // Check if cart exists
      const cart = await this.prismaService.cart.findUnique({
        where: { id: cartId },
      });
      if (!cart) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }

      // Delete all cart items
      await this.prismaService.cartItem.deleteMany({
        where: { cartId },
      });

      return { message: 'Cart cleared successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error clearing cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(cartId: number) {
    try {
      // Check if cart exists
      const cart = await this.prismaService.cart.findUnique({
        where: { id: cartId },
      });
      if (!cart) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }

      // Delete all cart items first
      await this.prismaService.cartItem.deleteMany({
        where: { cartId },
      });

      // Then delete the cart
      return await this.prismaService.cart.delete({
        where: { id: cartId },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error deleting cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
