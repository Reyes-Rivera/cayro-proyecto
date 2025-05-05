"use client";

import type React from "react";
import {
  ChevronUp,
  ChevronDown,
  Truck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { CheckoutStep } from "@/types/checkout";

interface OrderSummaryProps {
  items: any[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  shippingMethod: "standard" | "express";
  expanded: boolean;
  toggleExpanded: () => void;
  currentStep: CheckoutStep;
  onContinue: () => void;
  isProcessing: boolean;
  paymentMethod: "card" | "paypal";
}

export default function OrderSummary({
  items,
  itemCount,
  subtotal,
  shipping,
  total,
  shippingMethod,
  expanded,
  toggleExpanded,
  currentStep,
  onContinue,
  isProcessing,
  paymentMethod,
}: OrderSummaryProps) {
  // Función para manejar errores de carga de imágenes
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/placeholder.svg?height=64&width=64";
  };

  // Función para obtener la URL de la imagen del producto
  const getProductImageUrl = (item: any) => {
    // Verificar si existe la propiedad variant con imageUrl
    if (item.variant && item.variant.imageUrl) {
      return item.variant.imageUrl;
    }
    // Verificar si existe la propiedad imageUrl directamente en el item
    else if (item.imageUrl) {
      return item.imageUrl;
    }
    // Verificar si existe la propiedad product con image
    else if (item.product && item.product.image) {
      return item.product.image;
    }
    // Devolver imagen de placeholder como último recurso
    return "/placeholder.svg?height=64&width=64";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-20">
      {/* Mobile Header with Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">
          Resumen del pedido
        </h2>
        <button
          onClick={toggleExpanded}
          className="text-gray-500 dark:text-gray-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main Content - Collapsible on Mobile */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          expanded
            ? "max-h-[1000px] opacity-100"
            : "max-h-0 opacity-0 lg:max-h-[1000px] lg:opacity-100 overflow-hidden"
        }`}
      >
        <div className="p-4 lg:p-6">
          {/* Desktop Header */}
          <h2 className="hidden lg:block text-lg font-medium text-gray-900 dark:text-white mb-4">
            Resumen del pedido
          </h2>

          {/* Items */}
          <div className="mb-4">
            <div className="max-h-64 overflow-y-auto pr-2">
              {items.map((item: any, index: number) => (
                <div
                  key={item.id || index}
                  className="flex py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                    <img
                      src={getProductImageUrl(item) || "/placeholder.svg"}
                      alt={item.product?.name || item.name || "Producto"}
                      className="h-full w-full object-cover object-center"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                        <h3 className="line-clamp-1">
                          {item.product?.name || item.name || "Producto"}
                        </h3>
                        <p className="ml-4">
                          $
                          {(
                            (item.variant?.price || item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {(item.variant?.color?.name || item.color?.name) &&
                          `${item.variant?.color?.name || item.color?.name} · `}
                        {item.variant?.size?.name || item.size?.name}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500 dark:text-gray-400">
                        Cant. {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
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

            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
              <div className="flex justify-between font-medium">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white text-lg">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Impuestos incluidos
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-start">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                Información de envío
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {shippingMethod === "standard"
                  ? "Envío estándar: 3-5 días hábiles"
                  : "Envío express: 1-2 días hábiles"}
              </p>
              {subtotal > 100 && shippingMethod === "standard" && (
                <p className="text-sm text-green-500 mt-1">
                  ¡Envío gratis en compras mayores a $100!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer - Always visible */}
      <div className="lg:hidden p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            ${total.toFixed(2)}
          </div>
        </div>
        {currentStep === "shipping" ? (
          <button
            onClick={onContinue}
            className="py-2.5 px-4 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70"
          >
            Continuar
            <ArrowRight className="ml-1 w-4 h-4" />
          </button>
        ) : (
          <button
            disabled={isProcessing || paymentMethod === "card"}
            className="py-2.5 px-4 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                Pagar
                <ArrowRight className="ml-1 w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
