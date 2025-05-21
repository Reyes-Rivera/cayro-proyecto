"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
        <ShoppingBag className="h-12 w-12 text-blue-600 dark:text-blue-500" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Tu carrito está vacío
      </h3>

      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
        Parece que aún no has añadido productos a tu carrito. Explora nuestro
        catálogo para encontrar lo que necesitas.
      </p>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/productos"
          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full inline-flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Ver productos
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>

    
    </div>
  );
}
