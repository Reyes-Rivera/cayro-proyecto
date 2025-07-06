"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  XCircle,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Home,
} from "lucide-react";
import Loader from "@/components/web-components/Loader";

export default function CheckoutFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Obtener parámetros de MercadoPago
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const externalReference = searchParams.get("external_reference");
  const statusDetail = searchParams.get("status_detail");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentData({
        paymentId,
        status,
        externalReference,
        statusDetail,
        errorMessage: getErrorMessage(status, statusDetail),
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [paymentId, status, externalReference, statusDetail]);

  const getErrorMessage = (
    status: string | null,
    statusDetail: string | null
  ) => {
    if (status === "rejected") {
      switch (statusDetail) {
        case "cc_rejected_insufficient_amount":
          return "Fondos insuficientes en tu tarjeta";
        case "cc_rejected_bad_filled_security_code":
          return "Código de seguridad incorrecto";
        case "cc_rejected_bad_filled_date":
          return "Fecha de vencimiento incorrecta";
        case "cc_rejected_bad_filled_other":
          return "Revisa los datos de tu tarjeta";
        case "cc_rejected_high_risk":
          return "Pago rechazado por seguridad";
        default:
          return "El pago fue rechazado por el banco";
      }
    }
    return "Hubo un problema procesando tu pago";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pago no procesado
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {paymentData?.errorMessage || "Hubo un problema con tu pago"}
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-red-200 dark:border-red-800 mb-8">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600 dark:text-red-500" />
              <h2 className="text-lg font-medium text-red-600 dark:text-red-500">
                Detalles del error
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Información sobre el problema ocurrido
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  {paymentData?.status === "rejected" ? "Rechazado" : "Error"}
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
              {paymentData?.statusDetail && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Código de error
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                    {paymentData.statusDetail}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Solutions Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                ¿Qué puedes hacer?
              </h2>
            </div>

            <div className="space-y-4">
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
                    Verifica los datos de tu tarjeta
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Asegúrate de que el número, fecha de vencimiento y código de
                    seguridad sean correctos.
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
                    Verifica tu saldo disponible
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Confirma que tienes fondos suficientes o límite de crédito
                    disponible.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      3
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Prueba con otro método de pago
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Intenta con otra tarjeta o método de pago disponible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/checkout")}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            Intentar de nuevo
          </button>

          <button
            onClick={() => navigate("/carrito")}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Volver al carrito
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
            ¿Sigues teniendo problemas?{" "}
            <button
              onClick={() => navigate("/contacto")}
              className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 underline"
            >
              Contáctanos para ayudarte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
