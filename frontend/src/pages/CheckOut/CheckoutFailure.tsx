"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorData, setErrorData] = useState<any>(null);

  useEffect(() => {
    // Obtener parámetros de error de MercadoPago
    const paymentId =
      searchParams.get("payment_id") || searchParams.get("collection_id");
    const status =
      searchParams.get("collection_status") || searchParams.get("status");
    const statusDetail = searchParams.get("status_detail");
    const externalReference = searchParams.get("external_reference");

    setErrorData({
      paymentId,
      status,
      statusDetail,
      externalReference,
    });
  }, [searchParams]);

  const handleRetryPayment = () => {
    navigate("/checkout");
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const getErrorMessage = (status: string, statusDetail: string) => {
    switch (status) {
      case "rejected":
        switch (statusDetail) {
          case "cc_rejected_insufficient_amount":
            return "Fondos insuficientes en tu tarjeta";
          case "cc_rejected_bad_filled_security_code":
            return "Código de seguridad incorrecto";
          case "cc_rejected_bad_filled_date":
            return "Fecha de vencimiento incorrecta";
          case "cc_rejected_bad_filled_other":
            return "Revisa los datos de tu tarjeta";
          default:
            return "El pago fue rechazado por tu banco";
        }
      case "cancelled":
        return "El pago fue cancelado";
      case "in_process":
        return "El pago está siendo procesado";
      default:
        return "Hubo un problema con tu pago";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Header con ícono de error */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6"
            >
              <XCircle className="w-12 h-12 text-red-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Pago no procesado
            </h1>
            <p className="text-red-100 text-lg">Hubo un problema con tu pago</p>
          </div>

          {/* Contenido principal */}
          <div className="px-8 py-8">
            {errorData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Información del error */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
                    Detalles del error
                  </h3>
                  <div className="space-y-3">
                    <p className="text-red-800 dark:text-red-200">
                      {getErrorMessage(
                        errorData.status,
                        errorData.statusDetail
                      )}
                    </p>
                    {errorData.paymentId && (
                      <div className="text-sm">
                        <span className="text-red-600 dark:text-red-400">
                          ID de referencia:
                        </span>
                        <p className="font-medium text-red-900 dark:text-red-100">
                          {errorData.paymentId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sugerencias */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    ¿Qué puedes hacer?
                  </h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Verifica que los datos de tu tarjeta sean correctos
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Asegúrate de tener fondos suficientes
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Contacta a tu banco si el problema persiste
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Intenta con otro método de pago
                    </li>
                  </ul>
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
                onClick={handleRetryPayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </button>
              <button
                onClick={handleGoToCart}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al carrito
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
