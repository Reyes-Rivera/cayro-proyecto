"use client";

import { useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useCart, type CartItem } from "@/context/CartConrexr";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: CartItem;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    // Small delay to allow animation to complete
    setTimeout(() => {
      removeItem(item.id);
    }, 300);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= item.variant.stock) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 1, y: 0 }}
      animate={{
        opacity: isRemoving ? 0 : 1,
        y: isRemoving ? 20 : 0,
        height: isRemoving ? 0 : "auto",
      }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <Link
        to={`/producto/${item.product.id}`}
        className="w-full sm:w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 hover:opacity-90 transition-opacity"
      >
        <img
          src={item.variant.imageUrl || "/placeholder.svg?height=96&width=96"}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <Link
              to={`/producto/${item.product.id}`}
              className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.product.name}
            </Link>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
              <span className="inline-flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-1"
                  style={{
                    backgroundColor: item.variant.color.hexValue || "#6B7280",
                  }}
                ></span>
                {item.variant.color.name}
              </span>
              <span className="inline-flex items-center">
                <span className="text-gray-400 mx-1">•</span>
                Talla: {item.variant.size.name}
              </span>
            </div>
          </div>

          <div className="mt-2 sm:mt-0 text-right">
            <p className="font-medium text-gray-900 dark:text-white">
              ${item.variant.price.toFixed(2)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ${item.variant.price.toFixed(2)} x {item.quantity}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="mx-3 w-8 text-center text-gray-900 dark:text-white">
              {item.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.variant.stock}
              className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>

            {item.quantity >= item.variant.stock && (
              <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                Máx. disponible
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemove}
            className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
