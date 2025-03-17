"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartConrexr";
import { Link } from "react-router-dom";

export default function CartSummary() {
  const { subtotal, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Calculate shipping, tax, and total
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const tax = subtotal * 0.16; // 16% tax
  const discount = couponSuccess ? subtotal * 0.1 : 0; // 10% discount if coupon applied
  const total = subtotal + shipping + tax - discount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Por favor ingresa un código de cupón");
      setCouponSuccess("");
      return;
    }

    // Simulate coupon validation
    if (couponCode.toLowerCase() === "descuento10") {
      setCouponSuccess("¡Cupón aplicado! 10% de descuento");
      setCouponError("");
    } else {
      setCouponError("Código de cupón inválido o expirado");
      setCouponSuccess("");
    }
  };

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
          <div className="text-xs text-gray-500 dark:text-gray-400 italic bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md flex items-start">
            <Truck className="w-3 h-3 text-blue-600 dark:text-blue-400 mr-1 mt-0.5 flex-shrink-0" />
            <span>Envío gratis en compras mayores a $100.00</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Impuestos (16%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        {/* Coupon Section */}
        <div className="pt-2">
          <button
            onClick={() => setShowCouponInput(!showCouponInput)}
            className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            <Tag className="w-4 h-4 mr-1" />
            {showCouponInput ? "Ocultar cupón" : "Agregar cupón de descuento"}
            {showCouponInput ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>

          {showCouponInput && (
            <div className="mt-2 space-y-2">
              <div className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ingresa código de cupón"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Aplicar
                </button>
              </div>

              {couponError && (
                <div className="text-xs text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {couponError}
                </div>
              )}

              {couponSuccess && (
                <div className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <Tag className="w-3 h-3 mr-1" />
                  {couponSuccess}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Discount row (only shown when coupon is applied) */}
        {couponSuccess && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Descuento (10%)</span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}

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

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
        disabled={itemCount === 0}
      >
        <CreditCard className="w-5 h-5" />
        Proceder al pago
      </motion.button>

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

      {/* Payment Methods */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Métodos de pago aceptados:
        </p>
        <div className="flex gap-2">
          <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/productos"
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center"
        >
          <ChevronDown className="w-4 h-4 mr-1 rotate-90" />
          Continuar comprando
        </Link>
      </div>
    </motion.div>
  );
}
