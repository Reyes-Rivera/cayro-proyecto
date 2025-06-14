"use client";

import type React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/types/products";
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

  const isLoading = loading || isAdding;

  if (viewMode === "list") {
    return (
      <div
        className="group bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 mx-2 md:mx-0"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <NavLink
          to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
          className="block"
        >
          <div className="flex p-4 md:p-6 gap-4 md:gap-6">
            {/* Image */}
            <div className="relative w-20 h-20 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <img
                src={
                  lowestPriceVariant?.images.find(
                    (img) => img.angle === "front"
                  )?.url 
                }
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
                    {product.category?.name || "Sin categoría"}
                  </span>
                  {product.gender && (
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
                      {product.gender.name}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {product.name}
                </h3>

                {/* Colors */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Colores:
                  </span>
                  <div className="flex gap-1">
                    {uniqueColors.slice(0, 4).map((color) => (
                      <div
                        key={color.id}
                        className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color.hexValue }}
                        title={color.name}
                      />
                    ))}
                    {uniqueColors.length > 4 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{uniqueColors.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg md:text-xl text-gray-900 dark:text-white">
                  $
                  {lowestPriceVariant
                    ? lowestPriceVariant.price.toFixed(2)
                    : "N/A"}
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      !lowestPriceVariant ||
                      lowestPriceVariant.stock <= 0 ||
                      isLoading
                    }
                    className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                    <span className="text-xs md:text-sm font-medium hidden sm:inline">
                      Añadir
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      </div>
    );
  }

  return (
    <div
      className="group relative bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <NavLink
        to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
        className="block"
      >
        {/* Product Image Container */}
        <div className="relative h-48 sm:h-56 md:h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <img
            src={
              lowestPriceVariant?.images.find((img) => img.angle === "front")
                ?.url 
            }
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Action buttons - Only show on desktop hover or mobile touch */}
          <div
            className={`absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-1.5 md:gap-2 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0 md:opacity-0"
            } sm:opacity-100 md:opacity-0`}
          >
            <button className="p-2 md:p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg backdrop-blur-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Eye className="h-3 w-3 md:h-4 md:w-4" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={
                !lowestPriceVariant ||
                lowestPriceVariant.stock <= 0 ||
                isLoading
              }
              className="p-2 md:p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg backdrop-blur-sm hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag className="h-3 w-3 md:h-4 md:w-4" />
              )}
            </button>
          </div>

          {/* Stock warning */}
          {lowestPriceVariant &&
            lowestPriceVariant.stock > 0 &&
            lowestPriceVariant.stock <= 5 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-1.5 md:py-2 text-xs md:text-sm font-medium">
                ¡Solo quedan {lowestPriceVariant.stock} unidades!
              </div>
            )}
        </div>

        {/* Product Information */}
        <div className="p-3 md:p-6">
          {/* Category and Gender Tags */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 md:px-3 py-1 rounded-full">
              {product.category?.name || "Sin categoría"}
            </span>
            {product.gender && (
              <span className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium px-2 md:px-3 py-1 rounded-full">
                {product.gender.name}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-gray-900 dark:text-white font-semibold mb-2 md:mb-3 line-clamp-2 min-h-[32px] md:min-h-[48px] text-sm md:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="font-bold text-lg md:text-2xl mb-3 md:mb-4 text-gray-900 dark:text-white">
            ${lowestPriceVariant ? lowestPriceVariant.price.toFixed(2) : "N/A"}
          </div>

          {/* Color Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                Colores:
              </span>
              <div className="flex gap-1">
                {uniqueColors.slice(0, 3).map((color) => (
                  <div
                    key={color.id}
                    className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 dark:ring-gray-700"
                    style={{ backgroundColor: color.hexValue }}
                    title={color.name}
                  />
                ))}
                {uniqueColors.length > 3 && (
                  <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white shadow-md flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      +{uniqueColors.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </NavLink>
    </div>
  );
}
