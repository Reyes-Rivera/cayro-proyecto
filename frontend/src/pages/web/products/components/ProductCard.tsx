"use client";
import type React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types/products";
import { useCart } from "@/context/CartContext";
import { AlertHelper } from "@/utils/alert.util";

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
  viewMode = "grid",
}: ProductCardProps) {
  const { addItem, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

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

  const lowestPriceVariant =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((prev, current) =>
          prev.price < current.price ? prev : current
        )
      : null;

  const uniqueColors = getUniqueColors(product);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!lowestPriceVariant || lowestPriceVariant.stock <= 0) return;

    setIsAdding(true);
    try {
      await addItem(product, lowestPriceVariant, 1);
      AlertHelper.success({
        title: "¡Producto añadido!",
        message: `${product.name} ha sido añadido a tu carrito`,
        animation: "slideIn",
        timer: 2000,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "No se pudo añadir el producto al carrito. Inténtalo de nuevo.";
      AlertHelper.error({
        title: "Error",
        message: errorMessage,
        animation: "slideIn",
        timer: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const isLoading = loading || isAdding;

  if (viewMode === "list") {
    return (
      <div
        className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-600 transition-colors"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <NavLink
          to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
          className="block"
        >
          <div className="flex p-4 gap-4">
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              <img
                src={
                  lowestPriceVariant?.images.find(
                    (img) => img.angle === "front"
                  )?.url || "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {product.category?.name || "Sin categoría"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    $
                    {lowestPriceVariant
                      ? lowestPriceVariant.price.toFixed(2)
                      : "N/A"}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={
                        !lowestPriceVariant ||
                        lowestPriceVariant.stock <= 0 ||
                        isLoading
                      }
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "..." : "Añadir"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-600 hover:shadow-lg transition-all duration-300"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <NavLink
        to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
        className="block"
      >
        <div className="relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700 aspect-square">
          <img
            src={
              lowestPriceVariant?.images.find((img) => img.angle === "front")
                ?.url || "/placeholder.svg"
            }
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Add to Cart Button */}
          <div
            className={`absolute bottom-3 right-3 transition-opacity ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={
                !lowestPriceVariant ||
                lowestPriceVariant.stock <= 0 ||
                isLoading
              }
              className=" w-8 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Stock Warning */}
          {lowestPriceVariant &&
            lowestPriceVariant.stock > 0 &&
            lowestPriceVariant.stock <= 5 && (
              <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-xs font-medium">
                ¡Solo quedan {lowestPriceVariant.stock}!
              </div>
            )}
        </div>

        <div className="p-4">
          {/* Category */}
          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full mb-2">
            {product.category?.name || "Sin categoría"}
          </span>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            ${lowestPriceVariant ? lowestPriceVariant.price.toFixed(2) : "N/A"}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Colores:
            </span>
            <div className="flex gap-1">
              {uniqueColors.slice(0, 4).map((color) => (
                <div
                  key={color.id}
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color.hexValue }}
                  title={color.name}
                />
              ))}
              {uniqueColors.length > 4 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  +{uniqueColors.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </NavLink>
    </motion.div>
  );
}
