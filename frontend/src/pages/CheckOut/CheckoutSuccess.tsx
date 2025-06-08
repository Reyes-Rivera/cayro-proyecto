"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Obtener parámetros de MercadoPago
    const paymentId =
      searchParams.get("payment_id") || searchParams.get("collection_id");
    const status =
      searchParams.get("collection_status") || searchParams.get("status");
    const externalReference = searchParams.get("external_reference");
    const merchantOrderId = searchParams.get("merchant_order_id");

    // Obtener datos guardados del checkout
    const savedTotal = localStorage.getItem("checkout_total");
    const savedSubtotal = localStorage.getItem("checkout_subtotal");
    const savedShipping = localStorage.getItem("checkout_shipping");

    setPaymentData({
      paymentId,
      status,
      externalReference,
      merchantOrderId,
      total: savedTotal ? Number.parseFloat(savedTotal) : 0,
      subtotal: savedSubtotal ? Number.parseFloat(savedSubtotal) : 0,
      shipping: savedShipping ? Number.parseFloat(savedShipping) : 0,
    });

    // Limpiar datos del localStorage después de un tiempo
    setTimeout(() => {
      localStorage.removeItem("checkout_total");
      localStorage.removeItem("checkout_subtotal");
      localStorage.removeItem("checkout_shipping");
    }, 5000);
  }, [searchParams]);

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleViewOrders = () => {
    navigate("/profile/orders");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Header con ícono de éxito */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ¡Pago exitoso!
            </h1>
            <p className="text-green-100 text-lg">
              Tu pedido ha sido procesado correctamente
            </p>
          </div>

          {/* Contenido principal */}
          <div className="px-8 py-8">
            {paymentData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Información del pago */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Detalles del pago
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        ID de pago:
                      </span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {paymentData.paymentId}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Estado:
                      </span>
                      <p className="font-medium text-green-600 dark:text-green-400 capitalize">
                        {paymentData.status}
                      </p>
                    </div>
                    {paymentData.externalReference && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Referencia:
                        </span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {paymentData.externalReference}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen del pedido */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Resumen del pedido
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Subtotal:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${paymentData.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Envío:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${paymentData.shipping.toFixed(2)}
                      </span>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900 dark:text-white">
                        Total:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${paymentData.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información de seguimiento */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        ¿Qué sigue?
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>
                          • Recibirás un email de confirmación en los próximos
                          minutos
                        </li>
                        <li>• Tu pedido será procesado en 1-2 días hábiles</li>
                        <li>• Te notificaremos cuando tu pedido sea enviado</li>
                        <li>• Podrás rastrear tu envío desde tu perfil</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Botones de acción */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <button
                onClick={handleViewOrders}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                Ver mis pedidos
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={handleContinueShopping}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Seguir comprando
              </button>
              <button
                onClick={handleGoHome}
                className="sm:w-auto bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Inicio
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

