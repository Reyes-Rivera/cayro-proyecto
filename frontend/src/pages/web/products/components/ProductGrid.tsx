"use client";

import { motion } from "framer-motion";
import type { Product } from "../../../../types/products";
import { AlertCircle, RefreshCw, PackageOpen, ShoppingBag } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  hoveredProduct: number | null;
  setHoveredProduct: (id: number | null) => void;
  noProductsFound: boolean;
  clearAllFilters: () => void;
}

export default function ProductGrid({
  products,
  hoveredProduct,
  setHoveredProduct,
  noProductsFound,
  clearAllFilters,
}: ProductGridProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Check if products have variants
  const validProducts = products.filter(
    (product) => product.variants && product.variants.length > 0
  );

  // If there are products but none have variants, show a message
  if (products.length > 0 && validProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-16 text-center rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 shadow-lg border border-blue-100 dark:border-blue-900/30"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-6 shadow-inner">
            <AlertCircle
              className="h-10 w-10 text-amber-500"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">
            No hay productos disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Los productos no tienen variantes disponibles. Por favor, contacte
            al administrador.
          </p>
        </div>
      </motion.div>
    );
  }

  // Check if there are products without variants
  const productsWithoutVariants = products.filter(
    (product) => !product.variants || product.variants.length === 0
  );
  const hasProductsWithoutVariants = productsWithoutVariants.length > 0;

  // No products found after filtering
  if (noProductsFound) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-16 text-center rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 shadow-lg border border-blue-100 dark:border-blue-900/30"
      >
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-8 shadow-inner">
            <PackageOpen
              className="h-12 w-12 text-blue-600 dark:text-blue-400"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto">
            No se encontraron productos que coincidan con los filtros
            seleccionados.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={clearAllFilters}
            className="px-8 py-3.5 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors rounded-full flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            Limpiar filtros
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Some products have no variants - show warning and valid products
  if (hasProductsWithoutVariants && validProducts.length > 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/10 dark:to-amber-800/5 border border-amber-200 dark:border-amber-800/30 p-5 mb-10 rounded-xl shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-full mr-4">
              <AlertCircle
                className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              Algunos productos ({productsWithoutVariants.length}) no tienen
              variantes disponibles y no se muestran.
            </p>
          </div>
        </motion.div>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-40 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-14 relative z-10"
          >
            {validProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard
                  product={product}
                  isHovered={hoveredProduct === product.id}
                  onHover={() => setHoveredProduct(product.id)}
                  onLeave={() => setHoveredProduct(null)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </>
    );
  }

  // All products have variants - normal display
  return (
    <div className="relative">
      {/* Collection label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 inline-flex items-center"
      >
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 shadow-md">
          <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Colección destacada
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Descubre nuestras prendas más populares
          </p>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-14 relative z-10"
      >
        {validProducts.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard
              product={product}
              isHovered={hoveredProduct === product.id}
              onHover={() => setHoveredProduct(product.id)}
              onLeave={() => setHoveredProduct(null)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
