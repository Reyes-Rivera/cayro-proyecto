export interface Product {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
  brandId: number
  genderId: number
  sleeveId: number
  categoryId: number
  brand: Brand
  gender: Gender
  sleeve: Sleeve
  category: Category
  variants: ProductVariant[]
}

export interface Image {
  id: number
  url:string
  angle:string        // Puede ser "front", "side", "back", etc.
  
}
export interface ProductVariant {
  id: number
  productId: number
  colorId: number
  sizeId: number
  price: number
  stock: number
  barcode: string
  images: Image[]
  color: Color
  size: Size
}

export interface Color {
  id: number
  name: string
  hexValue: string
}

export interface Size {
  id: number
  name: string
}

export interface Brand {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
}

export interface Gender {
  id: number
  name: string
}

export interface Sleeve {
  id: number
  name?: string
}

