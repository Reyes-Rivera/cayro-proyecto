"use client";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
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
  total: number;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Calculate derived values (no shipping in cart)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + (item.variant.price || 0) * item.quantity,
    0
  );
  const total = subtotal; // No shipping cost in cart

  // Load cart from localStorage on start
  useEffect(() => {
    const loadCartFromLocalStorage = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (err) {
        console.error("Failed to load cart from localStorage:", err);
        setError("Error al cargar el carrito");
      }
    };

    loadCartFromLocalStorage();
  }, []);

  // Sync with backend when user changes
  useEffect(() => {
    const syncWithBackend = async () => {
      if (user) {
        try {
          setLoading(true);
          // 1. Get cart from backend
          const backendCart = await CartApiService.getUserCart(Number(user.id));
          // 2. Get local cart
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

          if (backendCart && backendCart.items) {
            // 3. Combine carts (prioritizing backend)
            const backendItems = backendCart.items.map((item: any) => ({
              id: `db-${item.id}`,
              product: item.productVariant.product,
              variant: {
                ...item.productVariant,
                imageUrl: item.productVariant.imageUrl || "",
              },
              quantity: item.quantity,
            }));

            // Filter local items that are not in backend
            const mergedItems = [
              ...backendItems,
              ...localCart.filter(
                (localItem: CartItem) =>
                  !backendItems.some(
                    (backendItem: CartItem) =>
                      backendItem.id === `db-${localItem.id}` ||
                      backendItem.variant.id === localItem.variant.id
                  )
              ),
            ];

            setItems(mergedItems);
            // 4. Clear localStorage since it's now in backend
            localStorage.removeItem("cart");

            // 5. Update backend with any local items that didn't exist
            for (const localItem of localCart) {
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
            }
          } else if (localCart.length > 0) {
            // If no backend cart but local cart exists, create new one
            const newCart = await CartApiService.createCart(Number(user.id));
            for (const item of localCart) {
              await CartApiService.addItemToCart(
                newCart.id,
                item.variant.id,
                item.quantity
              );
            }
            localStorage.removeItem("cart");
          }
        } catch (err) {
          console.error("Sync error:", err);
          setError("Failed to sync cart with server");
          // Show error notification
          Swal.fire({
            title: "Error de sincronización",
            text: "No se pudo sincronizar tu carrito con el servidor",
            icon: "error",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#3B82F6",
          }).catch((swalError) => {
            console.error("Error showing sync error dialog:", swalError);
          });
        } finally {
          setLoading(false);
        }
      }
    };

    syncWithBackend().catch((error) => {
      console.error("Error in syncWithBackend effect:", error);
      setLoading(false);
    });
  }, [user]);

  // Save to localStorage when items change and no user
  useEffect(() => {
    if (!user && items.length > 0) {
      try {
        localStorage.setItem("cart", JSON.stringify(items));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [items, user]);

  const addItem = async (product: any, variant: any, quantity = 1) => {
    if (variant.stock <= 0) {
      setError("Cannot add out-of-stock item to cart");
      return Promise.reject(new Error("Cannot add out-of-stock item to cart"));
    }

    try {
      const cartItemId = `${product.id}-${variant.id}`;
      if (user) {
        // Authenticated user - work with backend
        setLoading(true);
        let cart = await CartApiService.getUserCart(Number(user.id));
        if (!cart) {
          cart = await CartApiService.createCart(Number(user.id));
        }
        await CartApiService.addItemToCart(cart.id, variant.id, quantity);
      }

      // Update local state
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
      return Promise.resolve();
    } catch (err) {
      console.error("Add item error:", err);
      setError("Failed to add item to cart");
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId: string) => {
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
      return Promise.resolve();
    } catch (err) {
      console.error("Remove item error:", err);
      setError("Failed to remove item from cart");
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setLoading(true);
      const item = items.find((item) => item.id === cartItemId);
      if (!item) return Promise.reject(new Error("Item not found"));

      if (user) {
        const [prefix, id] = cartItemId.split("-");
        if (prefix === "db") {
          await CartApiService.updateCartItem(Number(id), quantity);
        }
      }

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
      return Promise.resolve();
    } catch (err) {
      console.error("Update quantity error:", err);
      setError("Failed to update item quantity");
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      if (user) {
        const cart = await CartApiService.getUserCart(Number(user.id));
        if (cart) {
          await CartApiService.clearCart(cart.id);
        }
      }
      setItems([]);
      localStorage.removeItem("cart");
      // Show success notification
      Swal.fire({
        title: "Carrito vaciado",
        text: "Tu carrito ha sido vaciado correctamente",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      }).catch((error) => {
        console.error("Error showing clear cart success dialog:", error);
      });
      return Promise.resolve();
    } catch (err) {
      console.error("Clear cart error:", err);
      setError("Failed to clear cart");
      // Show error notification
      Swal.fire({
        title: "Error",
        text: "No se pudo vaciar el carrito. Inténtalo de nuevo.",
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      }).catch((swalError) => {
        console.error("Error showing clear cart error dialog:", swalError);
      });
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

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
        total,
        loading,
        error,
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
