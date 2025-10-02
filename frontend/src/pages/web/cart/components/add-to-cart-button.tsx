"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { AlertHelper } from "@/utils/alert.util";

type VariantLike = {
  id?: string | number;
  stock: number;
  [k: string]: any;
};

type ProductLike = {
  id?: string | number;
  [k: string]: any;
};

interface AddToCartButtonProps {
  product: ProductLike;
  variant: VariantLike | null | undefined;
  quantity?: number;
  className?: string;
  fullWidth?: boolean;
  showIcon?: boolean;
  /** callback opcional cuando se agrega con éxito */
  onAdded?: () => void;
}

export default function AddToCartButton({
  product,
  variant,
  quantity = 1,
  className = "",
  fullWidth = false,
  showIcon = true,
  onAdded,
}: AddToCartButtonProps) {
  const { addItem, loading: cartLoading } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const hasVariant = !!variant;
  const stock = variant?.stock ?? 0;

  // Cantidad segura: al menos 1 y no mayor al stock (si se conoce)
  const safeQty = useMemo(() => {
    const q = Math.max(1, quantity | 0);
    if (!hasVariant) return q;
    if (typeof stock === "number" && stock > 0) return Math.min(q, stock);
    return q;
  }, [quantity, hasVariant, stock]);

  const disabledReason = useMemo(() => {
    if (!hasVariant) return "Selecciona una variante";
    if (stock <= 0) return "Sin stock";
    if (isAdded) return "Producto añadido";
    if (cartLoading || isLocalLoading) return "Añadiendo…";
    return undefined;
  }, [hasVariant, stock, isAdded, cartLoading, isLocalLoading]);

  const buttonDisabled = !!disabledReason;

  const handleAddToCart = useCallback(async () => {
    if (!variant || stock <= 0 || isAdded || cartLoading || isLocalLoading)
      return;

    setIsLocalLoading(true);
    try {
      await addItem(product, variant, safeQty);

      AlertHelper.success({
        message: "Producto agregado al carrito",
        title: "Producto agregado",
        timer: 3000,
        animation: "slideIn",
      });

      setIsAdded(true);
      onAdded?.();

      // Pequeño cooldown visual para evitar spam
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
      cooldownRef.current = setTimeout(() => setIsAdded(false), 1800);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "No se pudo agregar el producto.";
      AlertHelper.error({
        message: errorMessage,
        title: "Error al agregar al carrito",
        timer: 5000,
        animation: "slideIn",
      });
    } finally {
      setIsLocalLoading(false);
    }
  }, [
    variant,
    stock,
    isAdded,
    cartLoading,
    isLocalLoading,
    addItem,
    product,
    safeQty,
    onAdded,
  ]);

  // Limpiar cooldown al desmontar
  // (no hace falta useEffect si no queremos dependencia de React 18 SSR; es seguro no limpiar también)
  // pero lo incluimos por prolijidad:
  // React.useEffect(() => () => cooldownRef.current && clearTimeout(cooldownRef.current), []);

  const loading = cartLoading || isLocalLoading;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: buttonDisabled ? 1 : 1.02 }}
      whileTap={{ scale: buttonDisabled ? 1 : 0.98 }}
      onClick={handleAddToCart}
      disabled={buttonDisabled}
      aria-disabled={buttonDisabled}
      aria-busy={loading}
      aria-live="polite"
      title={disabledReason}
      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-full font-medium transition-all duration-200
        ${
          !hasVariant || stock <= 0
            ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : isAdded
            ? "bg-green-600 text-white"
            : loading
            ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-wait"
            : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
        }
        ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {!hasVariant ? (
        "Selecciona una opción"
      ) : stock <= 0 ? (
        "Sin stock"
      ) : loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
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
          Añadiendo…
        </>
      ) : isAdded ? (
        <>
          <Check className="w-5 h-5" />
          Añadido
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="w-5 h-5" />}
          {safeQty > 1 ? `Añadir ${safeQty}` : "Añadir al carrito"}
        </>
      )}
    </motion.button>
  );
}
