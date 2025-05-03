"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/context/CartConrexr";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContextType";

export default function CartSummary() {
  const { subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate shipping, tax, and total
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal + shipping;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
            onClick={handleCheckout}
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
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Métodos de pago aceptados
          </h3>
          <div className="flex gap-3 mb-3">
            <div className="flex items-center justify-center h-8 px-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
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
            <div className="flex items-center justify-center h-8 px-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
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
            <div className="flex items-center justify-center h-8 px-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
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
            <div className="flex items-center justify-center h-8 px-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
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
          <div className="flex flex-col space-y-2 mt-2">
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
          onClick={handleCheckout}
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
