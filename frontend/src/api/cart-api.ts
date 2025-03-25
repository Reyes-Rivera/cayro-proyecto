import axios from "./axios";

export interface CartItem {
  id: string;
  product: {
    id: number;
    name: string;
    description?: string;
    brand: { id: number; name: string };
    category: { id: number; name: string };
    variants: any[];
    [key: string]: any;
  };
  variant: {
    id: number;
    productId: number;
    colorId: number;
    sizeId: number;
    price: number;
    stock: number;
    imageUrl: string;
    color: { id: number; name: string; hexValue: string };
    size: { id: number; name: string };
    [key: string]: any;
  };
  quantity: number;
}

export class CartApiService {
  static async createCart(userId: number) {
    try {
      const response = await axios.post(`/cart`, { userId });
      return response.data;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  static async getUserCart(userId: number) {
    try {
      const response = await axios.get(`/cart/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user cart:", error);
      throw error;
    }
  }

  static async addItemToCart(
    cartId: number,
    productVariantId: number,
    quantity: number
  ) {
    try {
      const response = await axios.post(`/cart/items`, {
        cartId,
        productVariantId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  }

  static async updateCartItem(cartItemId: number, quantity: number) {
    try {
      const response = await axios.patch(
        `/cart/items/${cartItemId}`,
        {
          quantity,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  }

  static async removeItemFromCart(cartItemId: number) {
    try {
      const response = await axios.delete(
        `/cart/items/${cartItemId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw error;
    }
  }

  static async clearCart(cartId: number) {
    try {
      const response = await axios.delete(`/cart/${cartId}/clear`);
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }
}
