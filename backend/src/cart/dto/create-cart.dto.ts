import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty({
    message: 'El usuario es requerido.',
  })
  @Min(1, {
    message: 'El usuario es requerido.',
  })
  userId: number;
}

export class CreateCartItemDto {
  @IsNumber()
  @IsNotEmpty({
    message: 'El id del carrito es requerido.',
  })
  @Min(1, {
    message: 'Ingresa un id valido.',
  })
  cartId: number;
  @IsNumber()
  @IsNotEmpty({
    message: 'El id del carrito es requerido.',
  })
  @Min(1, {
    message: 'Ingresa un id valido.',
  })
  productVariantId: number;
  @IsNumber()
  @IsNotEmpty({
    message: 'El id del carrito es requerido.',
  })
  @Min(1, {
    message: 'Ingresa un id valido.',
  })
  quantity: number;
}




