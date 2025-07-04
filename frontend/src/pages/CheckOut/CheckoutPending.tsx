"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Clock, AlertCircle, ArrowRight, Home, RefreshCw } from "lucide-react";

export default function CheckoutPending() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Obtener parámetros de MercadoPago
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const externalReference = searchParams.get("external_reference");
  const paymentType = searchParams.get("payment_type_id");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentData({
        paymentId,
        status,
        externalReference,
        paymentType,
        message: getPendingMessage(paymentType),
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [paymentId, status, externalReference, paymentType]);

  const getPendingMessage = (paymentType: string | null) => {
    switch (paymentType) {
      case "ticket":
        return "Tu pago está pendiente. Puedes pagarlo en efectivo en los puntos de pago habilitados.";
      case "bank_transfer":
        return "Tu pago está pendiente. La transferencia bancaria puede tardar hasta 3 días hábiles en procesarse.";
      case "atm":
        return "Tu pago está pendiente. Puedes completarlo en cajeros automáticos habilitados.";
      default:
        return "Tu pago está siendo procesado. Te notificaremos cuando se complete.";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 relative mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-yellow-600 dark:border-t-yellow-500 border-gray-200 dark:border-gray-800 animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Verificando el estado del pago...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pending Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-12 h-12 text-yellow-600 dark:text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pago pendiente
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {paymentData?.message || "Tu pago está siendo procesado"}
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-800 mb-8">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-500" />
              <h2 className="text-lg font-medium text-yellow-600 dark:text-yellow-500">
                Detalles del pago
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Información de tu transacción pendiente
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentData?.paymentId && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ID de Pago
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                    {paymentData.paymentId}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Estado
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  Pendiente
                </span>
              </div>
              {paymentData?.externalReference && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Referencia
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                    {paymentData.externalReference}
                  </p>
                </div>
              )}
              {paymentData?.paymentType && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Método de pago
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {paymentData.paymentType === "ticket"
                      ? "Efectivo"
                      : paymentData.paymentType === "bank_transfer"
                      ? "Transferencia bancaria"
                      : paymentData.paymentType === "atm"
                      ? "Cajero automático"
                      : "Otro"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                ¿Qué hacer ahora?
              </h2>
            </div>

            <div className="space-y-4">
              {paymentData?.paymentType === "ticket" && (
                <>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          1
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Guarda el comprobante
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recibirás un email con el comprobante para pagar en
                        efectivo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          2
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Realiza el pago
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Dirígete a cualquier punto de pago habilitado (OXXO,
                        7-Eleven, etc.) y presenta el comprobante.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {paymentData?.paymentType === "bank_transfer" && (
                <>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          1
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Espera la confirmación
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        La transferencia puede tardar hasta 3 días hábiles en
                        procesarse.
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      ✓
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Confirmación automática
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Una vez procesado el pago, recibirás una confirmación y
                    comenzaremos a preparar tu pedido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/pedidos")}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Ver estado del pedido
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            Actualizar estado
          </button>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Home className="mr-2 w-4 h-4" />
            Ir al inicio
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Tienes dudas sobre tu pago?{" "}
            <button
              onClick={() => navigate("/contacto")}
              className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 underline"
            >
              Contáctanos
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
