"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import type { Product } from "../../../../types/products";
import { useCart } from "@/context/CartContext";
import Swal from "sweetalert2";

interface ProductCardProps {
  product: Product;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  isHovered,
  onHover,
  onLeave,
}: ProductCardProps) {
  const { addItem, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Get unique colors for a product
  const getUniqueColors = (product: Product) => {
    const uniqueColors: Record<
      number,
      { id: number; name: string; hexValue: string }
    > = {};

    if (product.variants) {
      product.variants.forEach((variant) => {
        if (variant.color && !uniqueColors[variant.color.id]) {
          uniqueColors[variant.color.id] = {
            id: variant.color.id,
            name: variant.color.name,
            hexValue: variant.color.hexValue || "#6B7280",
          };
        }
      });
    }

    return Object.values(uniqueColors);
  };

  // Make sure product has variants before trying to access them
  const lowestPriceVariant =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((prev, current) =>
          prev.price < current.price ? prev : current
        )
      : null;

  const uniqueColors = getUniqueColors(product);

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!lowestPriceVariant || lowestPriceVariant.stock <= 0) return;

    setIsAdding(true);

    try {
      await addItem(product, lowestPriceVariant, 1);

      Swal.fire({
        title: "¡Producto añadido!",
        text: `${product.name} ha sido añadido a tu carrito`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
        iconColor: "#2563EB",
        customClass: {
          popup: "colored-toast",
          title: "swal-title",
          htmlContainer: "swal-text",
        },
      });
    } catch (error) {
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
      setIsAdding(false);
    }
  };

  // Determine if any loading state is active
  const isLoading = loading || isAdding;

  return (
    <motion.div
      className="group bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
        className="block"
      >
        {/* Product Image Container - Altura fija */}
        <div className="relative h-80 overflow-hidden bg-white">
          <img
            src={
              lowestPriceVariant?.images.find((img) => img.angle === "front")
                ?.url || "/placeholder.svg"
            }
            alt={product.name}
            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
          />

          {/* Add to Cart Button - Top Right Corner on Hover */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-colors z-10"
            onClick={handleAddToCart}
            disabled={
              !lowestPriceVariant || lowestPriceVariant.stock <= 0 || isLoading
            }
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <ShoppingBag className="h-5 w-5" />
            )}
          </motion.button>

          {/* Low Stock Warning */}
          {lowestPriceVariant &&
            lowestPriceVariant.stock > 0 &&
            lowestPriceVariant.stock <= 5 && (
              <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm">
                ¡Solo quedan {lowestPriceVariant.stock} unidades!
              </div>
            )}
        </div>

        {/* Product Information - Simplificado */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-gray-900 dark:text-white font-medium mb-2 line-clamp-2 min-h-[48px]">
            {product.name}
          </h3>

          {/* Category and Gender Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
              {product.category?.name || "Sin categoría"}
            </span>
            {product.gender && (
              <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                {product.gender.name}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="font-semibold text-lg mb-3">
            ${lowestPriceVariant ? lowestPriceVariant.price.toFixed(2) : "N/A"}
          </div>

          {/* Color Options */}
          <div className="mt-2">
            <div className="text-sm text-gray-500 mb-1">Colores:</div>
            <div className="flex gap-1">
              {uniqueColors.map((color) => (
                <div
                  key={color.id}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hexValue }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
