"use client";

import { motion } from "framer-motion";
import type { Product } from "../utils/products";
import ProductCard from "./ProductCard";
import { Shirt, AlertCircle } from "lucide-react";

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
        staggerChildren: 0.1,
      },
    },
  };
  // Check if products have variants
  const validProducts = products.filter(
    (product) => product.variants && product.variants.length > 0
  );
  // If there are products but none have variants, show a message
  if (products.length > 0 && validProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center"
      >
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No hay productos disponibles
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
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

  // Filter out products without variants for display
  //const validProducts = products.filter((product) => product.variants && product.variants.length > 0)

  // No products found after filtering
  if (noProductsFound) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center"
      >
        <div className="flex flex-col items-center justify-center">
          <Shirt className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            No se encontraron productos que coincidan con los filtros
            seleccionados.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFilters}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md"
          >
            Limpiar filtros
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // All products have no variants
  //if (validProducts.length === 0 && products.length > 0) {
  //  return (
  //    <motion.div
  //      initial={{ opacity: 0, y: 20 }}
  //      animate={{ opacity: 1, y: 0 }}
  //      transition={{ duration: 0.5 }}
  //      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center"
  //    >
  //      <div className="flex flex-col items-center justify-center">
  //        <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
  //        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No hay productos disponibles</h3>
  //        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
  //          Los productos no tienen variantes disponibles. Por favor, contacte al administrador.
  //        </p>
  //      </div>
  //    </motion.div>
  //  )
  //}

  // Some products have no variants - show warning and valid products
  if (hasProductsWithoutVariants && validProducts.length > 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-amber-50 dark:bg-amber-900/20 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800 p-4 mb-6 text-left"
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-amber-700 dark:text-amber-400 text-sm">
              Algunos productos ({productsWithoutVariants.length}) no tienen
              variantes disponibles y no se muestran.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {validProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isHovered={hoveredProduct === product.id}
              onHover={() => setHoveredProduct(product.id)}
              onLeave={() => setHoveredProduct(null)}
            />
          ))}
        </motion.div>
      </>
    );
  }

  // All products have variants - normal display
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {validProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isHovered={hoveredProduct === product.id}
          onHover={() => setHoveredProduct(product.id)}
          onLeave={() => setHoveredProduct(null)}
        />
      ))}
    </motion.div>
  );
}
