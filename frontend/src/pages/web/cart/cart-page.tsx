"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartConrexr";
import CartItem from "@/pages/web/cart/components/cart-item";
import CartSummary from "@/pages/web/cart/components/cart-summary";
import EmptyCart from "@/pages/web/cart/components/empty-cart";

export default function CartPage() {
  const { items, clearCart } = useCart();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <ShoppingCart className="w-7 h-7 mr-2 text-blue-600 dark:text-blue-400" />
            Mi Carrito
          </h1>

          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <ShoppingCart className="w-7 h-7 mr-2 text-blue-600 dark:text-blue-400" />
              Mi Carrito
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {items.length} {items.length === 1 ? "producto" : "productos"} en
              tu carrito
            </p>
          </motion.div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCart}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Vaciar carrito
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/productos"
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                Seguir comprando
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Productos en tu carrito
                </h2>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item:any) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
