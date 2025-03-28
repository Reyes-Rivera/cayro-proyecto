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
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Cargar carrito desde localStorage al iniciar
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

  // Sincronizar con el backend cuando el usuario cambia
  useEffect(() => {
    const syncWithBackend = async () => {
      if (user) {
        try {
          setLoading(true);
          // 1. Obtener carrito del backend
          const backendCart = await CartApiService.getUserCart(Number(user.id));

          // 2. Obtener carrito local
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

          if (backendCart && backendCart.items) {
            // 3. Combinar carritos (priorizando el backend)
            const backendItems = backendCart.items.map((item: any) => ({
              id: `db-${item.id}`,
              product: item.productVariant.product,
              variant: {
                ...item.productVariant,
                imageUrl: item.productVariant.imageUrl || "",
              },
              quantity: item.quantity,
            }));

            // Filtrar items locales que no están en el backend
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

            // 4. Vaciar localStorage ya que ahora está en el backend
            localStorage.removeItem("cart");

            // 5. Actualizar backend con cualquier item local que no existía
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
            // Si no hay carrito en el backend pero sí en local, crear uno nuevo
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
          setError("Failed to sync cart with server");
          console.error("Sync error:", err);

          // Show error notification
          Swal.fire({
            title: "Error de sincronización",
            text: "No se pudo sincronizar tu carrito con el servidor",
            icon: "error",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#3B82F6",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    syncWithBackend();
  }, [user]);

  // Guardar en localStorage cuando cambian los items y no hay usuario
  useEffect(() => {
    if (!user && items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, user]);

  const addItem = async (product: any, variant: any, quantity = 1) => {
    if (variant.stock <= 0) {
      setError("Cannot add out-of-stock item to cart");
      return;
    }

    try {
      const cartItemId = `${product.id}-${variant.id}`;

      if (user) {
        // Usuario autenticado - trabajar con backend
        setLoading(true);
        let cart = await CartApiService.getUserCart(Number(user.id));

        if (!cart) {
          cart = await CartApiService.createCart(Number(user.id));
        }

        await CartApiService.addItemToCart(cart.id, variant.id, quantity);
      }

      // Actualizar estado local
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
      setError("Failed to add item to cart");
      console.error("Add item error:", err);
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
      setError("Failed to remove item from cart");
      console.error("Remove item error:", err);
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
      setError("Failed to update item quantity");
      console.error("Update quantity error:", err);
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
      });

      return Promise.resolve();
    } catch (err) {
      setError("Failed to clear cart");
      console.error("Clear cart error:", err);

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
      });

      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
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
