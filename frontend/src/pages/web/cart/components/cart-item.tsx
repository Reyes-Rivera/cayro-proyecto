"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Trash2, Minus, Plus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { AlertHelper } from "@/utils/alert.util";

type CartItemModel = {
  id: string | number;
  quantity: number;
  product?: {
    id?: string | number;
    slug?: string;
    name?: string;
    brand?: { name?: string };
  };
  variant?: {
    id?: string | number;
    price?: number;
    stock?: number;
    imageUrl?: string;
    images?: { url?: string }[];
    color?: { name?: string; hexValue?: string };
    size?: { name?: string };
  };
};

interface CartItemProps {
  item: CartItemModel | null | undefined;
  currency?: string; // por defecto MXN
  locale?: string; // por defecto es-MX
}

export default function CartItem({
  item,
  currency = "MXN",
  locale = "es-MX",
}: CartItemProps) {
  const { updateQuantity, removeItem, loading: cartBusy } = useCart();

  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStockWarning, setShowStockWarning] = useState(false);
  const [localQty, setLocalQty] = useState<number>(() => item?.quantity ?? 1);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // ----- Guards -----
  if (!item) return null;

  // ----- Getters seguros -----
  const productName = item.product?.name || "Producto sin nombre";
  const productId = item.product?.id ?? item.product?.slug ?? "#";
  const price = Number(item.variant?.price ?? 0);
  const stock = Number(item.variant?.stock ?? 0);
  const brand = item.product?.brand?.name || null;

  const colorName = item.variant?.color?.name || "Color no especificado";
  const colorHex = item.variant?.color?.hexValue || "#6B7280";
  const sizeName = item.variant?.size?.name || "Talla no especificada";

  const imageUrl = useMemo(() => {
    const first = item.variant?.images?.[0]?.url;
    return (
      first || item.variant?.imageUrl || "/placeholder.svg?height=200&width=200"
    );
  }, [item]);

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency }),
    [locale, currency]
  );

  // Mantener localQty sincronizado si el item cambia externamente
  useEffect(() => {
    if (typeof item.quantity === "number") setLocalQty(item.quantity);
  }, [item.quantity]);

  // ----- Helpers -----
  const clamped = (q: number) => {
    const min = 1;
    const max = Math.max(1, stock || 1);
    return Math.min(Math.max(q, min), max);
  };

  const isBusy = cartBusy || isUpdating;
  const totalPrice = price * (item.quantity || 1);

  // ----- Acciones -----
  const confirmRemove = async () => {
    const ok = await AlertHelper.confirm({
      title: "¿Eliminar producto?",
      message: `¿Quieres eliminar "${productName}" de tu carrito?`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "question",
      animation: "bounce",
    });
    if (!ok) return;

    setIsRemoving(true);
    try {
      await removeItem(item.id.toString());
      AlertHelper.success({
        message: "Producto eliminado del carrito",
        title: "Producto eliminado",
        animation: "slideIn",
        timer: 3000,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al eliminar.";
      setIsRemoving(false);
      AlertHelper.error({
        message: msg,
        title: "Error al eliminar",
        animation: "slideIn",
        timer: 3000,
      });
    }
  };

  const pushUpdate = (nextQty: number) => {
    // debounce para no saturar backend
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsUpdating(true);
    debounceRef.current = setTimeout(async () => {
      try {
        await updateQuantity(item.id.toString(), nextQty);
        setShowStockWarning(false);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "No se pudo actualizar la cantidad.";
        AlertHelper.error({
          title: "Error",
          message: msg,
          animation: "slideIn",
          position: "bottom-end",
          timer: 3000,
        });
        // revertir visualmente
        setLocalQty(item.quantity);
      } finally {
        setIsUpdating(false);
      }
    }, 250);
  };

  const handleChangeQty = (next: number) => {
    const safe = clamped(next);
    setLocalQty(safe);

    if (safe !== next || (stock && next > stock)) {
      setShowStockWarning(true);
      AlertHelper.warning({
        title: "Stock limitado",
        message: `Solo hay ${stock} unidades disponibles`,
        animation: "slideIn",
        position: "bottom-end",
        timer: 2500,
      });
      setTimeout(() => setShowStockWarning(false), 2500);
    }

    if (safe !== item.quantity) pushUpdate(safe);
  };

  const dec = () => !isBusy && handleChangeQty(localQty - 1);
  const inc = () => !isBusy && handleChangeQty(localQty + 1);

  return (
    <motion.div
      layout
      initial={{ opacity: 1, y: 0 }}
      animate={{
        opacity: isRemoving ? 0 : 1,
        y: isRemoving ? 20 : 0,
        height: isRemoving ? 0 : "auto",
      }}
      transition={{ duration: 0.3 }}
      className="p-4 relative"
      aria-live="polite"
    >
      {/* Aviso de stock */}
      <AnimatePresence>
        {showStockWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 right-0 left-0 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs p-2 flex items-center"
            role="status"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Solo hay {stock} unidades disponibles
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay de carga */}
      <AnimatePresence>
        {isBusy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center z-10"
            aria-busy="true"
          >
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm text-blue-600 dark:text-blue-500 font-medium">
                Actualizando...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout */}
      <div className="flex gap-4">
        {/* Imagen */}
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
          <Link
            to={`/producto/${productId}`}
            className="block w-full h-full"
            aria-label={productName}
          >
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=200&width=200";
              }}
            />
          </Link>
        </div>

        {/* Detalles */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div className="min-w-0">
              <Link
                to={`/producto/${productId}`}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors line-clamp-1"
                title={productName}
              >
                {productName}
              </Link>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                <span className="inline-flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: colorHex }}
                    aria-label={`Color ${colorName}`}
                  />
                  {colorName}
                </span>
                <span className="inline-flex items-center">
                  <span className="text-gray-400 mx-1">•</span>
                  Talla: {sizeName}
                </span>
                {brand && (
                  <span className="inline-flex items-center">
                    <span className="text-gray-400 mx-1">•</span>
                    {brand}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-2 sm:mt-0 text-right">
              <p className="font-medium text-gray-900 dark:text-white">
                {formatter.format(price)}
              </p>
              {(item.quantity || 1) > 1 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatter.format(price)} × {item.quantity} ={" "}
                  <span className="font-medium">
                    {formatter.format(totalPrice)}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
            <div className="flex items-center">
              <button
                type="button"
                onClick={dec}
                disabled={localQty <= 1 || isBusy}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span
                className="mx-3 text-sm font-medium text-gray-900 dark:text-white min-w-[1.5rem] text-center"
                aria-live="polite"
              >
                {localQty}
              </span>

              <button
                type="button"
                onClick={inc}
                disabled={localQty >= stock || isBusy || stock <= 0}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {stock > 0 && localQty >= stock && (
                <span
                  className="ml-2 text-xs text-amber-600 dark:text-amber-400"
                  role="status"
                >
                  Máx.
                </span>
              )}
              {stock === 0 && (
                <span
                  className="ml-2 text-xs text-red-600 dark:text-red-400"
                  role="status"
                >
                  Sin stock
                </span>
              )}
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: isBusy ? 1 : 1.05 }}
              whileTap={{ scale: isBusy ? 1 : 0.95 }}
              onClick={confirmRemove}
              disabled={isBusy}
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors flex items-center text-xs disabled:opacity-50"
              aria-label={`Eliminar ${productName}`}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Eliminar
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
