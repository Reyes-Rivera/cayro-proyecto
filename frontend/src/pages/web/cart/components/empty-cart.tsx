"use client";

import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
          <ShoppingCart className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tu carrito está vacío
        </h3>

        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Parece que aún no has añadido productos a tu carrito. Explora nuestro
          catálogo para encontrar lo que necesitas.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/productos"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md inline-flex items-center gap-2"
          >
            Ver productos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Uniformes
            </h4>
            <Link
              to="/productos?categoria=uniformes-escolares"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver ahora
            </Link>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Deportivos
            </h4>
            <Link
              to="/productos?categoria=deportivos"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver ahora
            </Link>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Accesorios
            </h4>
            <Link
              to="/productos?categoria=accesorios"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver ahora
            </Link>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Ofertas
            </h4>
            <Link
              to="/productos?oferta=true"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver ahora
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
