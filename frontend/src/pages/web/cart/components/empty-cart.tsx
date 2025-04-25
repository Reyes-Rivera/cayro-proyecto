"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  Tag,
  Shirt,
  ShoppingBagIcon as BagIcon,
  Heart,
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

      {/* Categories */}
      <div className="mt-16 w-full max-w-4xl">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-6 text-center">
          Categorías populares
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <Shirt className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
              Uniformes
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Escolares y deportivos
            </p>
            <Link
              to="/productos?categoria=uniformes"
              className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
            >
              Ver productos
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <BagIcon className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
              Deportivos
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Ropa y accesorios
            </p>
            <Link
              to="/productos?categoria=deportivos"
              className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
            >
              Ver productos
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <Tag className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
              Ofertas
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Descuentos especiales
            </p>
            <Link
              to="/productos?oferta=true"
              className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
            >
              Ver productos
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
              Favoritos
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Productos populares
            </p>
            <Link
              to="/productos?populares=true"
              className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
            >
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
