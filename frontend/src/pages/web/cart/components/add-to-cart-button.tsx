"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartConrexr";
import Swal from "sweetalert2";

interface AddToCartButtonProps {
  product: any;
  variant: any;
  quantity?: number;
  className?: string;
  fullWidth?: boolean;
  showIcon?: boolean;
}

export default function AddToCartButton({
  product,
  variant,
  quantity = 1,
  className = "",
  fullWidth = false,
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem, loading } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (variant.stock <= 0) return;

    setIsLoading(true);

    try {
      // Call the addItem function from the cart context
      await addItem(product, variant, quantity);

      // Show success notification
      Swal.fire({
        title: "¡Producto añadido!",
        text: `${product.name} ha sido añadido a tu carrito`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
        iconColor: "#3B82F6",
        customClass: {
          popup: "colored-toast",
          title: "swal-title",
          htmlContainer: "swal-text",
        },
      });

      setIsAdded(true);

      // Reset the added state after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      // Show error notification
      Swal.fire({
        title: "Error",
        text: "No se pudo añadir el producto al carrito. Inténtalo de nuevo.",
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
        iconColor: "#EF4444",
        customClass: {
          popup: "colored-toast",
          title: "swal-title",
          htmlContainer: "swal-text",
        },
      });

      console.error("Error adding item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use either the local loading state or the global loading state from the cart context
  const buttonLoading = isLoading || loading;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAddToCart}
      disabled={variant.stock <= 0 || isAdded || buttonLoading}
      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
        variant.stock <= 0
          ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          : isAdded
          ? "bg-green-600 text-white"
          : buttonLoading
          ? "bg-blue-500 text-white"
          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md"
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {variant.stock <= 0 ? (
        "Sin stock"
      ) : buttonLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Añadiendo...
        </>
      ) : isAdded ? (
        <>
          <Check className="w-5 h-5" />
          Añadido
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="w-5 h-5" />}
          Añadir al carrito
        </>
      )}
    </motion.button>
  );
}
