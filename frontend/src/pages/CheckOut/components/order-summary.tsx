"use client";
import type React from "react";
import { ChevronUp, ChevronDown, Truck, ArrowRight } from "lucide-react";
import type { CheckoutStep } from "@/types/checkout";
import { useCart } from "@/context/CartContext";

interface OrderSummaryProps {
  items: any[];
  itemCount: number;
  subtotal: number;
  expanded: boolean;
  toggleExpanded: () => void;
  currentStep: CheckoutStep;
  onContinue: () => void;
  isProcessing: boolean;
}

export default function OrderSummary({
  items,
  itemCount,
  subtotal,
  expanded,
  toggleExpanded,
  currentStep,
  onContinue,
}: OrderSummaryProps) {
  const { shippingCost, total } = useCart();

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/placeholder.svg?height=64&width=64";
  };

  const getProductImageUrl = (item: any) => {
    if (item.variant && item.variant.images) {
      return item.variant?.images[0]?.url;
    } else if (item.images) {
      return item.images;
    } else if (item.product && item.product.image) {
      return item.product.image;
    }
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
      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          expanded
            ? "max-h-[1000px] opacity-100"
            : "max-h-0 opacity-0 lg:max-h-[1000px] lg:opacity-100 overflow-hidden"
        }`}
      >
        <div className="p-4 lg:p-6">
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
                      alt={item.product?.name || item?.name || "Producto"}
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
                ${subtotal.toFixed(2)} MXN
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Envío</span>
              <span className="text-gray-900 dark:text-white">
                ${shippingCost.toFixed(2)} MXN
              </span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
              <div className="flex justify-between font-medium">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white text-lg">
                  ${total.toFixed(2)} MXN
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
                Costo calculado automáticamente según cantidad de productos
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Footer */}
      <div className="lg:hidden p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            ${total.toFixed(2)} MXN
          </div>
        </div>
        {currentStep === "shipping" && (
          <button
            onClick={onContinue}
            className="py-2.5 px-4 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Continuar
            <ArrowRight className="ml-1 w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
