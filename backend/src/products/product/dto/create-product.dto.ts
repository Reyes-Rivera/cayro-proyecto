import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsNumber, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductImageDto {
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  angle?: string = 'front'; // Valor por defecto
}

export class ProductVariantDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  colorId: number;

  @IsInt()
  sizeId: number;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;

  @IsString()
  barcode: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  // Mantener imageUrl como opcional para compatibilidad durante la transición
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean = true;

  @IsInt()
  brandId: number;

  @IsInt()
  genderId: number;

  @IsInt()
  sleeveId: number;

  @IsInt()
  categoryId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants: ProductVariantDto[];
}
