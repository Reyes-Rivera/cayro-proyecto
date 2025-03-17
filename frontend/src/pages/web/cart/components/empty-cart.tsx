"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  ArrowRight,
  Tag,
  Shirt,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-8 md:p-12 text-center">
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            <ShoppingCart className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>

          <motion.h3
            variants={itemVariants}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Tu carrito está vacío
          </motion.h3>

          <motion.p
            variants={itemVariants}
            className="text-gray-500 dark:text-gray-400 mb-8 max-w-md"
          >
            Parece que aún no has añadido productos a tu carrito. Explora
            nuestro catálogo para encontrar lo que necesitas.
          </motion.p>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/productos"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md inline-flex items-center gap-2"
            >
              Ver productos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 dark:bg-gray-700/30 p-8 border-t border-gray-200 dark:border-gray-700">
        <motion.h4
          variants={itemVariants}
          className="text-lg font-medium text-gray-900 dark:text-white mb-6 text-center"
        >
          Categorías populares
        </motion.h4>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <Shirt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
              Uniformes
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Escolares y deportivos
            </p>
            <Link
              to="/productos?categoria=uniformes"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver productos
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
              Deportivos
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Ropa y accesorios
            </p>
            <Link
              to="/productos?categoria=deportivos"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver productos
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
              <Tag className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
              Ofertas
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Descuentos especiales
            </p>
            <Link
              to="/productos?oferta=true"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver productos
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
              Favoritos
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Productos populares
            </p>
            <Link
              to="/productos?populares=true"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver productos
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Recently Viewed */}
      <div className="p-8 border-t border-gray-200 dark:border-gray-700">
        <motion.h4
          variants={itemVariants}
          className="text-lg font-medium text-gray-900 dark:text-white mb-6 text-center"
        >
          Vistos recientemente
        </motion.h4>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-700">
                <img
                  src={`/placeholder.svg?height=150&width=150&text=Producto+${item}`}
                  alt={`Producto ${item}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h5 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  Producto {item}
                </h5>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                  $29.99
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
