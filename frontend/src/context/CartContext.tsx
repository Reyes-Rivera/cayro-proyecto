"use client";
import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { CartApiService, type CartItem } from "../api/cart-api";
import { useAuth } from "./AuthContextType";
import Swal from "sweetalert2";

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, variant: any, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper functions for localStorage with error handling
const getStoredCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (err) {
    console.error("Failed to load cart from localStorage:", err);
    return [];
  }
};

const setStoredCart = (items: CartItem[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save cart to localStorage:", err);
  }
};

const removeStoredCart = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("cart");
  } catch (err) {
    console.error("Failed to remove cart from localStorage:", err);
  }
};

// Memoized shipping cost calculation
const calculateShippingCost = (items: CartItem[]): number => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems === 0) return 0;
  if (totalItems <= 5) return 200;
  if (totalItems <= 10) return 250;
  if (totalItems <= 15) return 300;
  if (totalItems <= 20) return 350;
  if (totalItems <= 25) return 400;
  const extraGroups = Math.ceil((totalItems - 25) / 5);
  return 400 + extraGroups * 50;
};

// Optimized SweetAlert configuration
const showToast = (
  title: string,
  icon: "success" | "error" | "warning",
  timer = 3000
) => {
  return Swal.fire({
    title,
    icon,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
    position: "top-end",
    toast: true,
    background: "var(--swal-background, #fff)",
    color: "var(--swal-color, #000)",
  }).catch((error) => {
    console.error("Error showing toast:", error);
  });
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Memoized calculations to prevent unnecessary recalculations
  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + (item.variant.price || 0) * item.quantity,
        0
      ),
    [items]
  );

  const shippingCost = useMemo(() => calculateShippingCost(items), [items]);

  const total = useMemo(
    () => subtotal + shippingCost,
    [subtotal, shippingCost]
  );

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getStoredCart();
    if (savedCart.length > 0) {
      setItems(savedCart);
    }
  }, []);

  // Optimized cart synchronization with backend
  const syncWithBackend = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const backendCart = await CartApiService.getUserCart(Number(user.id));
      const localCart = getStoredCart();

      if (backendCart?.items) {
        const backendItems = backendCart.items.map((item: any) => ({
          id: `db-${item.id}`,
          product: item.productVariant.product,
          variant: {
            ...item.productVariant,
            imageUrl: item.productVariant.imageUrl || "",
          },
          quantity: item.quantity,
        }));

        // Merge carts - backend items take precedence
        const mergedItems = [
          ...backendItems,
          ...localCart.filter(
            (localItem: CartItem) =>
              !backendItems.some(
                (backendItem: CartItem) =>
                  backendItem.variant.id === localItem.variant.id
              )
          ),
        ];

        setItems(mergedItems);
        removeStoredCart();

        // Add local items to backend that don't exist there
        const addLocalItemsPromises = localCart.map(async (localItem) => {
          const existsInBackend = backendItems.some(
            (backendItem: CartItem) =>
              backendItem.variant.id === localItem.variant.id
          );
          if (!existsInBackend) {
            await CartApiService.addItemToCart(
              backendCart.id,
              localItem.variant.id,
              localItem.quantity
            );
          }
        });

        await Promise.allSettled(addLocalItemsPromises);
      } else if (localCart.length > 0) {
        // Create new cart and add all local items
        const newCart = await CartApiService.createCart(Number(user.id));
        const addItemsPromises = localCart.map((item) =>
          CartApiService.addItemToCart(
            newCart.id,
            item.variant.id,
            item.quantity
          )
        );

        await Promise.allSettled(addItemsPromises);
        removeStoredCart();
      }
    } catch (err) {
      console.error("Sync error:", err);
      setError("Failed to sync cart with server");
      showToast("No se pudo sincronizar tu carrito con el servidor", "error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Sync cart when user changes
  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // Save cart to localStorage when items change and user is not logged in
  useEffect(() => {
    if (!user && items.length > 0) {
      setStoredCart(items);
    }
  }, [items, user]);

  // Memoized cart operations
  const addItem = useCallback(
    async (product: any, variant: any, quantity = 1) => {
      if (variant.stock <= 0) {
        const errorMsg = "No se puede agregar un producto sin stock al carrito";
        setError(errorMsg);
        showToast(errorMsg, "error");
        return Promise.reject(new Error(errorMsg));
      }

      try {
        const cartItemId = `${product.id}-${variant.id}`;

        if (user) {
          setLoading(true);
          let cart = await CartApiService.getUserCart(Number(user.id));
          if (!cart) {
            cart = await CartApiService.createCart(Number(user.id));
          }
          await CartApiService.addItemToCart(cart.id, variant.id, quantity);
        }

        setItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (item) => item.id === cartItemId
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...prevItems];
            const newQuantity =
              updatedItems[existingItemIndex].quantity + quantity;
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

        showToast("Producto agregado al carrito", "success", 2000);
        return Promise.resolve();
      } catch (err) {
        console.error("Add item error:", err);
        const errorMsg = "Error al agregar producto al carrito";
        setError(errorMsg);
        showToast(errorMsg, "error");
        return Promise.reject(err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      try {
        setLoading(true);

        if (user) {
          const [prefix, id] = cartItemId.split("-");
          if (prefix === "db") {
            await CartApiService.removeItemFromCart(Number(id));
          }
        }

        setItems((prevItems) =>
          prevItems.filter((item) => item.id !== cartItemId)
        );

        showToast("Producto eliminado del carrito", "success", 2000);
        return Promise.resolve();
      } catch (err) {
        console.error("Remove item error:", err);
        const errorMsg = "Error al eliminar producto del carrito";
        setError(errorMsg);
        showToast(errorMsg, "error");
        return Promise.reject(err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      try {
        setLoading(true);
        const item = items.find((item) => item.id === cartItemId);
        if (!item) {
          return Promise.reject(
            new Error("Producto no encontrado en el carrito")
          );
        }

        if (quantity <= 0) {
          return removeItem(cartItemId);
        }

        const finalQuantity = Math.max(
          1,
          Math.min(quantity, item.variant.stock)
        );

        if (user) {
          const [prefix, id] = cartItemId.split("-");
          if (prefix === "db") {
            await CartApiService.updateCartItem(Number(id), finalQuantity);
          }
        }

        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === cartItemId ? { ...item, quantity: finalQuantity } : item
          )
        );

        return Promise.resolve();
      } catch (err) {
        console.error("Update quantity error:", err);
        const errorMsg = "Error al actualizar la cantidad";
        setError(errorMsg);
        showToast(errorMsg, "error");
        return Promise.reject(err);
      } finally {
        setLoading(false);
      }
    },
    [items, user, removeItem]
  );

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);

      if (user) {
        const cart = await CartApiService.getUserCart(Number(user.id));
        if (cart) {
          await CartApiService.clearCart(cart.id);
        }
      }

      setItems([]);
      removeStoredCart();

      showToast("Carrito vaciado correctamente", "success", 2000);
      return Promise.resolve();
    } catch (err) {
      console.error("Clear cart error:", err);
      const errorMsg = "Error al vaciar el carrito";
      setError(errorMsg);
      showToast(errorMsg, "error");
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    (): CartContextType => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      shippingCost,
      total,
      loading,
      error,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      shippingCost,
      total,
      loading,
      error,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
