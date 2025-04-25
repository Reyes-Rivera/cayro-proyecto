"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Truck,
  Clock,
  X,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartConrexr";
import CartItem from "@/pages/web/cart/components/cart-item";
import CartSummary from "@/pages/web/cart/components/cart-summary";
import EmptyCart from "@/pages/web/cart/components/empty-cart";
import Swal from "sweetalert2";

export default function CartPage() {
  const { items, clearCart, itemCount } = useCart();
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  // Calculate estimated delivery date (3-5 business days from now)
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // Add 5 days

    // Format date to locale string (e.g., "15 de marzo")
    const formattedDate = deliveryDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });

    setEstimatedDelivery(formattedDate);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle clear cart with confirmation
  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los productos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await clearCart();
        Swal.fire({
          title: "Carrito vacío",
          text: "Se han eliminado todos los productos",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "top-right",
          toast: true,
        });
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  // Toggle mobile summary view
  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
        {isLoading ? (
          <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex items-center justify-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-8">
              <Link
                to="/"
                className="flex items-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Volver</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-500" />
                Mi Carrito
              </h1>
            </div>

            <EmptyCart />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      {isLoading ? (
        <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex items-center justify-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Volver</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-500" />
                Mi Carrito
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleClearCart}
                className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-500"
              >
                Vaciar carrito
              </button>
              <Link
                to="/productos"
                className="text-sm text-blue-600 dark:text-blue-500 hover:underline flex items-center"
              >
                Seguir comprando
              </Link>
            </div>
          </div>

          {/* Cart content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart items */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <h2 className="font-medium text-gray-900 dark:text-white">
                    {itemCount} {itemCount === 1 ? "producto" : "productos"} en
                    tu carrito
                  </h2>

                  {/* Mobile: Show summary button */}
                  <button
                    className="lg:hidden flex items-center text-sm font-medium text-blue-600 dark:text-blue-500"
                    onClick={toggleSummary}
                  >
                    Ver resumen <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <AnimatePresence>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {items.map((item: any) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                </AnimatePresence>

                {/* Estimated Delivery */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      Entrega estimada
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recibe tus productos alrededor del{" "}
                      <span className="font-medium text-blue-600 dark:text-blue-500">
                        {estimatedDelivery}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping info */}
              <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      Información de envío
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Envío estándar: 3-5 días hábiles
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Envío gratis en compras mayores a $100
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      Métodos de pago aceptados
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <div className="w-10 h-6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                      <div className="w-10 h-6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                      <div className="w-10 h-6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                      <div className="w-10 h-6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart summary - Desktop */}
            <div className="hidden lg:block w-full lg:w-1/3">
              <CartSummary />
            </div>

            {/* Mobile summary overlay */}
            <AnimatePresence>
              {showSummary && (
                <motion.div
                  className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSummary(false)}
                >
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl max-h-[80vh] overflow-auto"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                      <h2 className="font-medium text-gray-900 dark:text-white">
                        Resumen de compra
                      </h2>
                      <button onClick={() => setShowSummary(false)}>
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <CartSummary />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile: Fixed checkout button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden z-40">
              <button
                onClick={toggleSummary}
                className="w-full py-3 px-4 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full flex items-center justify-center"
              >
                Ver resumen y pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
