export interface Product {
    id: number
    name: string
    description: string
    active: boolean
    createdAt: string
    updatedAt: string
    brandId: number
    genderId: number
    neckTypeId: number | null // Puede ser null si no es una playera
    categoryId: number
    variants: ProductVariant[]
  }
  
  export interface ProductVariant {
    id: number
    productId: number
    colorId: number
    sizeId: number
    price: number
    stock: number
    barcode: string
  }
  
  export interface Brand {
    id: number
    name: string
  }
  
  export interface Gender {
    id: number
    name: string
  }
  
  export interface NeckType {
    id: number
    name: string
  }
  
  export interface Category {
    id: number
    name: string
  }
  
  export interface Color {
    id: number
    name: string
  }
  
  export interface Size {
    id: number
    name: string
  }
  
  export const sampleBrands: Brand[] = [
    { id: 1, name: "Nike" },
    { id: 2, name: "Adidas" },
    { id: 3, name: "Puma" },
    { id: 4, name: "Reebok" },
  ]
  
  export const sampleGenders: Gender[] = [
    { id: 1, name: "Hombre" },
    { id: 2, name: "Mujer" },
    { id: 3, name: "Unisex" },
  ]
  
  export const sampleNeckTypes: NeckType[] = [
    { id: 1, name: "Cuello redondo" },
    { id: 2, name: "Cuello V" },
    { id: 3, name: "Cuello polo" },
  ]
  
  export const sampleCategories: Category[] = [
    { id: 1, name: "Playeras" },
    { id: 2, name: "Pantalones" },
    { id: 3, name: "Zapatos" },
    { id: 4, name: "Accesorios" },
  ]
  
  export const sampleColors: Color[] = [
    { id: 1, name: "Rojo" },
    { id: 2, name: "Azul" },
    { id: 3, name: "Verde" },
    { id: 4, name: "Negro" },
    { id: 5, name: "Blanco" },
  ]
  
  export const sampleSizes: Size[] = [
    { id: 1, name: "XS" },
    { id: 2, name: "S" },
    { id: 3, name: "M" },
    { id: 4, name: "L" },
    { id: 5, name: "XL" },
  ]
  
  export const sampleProducts: Product[] = [
    {
      id: 1,
      name: "Camiseta Básica",
      description: "Camiseta de algodón de alta calidad",
      active: true,
      createdAt: "2023-05-01T00:00:00Z",
      updatedAt: "2023-05-01T00:00:00Z",
      brandId: 1,
      genderId: 1,
      neckTypeId: 1,
      categoryId: 1,
      variants: [
        {
          id: 1,
          productId: 1,
          colorId: 1,
          sizeId: 1,
          price: 19.99,
          stock: 100,
          barcode: "CB-001-S-BLK",
        },
        {
          id: 2,
          productId: 1,
          colorId: 2,
          sizeId: 2,
          price: 19.99,
          stock: 80,
          barcode: "CB-001-M-WHT",
        },
      ],
    },
    {
      id: 2,
      name: "Pantalón Vaquero",
      description: "Pantalón vaquero clásico",
      active: true,
      createdAt: "2023-05-02T00:00:00Z",
      updatedAt: "2023-05-02T00:00:00Z",
      brandId: 2,
      genderId: 2,
      neckTypeId: null,
      categoryId: 2,
      variants: [
        {
          id: 3,
          productId: 2,
          colorId: 3,
          sizeId: 3,
          price: 49.99,
          stock: 50,
          barcode: "PV-002-L-BLU",
        },
      ],
    },
  ]
  
  