import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Crear un nuevo carrito para un usuario
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  // Obtener el carrito de un usuario específico
  @Get('user/:userId')
  async findUserCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.findUserCart(userId);
  }

  // Añadir un ítem al carrito
  @Post('items')
  addItem(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.addItemToCart(createCartItemDto);
  }

  // Actualizar la cantidad de un ítem en el carrito
  @Patch('items/:itemId')
  updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(itemId, updateCartItemDto);
  }

  // Eliminar un ítem del carrito
  @Delete('items/:itemId')
  removeItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.cartService.removeItemFromCart(itemId);
  }

  // Vaciar todo el carrito
  @Delete(':cartId/clear')
  clearCart(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartService.clearCart(cartId);
  }

  // Eliminar el carrito (junto con todos sus ítems)
  @Delete(':cartId')
  remove(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartService.remove(cartId);
  }
}