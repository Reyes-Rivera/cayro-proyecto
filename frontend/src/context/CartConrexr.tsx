"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Update the CartItem interface to match the product detail page structure
export interface CartItem {
  id: string; // Unique ID for cart item (product ID + variant ID)
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
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Update the addItem function to handle the product detail page structure
  const addItem = (product: any, variant: any, quantity = 1) => {
    if (variant.stock <= 0) {
      console.error("Cannot add out-of-stock item to cart");
      return;
    }

    const cartItemId = `${product.id}-${variant.id}`;

    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === cartItemId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;

        // Ensure quantity doesn't exceed stock
        updatedItems[existingItemIndex].quantity = Math.min(
          newQuantity,
          variant.stock
        );
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
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

  // Remove item from cart
  const removeItem = (cartItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
  };

  // Update item quantity
  const updateQuantity = (cartItemId: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === cartItemId) {
          // Ensure quantity doesn't exceed stock and is at least 1
          const newQuantity = Math.max(
            1,
            Math.min(quantity, item.variant.stock)
          );
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculate total number of items
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
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
