"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Clock, AlertCircle, Home, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPending() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [pendingData, setPendingData] = useState<any>(null);

  useEffect(() => {
    // Obtener parámetros de MercadoPago
    const paymentId =
      searchParams.get("payment_id") || searchParams.get("collection_id");
    const status =
      searchParams.get("collection_status") || searchParams.get("status");
    const externalReference = searchParams.get("external_reference");
    const paymentType = searchParams.get("payment_type");

    setPendingData({
      paymentId,
      status,
      externalReference,
      paymentType,
    });
  }, [searchParams]);

  const handleViewOrders = () => {
    navigate("/profile/orders");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const getPendingMessage = (paymentType: string) => {
    switch (paymentType) {
      case "bank_transfer":
        return "Tu transferencia bancaria está siendo procesada";
      case "ticket":
        return "Tu pago en efectivo está pendiente de confirmación";
      case "atm":
        return "Tu pago en cajero automático está siendo verificado";
      default:
        return "Tu pago está siendo procesado";
    }
  };

  const getPendingInstructions = (paymentType: string) => {
    switch (paymentType) {
      case "bank_transfer":
        return [
          "La transferencia puede tardar hasta 2 días hábiles en procesarse",
          "Recibirás una confirmación por email cuando se complete",
          "No es necesario que hagas nada más",
        ];
      case "ticket":
        return [
          "Debes realizar el pago en el punto de pago seleccionado",
          "Tienes hasta 3 días para completar el pago",
          "Una vez pagado, recibirás la confirmación por email",
        ];
      case "atm":
        return [
          "Completa el pago en el cajero automático",
          "Usa el código de pago que te enviamos por email",
          "El pago se confirmará automáticamente",
        ];
      default:
        return [
          "Tu pago está siendo verificado",
          "Recibirás una confirmación por email",
          "El proceso puede tardar unos minutos",
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Header con ícono de pendiente */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6"
            >
              <Clock className="w-12 h-12 text-yellow-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Pago pendiente
            </h1>
            <p className="text-yellow-100 text-lg">
              Tu pago está siendo procesado
            </p>
          </div>

          {/* Contenido principal */}
          <div className="px-8 py-8">
            {pendingData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Información del pago pendiente */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
                    Estado del pago
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                    {getPendingMessage(pendingData.paymentType)}
                  </p>
                  {pendingData.paymentId && (
                    <div className="text-sm">
                      <span className="text-yellow-600 dark:text-yellow-400">
                        ID de pago:
                      </span>
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">
                        {pendingData.paymentId}
                      </p>
                    </div>
                  )}
                </div>

                {/* Instrucciones */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                    ¿Qué sigue?
                  </h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    {getPendingInstructions(pendingData.paymentType).map(
                      (instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {instruction}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Información adicional */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Información importante
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Tu pedido ha sido registrado correctamente</li>
                    <li>• Recibirás actualizaciones por email</li>
                    <li>• Puedes consultar el estado en tu perfil</li>
                    <li>• El pedido se procesará una vez confirmado el pago</li>
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
                onClick={handleViewOrders}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                Ver mis pedidos
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={handleGoHome}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir al inicio
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
