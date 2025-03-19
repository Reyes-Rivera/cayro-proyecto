"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Definición de la interfaz CartItem
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

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, variant: any, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // ✅ Usar `lazy initializer` para cargar desde `localStorage` solo una vez
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  // ✅ Guardar cambios en `localStorage` solo cuando `items` cambia
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, variant: any, quantity = 1) => {
    if (variant.stock <= 0) {
      console.error("Cannot add out-of-stock item to cart");
      return;
    }

    const cartItemId = `${product.id}-${variant.id}`;

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === cartItemId
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;

        updatedItems[existingItemIndex].quantity = Math.min(
          newQuantity,
          variant.stock
        );
        return updatedItems;
      } else {
        return [
          ...prevItems,
          {
            id: cartItemId,
            product,
            variant,
            quantity: Math.min(quantity, variant.stock),
          },
        ];
      }
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.variant.stock)),
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.variant.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
