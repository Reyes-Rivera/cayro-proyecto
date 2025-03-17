"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  ChevronRight,
  Clock,
  Gift,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartConrexr";
import CartItem from "@/pages/web/cart/components/cart-item";
import CartSummary from "@/pages/web/cart/components/cart-summary";
import EmptyCart from "@/pages/web/cart/components/empty-cart";

export default function CartPage() {
  const { items, clearCart, itemCount } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  // Calculate estimated delivery date (3-5 business days from now)
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // Add 5 days

    // Format date to locale string (e.g., "15 de marzo")
    const formattedDate = deliveryDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });

    setEstimatedDelivery(formattedDate);
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <Link
              to="/"
              className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Inicio
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <ShoppingCart className="w-7 h-7 mr-2 text-blue-600 dark:text-blue-400" />
              Mi Carrito
            </h1>
          </div>

          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb and Title */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/"
              className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Inicio
            </Link>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-600 dark:text-gray-400">Carrito</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu
                carrito
              </p>
            </motion.div>

            <div className="flex gap-4">
              {showClearConfirm ? (
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    ¿Vaciar carrito?
                  </span>
                  <button
                    onClick={() => {
                      clearCart();
                      setShowClearConfirm(false);
                    }}
                    className="px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    No
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Vaciar carrito
                </motion.button>
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/productos"
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Seguir comprando
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Carrito
            </span>
            <span className="text-sm font-medium text-gray-400">Envío</span>
            <span className="text-sm font-medium text-gray-400">Pago</span>
            <span className="text-sm font-medium text-gray-400">
              Confirmación
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: "25%" }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <h2 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  Productos en tu carrito
                </h2>
              </div>

              <AnimatePresence>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item: any) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {/* Estimated Delivery */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/20">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Entrega estimada
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recibe tus productos alrededor del{" "}
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {estimatedDelivery}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Gift Option */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="gift-option"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="gift-option"
                    className="ml-2 flex items-center"
                  >
                    <Gift className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enviar como regalo (incluir mensaje personalizado)
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Shopping Benefits */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    Envío rápido
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    3-5 días hábiles
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    Compra segura
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Pago protegido
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    Múltiples pagos
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Tarjeta, transferencia
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary />

            {/* Recommended Products */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Recomendados para ti
              </h3>
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={`/placeholder.svg?height=64&width=64&text=Producto+${item}`}
                        alt={`Producto recomendado ${item}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        Producto recomendado {item}
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        $29.99
                      </p>
                    </div>
                    <button className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Link
                  to="/productos"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center mt-2"
                >
                  Ver más recomendaciones
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Si tienes preguntas sobre tu pedido o proceso de compra,
                contáctanos.
              </p>
              <Link
                to="/contacto"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                Ir a contacto
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
