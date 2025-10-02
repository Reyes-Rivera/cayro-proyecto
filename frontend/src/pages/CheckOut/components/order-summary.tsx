"use client";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
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

// Default placeholder image
const PLACEHOLDER_IMAGE = "/placeholder.svg?height=64&width=64";

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
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Memoized image error handler
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>, imageUrl: string) => {
      e.currentTarget.src = PLACEHOLDER_IMAGE;
      setImageErrors((prev) => new Set(prev).add(imageUrl));
    },
    []
  );

  // Memoized product image URL getter
  const getProductImageUrl = useCallback(
    (item: any) => {
      // If image already failed, return placeholder
      const imageUrl =
        item.variant?.images?.[0]?.url ||
        item.images ||
        item.product?.image ||
        PLACEHOLDER_IMAGE;

      return imageErrors.has(imageUrl) ? PLACEHOLDER_IMAGE : imageUrl;
    },
    [imageErrors]
  );

  // Memoized product details
  const productDetails = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      name: item.product?.name || item.name || "Producto",
      price: item.variant?.price || item.price || 0,
      quantity: item.quantity,
      color: item.variant?.color?.name || item.color?.name,
      size: item.variant?.size?.name || item.size?.name,
      imageUrl: getProductImageUrl(item),
      total: ((item.variant?.price || item.price || 0) * item.quantity).toFixed(
        2
      ),
    }));
  }, [items, getProductImageUrl]);

  // Memoized totals display
  const totalsDisplay = useMemo(
    () => ({
      subtotal: subtotal.toFixed(2),
      shipping: shippingCost.toFixed(2),
      total: total.toFixed(2),
      itemText: itemCount === 1 ? "producto" : "productos",
    }),
    [subtotal, shippingCost, total, itemCount]
  );

  // Memoized mobile header
  const MobileHeader = useMemo(
    () => (
      <div
        className="lg:hidden p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center cursor-pointer"
        onClick={toggleExpanded}
        role="button"
        aria-expanded={expanded}
        aria-controls="order-summary-content"
      >
        <h2 className="text-base font-medium text-gray-900 dark:text-white">
          Resumen del pedido
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
          className="text-gray-500 dark:text-gray-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={expanded ? "Contraer resumen" : "Expandir resumen"}
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>
    ),
    [expanded, toggleExpanded]
  );

  // Memoized product items list
  const ProductItems = useMemo(
    () => (
      <div className="mb-4">
        <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {productDetails.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  width={64}
                  height={64}
                  onError={(e) => handleImageError(e, product.imageUrl)}
                />
              </div>
              <div className="ml-4 flex flex-1 flex-col min-w-0">
                <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                  <h3 className="line-clamp-1 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="ml-4 whitespace-nowrap flex-shrink-0">
                    ${product.total}
                  </p>
                </div>
                {(product.color || product.size) && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {product.color && `${product.color}`}
                    {product.color && product.size && " · "}
                    {product.size && `${product.size}`}
                  </p>
                )}
                <div className="flex flex-1 items-end justify-between text-sm mt-1">
                  <p className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    Cant. {product.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    [productDetails, handleImageError]
  );

  // Memoized totals section
  const TotalsSection = useMemo(
    () => (
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Subtotal ({itemCount} {totalsDisplay.itemText})
          </span>
          <span className="text-gray-900 dark:text-white font-medium">
            ${totalsDisplay.subtotal} MXN
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Envío</span>
          <span className="text-gray-900 dark:text-white font-medium">
            ${totalsDisplay.shipping} MXN
          </span>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
          <div className="flex justify-between font-medium">
            <span className="text-gray-900 dark:text-white text-base">
              Total
            </span>
            <span className="text-gray-900 dark:text-white text-lg font-semibold">
              ${totalsDisplay.total} MXN
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Impuestos incluidos
          </p>
        </div>
      </div>
    ),
    [itemCount, totalsDisplay]
  );

  // Memoized shipping info
  const ShippingInfo = useMemo(
    () => (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-start">
          <Truck
            className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3 flex-shrink-0"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm">
              Información de envío
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Costo calculado automáticamente según cantidad de productos
            </p>
          </div>
        </div>
      </div>
    ),
    []
  );

  // Memoized mobile footer
  const MobileFooter = useMemo(
    () => (
      <div className="lg:hidden p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            ${totalsDisplay.total} MXN
          </div>
        </div>
        {currentStep === "shipping" && (
          <button
            onClick={onContinue}
            className="py-2.5 px-4 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Continuar con el pedido"
          >
            Continuar
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    ),
    [totalsDisplay.total, currentStep, onContinue]
  );

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-20"
      role="complementary"
      aria-label="Resumen del pedido"
    >
      {MobileHeader}

      {/* Main Content */}
      <div
        id="order-summary-content"
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

          {ProductItems}
          {TotalsSection}
        </div>

        {ShippingInfo}
      </div>

      {MobileFooter}
    </div>
  );
}
