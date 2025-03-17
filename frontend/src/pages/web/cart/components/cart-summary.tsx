"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartConrexr";
import { ShoppingBag, CreditCard, Truck, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartSummary() {
  const { subtotal, itemCount } = useCart();

  // Calculate shipping, tax, and total
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const tax = subtotal * 0.16; // 16% tax
  const total = subtotal + shipping + tax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <ShoppingBag className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        Resumen de compra
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>
            Subtotal ({itemCount} {itemCount === 1 ? "producto" : "productos"})
          </span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Envío</span>
          {shipping === 0 ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              Gratis
            </span>
          ) : (
            <span className="font-medium">${shipping.toFixed(2)}</span>
          )}
        </div>

        {shipping > 0 && subtotal > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 italic bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
            Envío gratis en compras mayores a $100.00
          </div>
        )}

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Impuestos (16%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex justify-between font-semibold text-lg text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Impuestos incluidos. El envío se calcula en el siguiente paso.
          </p>
        </div>
      </div>

      <button
        className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
        disabled={itemCount === 0}
      >
        <CreditCard className="w-5 h-5" />
        Proceder al pago
      </button>

      <div className="mt-6 space-y-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Truck className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
          <span>Envío rápido de 2-5 días hábiles</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
          <span>Pagos seguros procesados con encriptación</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/productos"
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
        >
          ← Continuar comprando
        </Link>
      </div>
    </motion.div>
  );
}
