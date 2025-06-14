"use client";

import { motion } from "framer-motion";
import type { Product } from "@/types/products";
import { AlertCircle, RefreshCw, PackageOpen, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  hoveredProduct: number | null;
  setHoveredProduct: (id: number | null) => void;
  noProductsFound: boolean;
  clearAllFilters: () => void;
  viewMode?: "grid" | "list";
}

export default function ProductGrid({
  products,
  hoveredProduct,
  setHoveredProduct,
  noProductsFound,
  clearAllFilters,
  viewMode = "grid",
}: ProductGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const validProducts = products.filter(
    (product) => product.variants && product.variants.length > 0
  );

  if (products.length > 0 && validProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="py-8 md:py-16 text-center rounded-2xl md:rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 shadow-xl border border-amber-100 dark:border-amber-800/30 backdrop-blur-sm mx-2 md:mx-0"
      >
        <div className="flex flex-col items-center justify-center py-8 md:py-12 px-4">
          <div className="relative mb-6 md:mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-inner">
              <AlertCircle
                className="h-8 w-8 md:h-10 md:w-10 text-amber-500"
                strokeWidth={1.5}
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 px-4">
            No hay productos disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base px-4">
            Los productos no tienen variantes disponibles. Por favor, contacte
            al administrador.
          </p>
        </div>
      </motion.div>
    );
  }

  const productsWithoutVariants = products.filter(
    (product) => !product.variants || product.variants.length === 0
  );
  const hasProductsWithoutVariants = productsWithoutVariants.length > 0;

  if (noProductsFound) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="py-8 md:py-16 text-center rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 shadow-xl border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm mx-2 md:mx-0"
      >
        <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
          <div className="relative mb-6 md:mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-inner">
              <PackageOpen
                className="h-10 w-10 md:h-12 md:w-12 text-blue-600 dark:text-blue-400"
                strokeWidth={1.5}
              />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-blue-400 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
            </motion.div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 px-4">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base px-4">
            No se encontraron productos que coincidan con los filtros
            seleccionados.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFilters}
            className="px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all rounded-full flex items-center gap-2 shadow-lg shadow-blue-600/25 text-sm md:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            Limpiar filtros
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (hasProductsWithoutVariants && validProducts.length > 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/30 p-3 md:p-4 mb-6 md:mb-8 rounded-xl md:rounded-2xl shadow-sm backdrop-blur-sm mx-2 md:mx-0"
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-2 rounded-full mr-3 shadow-inner flex-shrink-0">
              <AlertCircle
                className="h-4 w-4 text-amber-600 dark:text-amber-400"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-amber-800 dark:text-amber-300 text-xs md:text-sm font-medium">
              Algunos productos ({productsWithoutVariants.length}) no tienen
              variantes disponibles y no se muestran.
            </p>
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-400/5 to-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-20 w-40 h-40 md:w-48 md:h-48 bg-gradient-to-tr from-blue-500/4 to-cyan-400/4 rounded-full blur-3xl"></div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`relative z-10 ${
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                : "flex flex-col gap-3 md:gap-4"
            }`}
          >
            {validProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard
                  product={product}
                  isHovered={hoveredProduct === product.id}
                  onHover={() => setHoveredProduct(product.id)}
                  onLeave={() => setHoveredProduct(null)}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-400/5 to-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 md:w-48 md:h-48 bg-gradient-to-tr from-blue-500/4 to-cyan-400/4 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative z-10 ${
          viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
            : "flex flex-col gap-3 md:gap-4"
        }`}
      >
        {validProducts.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard
              product={product}
              isHovered={hoveredProduct === product.id}
              onHover={() => setHoveredProduct(product.id)}
              onLeave={() => setHoveredProduct(null)}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
