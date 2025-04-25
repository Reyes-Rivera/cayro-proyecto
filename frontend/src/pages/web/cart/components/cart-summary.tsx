"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Tag,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCart } from "@/context/CartConrexr";

export default function CartSummary() {
  const { subtotal, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

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

    setIsApplying(true);

    // Simulate coupon validation with a delay
    setTimeout(() => {
      // Simulate coupon validation
      if (couponCode.toLowerCase() === "descuento10") {
        setCouponSuccess("¡Cupón aplicado! 10% de descuento");
        setCouponError("");
      } else {
        setCouponError("Código de cupón inválido o expirado");
        setCouponSuccess("");
      }
      setIsApplying(false);
    }, 800);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Mobile Header with Toggle */}
      <div className="md:hidden p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">
          Resumen de compra
        </h2>
        <button
          onClick={toggleExpand}
          className="text-gray-500 dark:text-gray-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main Content - Collapsible on Mobile */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-[1000px] opacity-100"
            : "max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100 overflow-hidden"
        }`}
      >
        <div className="p-4 md:p-6">
          {/* Desktop Header */}
          <h2 className="hidden md:block text-lg font-medium text-gray-900 dark:text-white mb-4">
            Resumen de compra
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Subtotal ({itemCount}{" "}
                {itemCount === 1 ? "producto" : "productos"})
              </span>
              <span className="text-gray-900 dark:text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Envío</span>
              {shipping === 0 ? (
                <span className="text-green-500">Gratis</span>
              ) : (
                <span className="text-gray-900 dark:text-white">
                  ${shipping.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Impuestos (16%)
              </span>
              <span className="text-gray-900 dark:text-white">
                ${tax.toFixed(2)}
              </span>
            </div>

            {/* Coupon Section */}
            <div className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Código de descuento"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={isApplying}
                  className="absolute right-1 top-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {isApplying ? (
                    <svg
                      className="animate-spin h-4 w-4 text-blue-600 dark:text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Aplicar"
                  )}
                </button>
              </div>

              {couponError && (
                <div className="text-xs text-red-500 flex items-center mt-1.5 ml-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {couponError}
                </div>
              )}

              {couponSuccess && (
                <div className="text-xs text-green-500 flex items-center mt-1.5 ml-1">
                  <Tag className="w-3 h-3 mr-1" />
                  {couponSuccess}
                </div>
              )}
            </div>

            {/* Discount row (only shown when coupon is applied) */}
            {couponSuccess && (
              <div className="flex justify-between text-sm">
                <span className="text-green-500">Descuento (10%)</span>
                <span className="text-green-500">-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
              <div className="flex justify-between font-medium">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white text-lg">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Impuestos incluidos. El envío se calcula en el siguiente paso.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3.5 px-4 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            disabled={itemCount === 0}
          >
            Proceder al pago
            <ArrowRight className="ml-1 w-5 h-5" />
          </motion.button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Al proceder con tu compra, aceptas nuestros{" "}
              <a
                href="#"
                className="underline hover:text-blue-600 dark:hover:text-blue-500"
              >
                Términos y condiciones
              </a>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mr-2"></span>
              <span className="text-gray-500 dark:text-gray-400">
                Envío gratis en compras mayores a $100
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mr-2"></span>
              <span className="text-gray-500 dark:text-gray-400">
                Garantía de devolución de 30 días
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mr-2"></span>
              <span className="text-gray-500 dark:text-gray-400">
                Pago seguro y encriptado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer - Always visible */}
      <div className="md:hidden p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            ${total.toFixed(2)}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="py-2.5 px-4 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          disabled={itemCount === 0}
        >
          Pagar
          <ArrowRight className="ml-1 w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
