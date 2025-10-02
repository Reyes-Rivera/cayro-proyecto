"use client";

import type React from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const asNumber = (v: unknown): number => {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (n: unknown) => asNumber(n).toFixed(2); // Puedes cambiar a Intl.NumberFormat si quieres localización

const CartSummary: React.FC = () => {
  const { itemCount, subtotal, shippingCost, total } = useCart();
  const navigate = useNavigate();

  const safeSubtotal = formatMoney(subtotal);
  const safeShipping = formatMoney(shippingCost);
  const safeTotal = formatMoney(total);

  const hasItems = (itemCount ?? 0) > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Resumen del carrito
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-900 dark:text-white">
            ${safeSubtotal} MXN
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Envío</span>
          <span className="text-gray-900 dark:text-white">
            {hasItems ? `$${safeShipping} MXN` : "Gratis"}
          </span>
        </div>
      </div>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      <div className="flex justify-between text-lg font-semibold">
        <span className="text-gray-900 dark:text-white">Total</span>
        <span className="text-gray-900 dark:text-white">${safeTotal} MXN</span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mr-2"></span>
          <span className="text-gray-500 dark:text-gray-400">
            {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu
            carrito
          </span>
        </div>
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mr-2"></span>
          <span className="text-gray-500 dark:text-gray-400">
            {hasItems
              ? `Envío estimado: $${safeShipping} MXN para ${itemCount} ${
                  itemCount === 1 ? "artículo" : "artículos"
                }`
              : "Agrega productos para calcular envío"}
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        disabled={!hasItems}
        className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Proceder al checkout
      </button>
    </div>
  );
};

export default CartSummary;
