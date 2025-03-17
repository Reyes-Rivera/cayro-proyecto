"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import type { Product } from "../utils/products";
import { useCart } from "@/context/CartConrexr";

interface ProductCardProps {
  product: Product;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export default function ProductCard({
  product,
  isHovered,
  onHover,
  onLeave,
}: ProductCardProps) {
  const { addItem } = useCart();
  // Get unique colors for a product
  const getUniqueColors = (product: Product) => {
    const uniqueColors: Record<
      number,
      { id: number; name: string; hexValue: string }
    > = {};

    product.variants.forEach((variant) => {
      if (variant.color && !uniqueColors[variant.color.id]) {
        uniqueColors[variant.color.id] = {
          id: variant.color.id,
          name: variant.color.name,
          hexValue: variant.color.hexValue || "#6B7280", // Usar el hexValue del backend, o gris por defecto
        };
      }
    });

    return Object.values(uniqueColors);
  };

  const lowestPriceVariant = product.variants.reduce((prev, current) =>
    prev.price < current.price ? prev : current
  );

  const uniqueColors = getUniqueColors(product);

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (lowestPriceVariant.stock > 0) {
      addItem(product, lowestPriceVariant, 1);
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={
              // eslint-disable-next-line no-constant-binary-expression
              lowestPriceVariant.imageUrl ||
              "/placeholder.svg?height=400&width=300" ||
              "/placeholder.svg"
            }
            alt={product.name}
            width={300}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "#2563EB",
                  color: "#ffffff",
                }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full shadow-lg transition-all duration-200"
                onClick={handleAddToCart}
                disabled={lowestPriceVariant.stock <= 0}
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "#2563EB",
                  color: "#ffffff",
                }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full shadow-lg transition-all duration-200 delay-75"
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
                className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full shadow-lg transition-all duration-200 delay-150"
              >
                <Eye className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-2 right-2 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-md">
            {product.category.name}
          </div>

          {/* Low stock warning */}
          {lowestPriceVariant.stock <= 3 && lowestPriceVariant.stock > 0 && (
            <div className="absolute bottom-2 left-2 bg-red-500/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-md">
              ¡Últimas {lowestPriceVariant.stock} unidades!
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
              {product.name}
            </h3>
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              ${lowestPriceVariant.price.toFixed(2)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {product.brand.name}
            </div>

            <div className="flex gap-1">
              {uniqueColors.map((color) => (
                <div
                  key={color.id}
                  className={`w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600 transition-transform duration-200 ${
                    isHovered ? "scale-125" : ""
                  }`}
                  style={{ backgroundColor: color.hexValue }}
                  aria-label={`Color: ${color.name}`}
                  title={color.name}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
