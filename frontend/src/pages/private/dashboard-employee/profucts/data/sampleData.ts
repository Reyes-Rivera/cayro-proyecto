export interface Product {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  brandId: number;
  genderId: number;
  sleeveId: number | null; 
  categoryId: number;
  variants: ProductVariant[];
}
export interface Images {
  id: number;
  productVariantId: number;
  url: string;
}
export interface ProductVariant {
  images: Images[];
  id: number;
  productId: number;
  colorId: number;
  sizeId: number;
  price: number;
  stock: number;
  barcode: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Gender {
  id: number;
  name: string;
}

export interface NeckType {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
  hexValue: string;
}

export interface Size {
  id: number;
  name: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  active: boolean;
  brandId: number;
  genderId: number;
  sleeveId: number; 
  categoryId: number;
  variants: ProductVariantDto[];
}

export interface ProductVariantDto {
  colorId: number;
  sizeId: number;
  price: number;
  stock: number;
  barcode: string;
  imageUrl?: string;
}

