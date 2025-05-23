"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Eye, Check, MoreHorizontal } from "lucide-react";
import type { Product } from "../../../../types/products";
import { useCart } from "@/context/CartConrexr";
import Swal from "sweetalert2";

interface ProductCardProps {
  product: Product;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  useCustomNotification?: boolean;
}

export default function ProductCard({
  product,
  isHovered,
  onHover,
  onLeave,
}: ProductCardProps) {
  const { addItem, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
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
            hexValue: variant.color.hexValue || "#6B7280", // Usar el hexValue del backend, o gris por defecto
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
  const hasMoreColors = uniqueColors.length > 3;
  const displayColors = showAllColors ? uniqueColors : uniqueColors.slice(0, 3);

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!lowestPriceVariant || lowestPriceVariant.stock <= 0) return;

    setIsAdding(true);

    try {
      // Call the addItem function from the cart context
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
      setIsAdding(false);
    }
  };

  // Toggle color display
  const handleToggleColors = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAllColors(!showAllColors);
  };

  // Determine if any loading state is active
  const isLoading = loading || isAdding;

  return (
    <motion.div
      className="group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative overflow-hidden mb-5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
          {/* Main product image with hover effect */}
          <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <img
              src={
                lowestPriceVariant?.images.find((img) => img.angle === "front")
                  ?.url || "/placeholder.svg?height=400&width=300"
              }
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex justify-center gap-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#2563EB",
                    color: "#ffffff",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3.5 bg-white text-gray-900 rounded-full shadow-lg transition-all duration-200 ${
                    isLoading ? "bg-blue-600 text-white" : ""
                  }`}
                  onClick={handleAddToCart}
                  disabled={
                    !lowestPriceVariant ||
                    lowestPriceVariant.stock <= 0 ||
                    isLoading
                  }
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                  ) : (
                    <ShoppingBag className="h-5 w-5" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#2563EB",
                    color: "#ffffff",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3.5 bg-white text-gray-900 rounded-full shadow-lg transition-all duration-200"
                >
                  <Heart className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#2563EB",
                    color: "#ffffff",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3.5 bg-white text-gray-900 rounded-full shadow-lg transition-all duration-200"
                >
                  <Eye className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Badges container - Contenedor horizontal para las etiquetas */}
          {/* Category badge - Top left */}
          {product.category && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
              {product.category.name}
            </div>
          )}

          {/* Low stock warning - Bottom right */}
          {lowestPriceVariant &&
            lowestPriceVariant.stock <= 3 &&
            lowestPriceVariant.stock > 0 && (
              <div className="absolute bottom-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md z-10">
                ¡Últimas {lowestPriceVariant.stock} unidades!
              </div>
            )}

          {/* Out of stock overlay */}
          {(!lowestPriceVariant || lowestPriceVariant.stock <= 0) && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-red-500 text-white text-sm font-medium px-6 py-2 transform -rotate-6 shadow-lg">
                Agotado
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              $
              {lowestPriceVariant ? lowestPriceVariant.price.toFixed(2) : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-1.5" />
              {/* Mostrar el género en lugar de la marca, ya que la marca no está disponible */}
              {product.gender ? product.gender.name : "Sin género"}
            </div>

            {uniqueColors.length > 0 && (
              <div className="flex items-center">
                <div className="flex flex-wrap justify-end max-w-[100px]">
                  {displayColors.map((color) => (
                    <div
                      key={color.id}
                      className={`w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700 transition-transform duration-200 ${
                        isHovered ? "scale-110" : ""
                      } shadow-sm m-0.5`}
                      style={{ backgroundColor: color.hexValue }}
                      aria-label={`Color: ${color.name}`}
                      title={color.name}
                    ></div>
                  ))}
                  {hasMoreColors && !showAllColors && (
                    <button
                      onClick={handleToggleColors}
                      className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm m-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title={`${uniqueColors.length - 3} colores más`}
                    >
                      <MoreHorizontal className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                  {showAllColors && (
                    <button
                      onClick={handleToggleColors}
                      className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800/50 shadow-sm m-0.5 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                      title="Mostrar menos colores"
                    >
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        −
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
