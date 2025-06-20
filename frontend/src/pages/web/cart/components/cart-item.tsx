"use client";

import { useState } from "react";
import { Trash2, Minus, Plus, Heart, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

interface CartItemProps {
  item: any;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, loading } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showStockWarning, setShowStockWarning] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // Safe image URL getter with fallbacks
  const getImageUrl = () => {
    // Check if variant exists and has images array
    if (
      item?.variant?.images &&
      Array.isArray(item.variant.images) &&
      item.variant.images.length > 0
    ) {
      // Check if first image exists and has url
      if (item.variant.images[0]?.url) {
        return item.variant.images[0].url;
      }
    }

    // Check if variant has a single imageUrl property (alternative structure)
    if (item?.variant?.imageUrl) {
      return item.variant.imageUrl;
    }

    // Fallback to placeholder
    return "/placeholder.svg?height=200&width=200";
  };

  // Safe property getters with fallbacks
  const getProductName = () => {
    return item?.product?.name || "Producto sin nombre";
  };

  const getColorName = () => {
    return item?.variant?.color?.name || "Color no especificado";
  };

  const getColorHex = () => {
    return item?.variant?.color?.hexValue || "#6B7280";
  };

  const getSizeName = () => {
    return item?.variant?.size?.name || "Talla no especificada";
  };

  const getBrandName = () => {
    return item?.product?.brand?.name || null;
  };

  const getPrice = () => {
    return item?.variant?.price || 0;
  };

  const getStock = () => {
    return item?.variant?.stock || 0;
  };

  const getQuantity = () => {
    return item?.quantity || 1;
  };

  const getProductId = () => {
    return item?.product?.id || "#";
  };

  const handleRemove = async () => {
    // Ask for confirmation
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: `¿Estás seguro de eliminar ${getProductName()} de tu carrito?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      reverseButtons: true,
      focusCancel: true,
      position: "center",
    });

    if (result.isConfirmed) {
      setIsRemoving(true);

      try {
        await removeItem(item.id);

        // Show success notification
        Swal.fire({
          title: "Producto eliminado",
          text: "El producto ha sido eliminado de tu carrito",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "bottom-end",
          toast: true,
        });
      } catch (error) {
        console.error("Error removing item:", error);

        // Show error notification
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el producto. Inténtalo de nuevo.",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "bottom-end",
          toast: true,
        });

        setIsRemoving(false);
      }
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    const currentStock = getStock();

    if (newQuantity >= 1) {
      if (newQuantity <= currentStock) {
        setIsUpdating(true);

        try {
          await updateQuantity(item.id, newQuantity);
          setShowStockWarning(false);
        } catch (error) {
          console.error("Error updating quantity:", error);

          // Show error notification
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar la cantidad. Inténtalo de nuevo.",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            position: "bottom-end",
            toast: true,
          });
        } finally {
          setIsUpdating(false);
        }
      } else {
        setShowStockWarning(true);

        // Show stock warning notification
        Swal.fire({
          title: "Stock limitado",
          text: `Solo hay ${currentStock} unidades disponibles`,
          icon: "warning",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "bottom-end",
          toast: true,
          iconColor: "#F59E0B",
        });

        setTimeout(() => setShowStockWarning(false), 3000);
      }
    }
  };

  const handleSaveForLater = () => {
    setIsSaving(true);

    // Simulate saving for later
    setTimeout(() => {
      Swal.fire({
        title: "Guardado",
        text: "Producto guardado para más tarde",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "bottom-end",
        toast: true,
      });

      setIsSaving(false);
    }, 1000);
  };

  // Determine if any loading state is active
  const isLoading = loading || isUpdating;
  const currentQuantity = getQuantity();
  const currentStock = getStock();
  const currentPrice = getPrice();

  // If item is null or undefined, don't render anything
  if (!item) {
    return null;
  }

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
    >
      {/* Stock Warning */}
      <AnimatePresence>
        {showStockWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 right-0 left-0 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs p-2 flex items-center"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Solo hay {currentStock} unidades disponibles
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center z-10"
          >
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-500"
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
              <span className="text-sm text-blue-600 dark:text-blue-500 font-medium">
                Actualizando...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consistent horizontal layout for all screen sizes */}
      <div className="flex gap-4">
        {/* Product image - same size on all devices */}
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
          <Link
            to={`/producto/${getProductId()}`}
            className="block w-full h-full"
          >
            <img
              src={getImageUrl() || "/placeholder.svg"}
              alt={getProductName()}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = "/placeholder.svg?height=200&width=200";
              }}
            />
          </Link>
        </div>

        {/* Product details */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div>
              <Link
                to={`/producto/${getProductId()}`}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors line-clamp-1"
              >
                {getProductName()}
              </Link>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                <span className="inline-flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-1"
                    style={{
                      backgroundColor: getColorHex(),
                    }}
                  ></span>
                  {getColorName()}
                </span>
                <span className="inline-flex items-center">
                  <span className="text-gray-400 mx-1">•</span>
                  Talla: {getSizeName()}
                </span>
                {getBrandName() && (
                  <span className="inline-flex items-center">
                    <span className="text-gray-400 mx-1">•</span>
                    {getBrandName()}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-2 sm:mt-0 text-right">
              <p className="font-medium text-gray-900 dark:text-white">
                ${currentPrice.toFixed(2)}
              </p>
              {currentQuantity > 1 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ${currentPrice.toFixed(2)} x {currentQuantity}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(currentQuantity - 1)}
                disabled={currentQuantity <= 1 || isLoading}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className="mx-3 text-sm font-medium text-gray-900 dark:text-white">
                {currentQuantity}
              </span>

              <button
                onClick={() => handleQuantityChange(currentQuantity + 1)}
                disabled={currentQuantity >= currentStock || isLoading}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>

              {currentQuantity >= currentStock && (
                <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                  Máx.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveForLater}
                disabled={isLoading}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center text-xs disabled:opacity-50"
                aria-label="Save for later"
              >
                <Heart
                  className={`w-4 h-4 mr-1 ${
                    isSaving ? "fill-blue-500 text-blue-500" : ""
                  }`}
                />
                {isSaving ? "Guardado" : "Guardar"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRemove}
                disabled={isLoading}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors flex items-center text-xs disabled:opacity-50"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
