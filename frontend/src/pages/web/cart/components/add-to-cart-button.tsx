"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartConrexr";

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
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = () => {
    if (variant.stock <= 0) return;

    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      addItem(product, variant, quantity);
      setIsLoading(false);
      setIsAdded(true);

      // Reset the added state after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 300);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAddToCart}
      disabled={variant.stock <= 0 || isAdded || isLoading}
      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
        variant.stock <= 0
          ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          : isAdded
          ? "bg-green-600 text-white"
          : isLoading
          ? "bg-blue-500 text-white"
          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md"
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {variant.stock <= 0 ? (
        "Sin stock"
      ) : isLoading ? (
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
