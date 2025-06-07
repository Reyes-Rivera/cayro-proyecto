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
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartItem from "@/pages/web/cart/components/cart-item";
import CartSummary from "@/pages/web/cart/components/cart-summary";
import EmptyCart from "@/pages/web/cart/components/empty-cart";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContextType";
import Loader from "@/components/web-components/Loader";

export default function CartPage() {
  const { items, clearCart, itemCount } = useCart();
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Calculate subtotal if not available from useCart hook
  console.log(items);

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

  const handleCheckout = () => {
    if (!user) {
      Swal.fire({
        title: "Iniciar sesión",
        text: "Debes iniciar sesión para continuar con el pago",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3B82F6",
        cancelButtonColor: "#6B7280",
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login page with return URL
          navigate("/login?redirect=/cart");
        }
      });
    } else {
      // Proceed to checkout
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        {isLoading ? (
          <Loader />
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
        <Loader />
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
            </div>

            {/* Cart summary - Desktop */}
            <div className="hidden lg:block w-full lg:w-1/3">
              <CartSummary />
              {/* Shipping info */}
              <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      Información de envío
                    </h3>
                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <p>• 1-5 productos: $200</p>
                      <p>• 6-10 productos: $250</p>
                      <p>• 11-15 productos: $300</p>
                      <p>• 16-20 productos: $350</p>
                      <p>• 21-25 productos: $400</p>
                      <p>• +25 productos: +$50 por cada 5 adicionales</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Tiempo de entrega: 3-5 días hábiles
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
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="flex items-center justify-center h-8 px-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <svg
                          className="h-5"
                          viewBox="0 0 60 25"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M60 10.4c0-4-3.5-7.4-7.8-7.4H7.8C3.5 3 0 6.4 0 10.4c0 4 3.5 7.4 7.8 7.4h44.4c4.3 0 7.8-3.4 7.8-7.4z"
                            fill="#635BFF"
                          />
                          <path
                            d="M18.9 10.5l-1.6-1.2-.4 1.2h-1.3l1.9-4.3h1.5l1.9 4.3h-1.3l-.4-1.2-1.6 1.2h1.3zm-.8-1.9l-.5-1.2-.5 1.2h1zm4.2 1.9v-4.3h1.3v4.3h-1.3zm6.2 0l-1-1.7-.5.6v1.1h-1.3v-4.3h1.3v1.7l1.4-1.7h1.5l-1.7 2 1.8 2.3h-1.5zm4.5 0v-3h-1.1v-1.3h3.5v1.3h-1.1v3h-1.3zm5.2.1c-1.3 0-2.2-.9-2.2-2.2 0-1.3.9-2.2 2.2-2.2 1.3 0 2.2.9 2.2 2.2 0 1.3-.9 2.2-2.2 2.2zm0-1.2c.5 0 .9-.4.9-1s-.4-1-.9-1c-.5 0-.9.4-.9 1s.4 1 .9 1zm5.3 1.1v-4.3h1.3v3h1.7v1.3h-3z"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center justify-center h-8 px-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <svg
                          className="h-4"
                          viewBox="0 0 780 500"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M40,0h700c22.1,0,40,17.9,40,40v420c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40C0,17.9,17.9,0,40,0z"
                            fill="#252525"
                          />
                          <path
                            d="M415.5,158.1v27.2h-16.6v67.9h-30.2v-67.9h-16.6v-27.2H415.5z M432.5,158.1h27.2l16.6,48.3l16.6-48.3h27.2v95.1h-27.2v-48.3l-16.6,48.3h-16.6l-16.6-48.3v48.3h-10.6V158.1z M552.8,158.1v95.1h-30.2v-95.1H552.8z M613.1,158.1c10.6,0,21.2,10.6,21.2,21.2v52.9c0,10.6-10.6,21.2-21.2,21.2h-42.5v-95.1h42.5V158.1z M602.5,184.1v42.5h10.6v-42.5H602.5z"
                            fill="#fff"
                          />
                          <path
                            d="M165.3,158.1l32.6,95.1h-32.6l-4.8-15.9h-26.6l-4.8,15.9H96.5l31.9-95.1H165.3z M154.7,211.7l-9.5-31.9l-9.5,31.9H154.7z"
                            fill="#fff"
                          />
                          <path
                            d="M239.3,200.7c11.3,0,21.2,9.9,21.2,21.2c0,11.3-9.9,21.2-21.2,21.2s-21.2-9.9-21.2-21.2C218.1,210.6,228,200.7,239.3,200.7z"
                            fill="#FF5F00"
                          />
                          <path
                            d="M239.3,208.8c7.3,0,13.1,5.9,13.1,13.1c0,7.3-5.9,13.1-13.1,13.1s-13.1-5.9-13.1-13.1C226.2,214.6,232.1,208.8,239.3,208.8z"
                            fill="#EB001B"
                          />
                          <path
                            d="M292.3,200.7c11.3,0,21.2,9.9,21.2,21.2c0,11.3-9.9,21.2-21.2,21.2s-21.2-9.9-21.2-21.2C271.1,210.6,280.9,200.7,292.3,200.7z"
                            fill="#FF5F00"
                          />
                          <path
                            d="M292.3,208.8c7.3,0,13.1,5.9,13.1,13.1c0,7.3-5.9,13.1-13.1,13.1s-13.1-5.9-13.1-13.1C279.1,214.6,285,208.8,292.3,208.8z"
                            fill="#EB001B"
                          />
                          <path
                            d="M265.8,221.9c0-10.6,4.8-19.9,12.4-25.9c-5.9-4.8-13.1-7.3-21.2-7.3c-19.9,0-35.8,15.9-35.8,35.8s15.9,35.8,35.8,35.8c8.1,0,15.3-2.6,21.2-7.3C270.6,241.8,265.8,232.5,265.8,221.9z"
                            fill="#F79E1B"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center justify-center h-8 px-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <svg
                          className="h-3"
                          viewBox="0 0 780 500"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M40,0h700c22.1,0,40,17.9,40,40v420c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40C0,17.9,17.9,0,40,0z"
                            fill="#0E4595"
                          />
                          <path
                            d="M293.2,348.7l33.4-195.2h53.1l-33.1,195.2H293.2L293.2,348.7z"
                            fill="#fff"
                          />
                          <path
                            d="M518.9,158.9c-10.6-3.9-27.1-8.1-47.7-8.1c-52.4,0-89.3,26.5-89.6,64.4c-0.3,28.1,26.3,43.7,46.4,53.1c20.7,9.6,27.6,15.7,27.5,24.3c-0.1,13.1-16.5,19.1-31.7,19.1c-21.2,0-32.4-2.9-49.9-10.1l-6.8-3.1l-7.4,43.4c12.3,5.4,35.2,10.1,58.9,10.3c55.4,0,91.5-26.2,91.9-66.7c0.2-22.2-14-39.2-44.8-53.1c-18.7-9-30.1-15-30-24.1c0-8.1,9.6-16.7,30.3-16.7c17.3-0.3,29.9,3.5,39.6,7.4l4.8,2.2L518.9,158.9L518.9,158.9z"
                            fill="#fff"
                          />
                          <path
                            d="M615.5,153.5h-41.2c-12.8,0-22.3,3.5-27.9,16.2l-79.2,179h56c0,0,9.2-24.1,11.2-29.4c6.1,0,60.6,0.1,68.3,0.1c1.6,6.9,6.5,29.3,6.5,29.3h49.5L615.5,153.5L615.5,153.5z M547.9,287.1c4.4-11.3,21.3-54.7,21.3-54.7c-0.3,0.5,4.4-11.3,7.1-18.7l3.6,16.9c0,0,10.2,46.7,12.4,56.5L547.9,287.1L547.9,287.1z"
                            fill="#fff"
                          />
                          <path
                            d="M187.4,153.5l-52.6,133.6l-5.6-27.3c-9.8-31.5-40.3-65.7-74.4-82.7l48.1,171.5h56.8l84.5-195.2H187.4L187.4,153.5z"
                            fill="#fff"
                          />
                          <path
                            d="M131.3,153.5H45.8l-0.7,4.2c66.7,16.1,110.9,55,129.2,101.7L156.8,170C154.4,158.6,144.4,154.1,131.3,153.5L131.3,153.5z"
                            fill="#F2AE14"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center justify-center h-8 px-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <svg
                          className="h-4"
                          viewBox="0 0 780 500"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M40,0h700c22.1,0,40,17.9,40,40v420c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40C0,17.9,17.9,0,40,0z"
                            fill="#4D4D4D"
                          />
                          <path
                            d="M415.1,158.1c-27.2,0-48.3,21.2-48.3,48.3c0,27.2,21.2,48.3,48.3,48.3c27.2,0,48.3-21.2,48.3-48.3C463.4,179.3,442.3,158.1,415.1,158.1z"
                            fill="#5F6368"
                          />
                          <path
                            d="M415.1,228.4c-12.4,0-22.1-9.7-22.1-22.1c0-12.4,9.7-22.1,22.1-22.1c12.4,0,22.1,9.7,22.1,22.1C437.2,218.7,427.5,228.4,415.1,228.4z"
                            fill="#EB001B"
                          />
                          <path
                            d="M550.9,228.4c-12.4,0-22.1-9.7-22.1-22.1c0-12.4,9.7-22.1,22.1-22.1c12.4,0,22.1,9.7,22.1,22.1C573,218.7,563.3,228.4,550.9,228.4z"
                            fill="#F79E1B"
                          />
                          <path
                            d="M483,206.3c0-12.4,5.5-23.5,14.2-31c-7.9-6.3-18-10.1-29-10.1c-25.6,0-46.3,20.7-46.3,46.3c0,25.6,20.7,46.3,46.3,46.3c11,0,21.1-3.8,29-10.1C488.5,229.8,483,218.7,483,206.3z"
                            fill="#EB001B"
                          />
                          <path
                            d="M529.4,206.3c0,25.6-20.7,46.3-46.3,46.3c-11,0-21.1-3.8-29-10.1c8.7-7.5,14.2-18.6,14.2-31c0-12.4-5.5-23.5-14.2-31c7.9-6.3,18-10.1,29-10.1C508.7,160,529.4,180.7,529.4,206.3z"
                            fill="#F79E1B"
                          />
                          <path
                            d="M550.9,160c-27.2,0-48.3,21.2-48.3,48.3c0,27.2,21.2,48.3,48.3,48.3c27.2,0,48.3-21.2,48.3-48.3C599.2,179.3,578.1,160,550.9,160z"
                            fill="#5F6368"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Procesado de forma segura por Stripe
                    </p>
                  </div>
                </div>
              </div>
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
                      <CartSummary  />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile: Fixed checkout button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden z-40">
              <button
                onClick={handleCheckout}
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
