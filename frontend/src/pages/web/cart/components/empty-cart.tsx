"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      {/* Icon wrapper */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6"
      >
        <ShoppingBag className="h-12 w-12 text-blue-600 dark:text-blue-500" />
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Tu carrito está vacío
      </h3>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Parece que aún no has añadido productos a tu carrito. Explora nuestro
        catálogo para encontrar lo que necesitas.
      </p>

      {/* Call to action */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/productos"
          aria-label="Explorar catálogo de productos"
          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full inline-flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Ver productos
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
