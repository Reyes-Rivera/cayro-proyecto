import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsNumber, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

class ProductVariantDto {
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
