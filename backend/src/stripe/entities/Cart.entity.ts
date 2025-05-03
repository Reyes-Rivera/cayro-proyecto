interface CartItem {
  name: string;
  description: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number; // en pesos
}
export type Cart = CartItem[];

