"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { AlertHelper } from "@/utils/alert.util";

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
      await addItem(product, variant, quantity);
      AlertHelper.success({
        message: "Producto agregado al carrito",
        title: "Producto agregado",
        timer: 5000,
        animation: "slideIn",
      });
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";

      AlertHelper.error({
        message: errorMessage,
        title: "Error al agregar al carrito",
        timer: 5000,
        animation: "slideIn",
      });
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
      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-full font-medium transition-all duration-200 ${
        variant.stock <= 0
          ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          : isAdded
          ? "bg-green-500 text-white"
          : buttonLoading
          ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
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
