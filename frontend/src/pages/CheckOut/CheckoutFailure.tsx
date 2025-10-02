"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  XCircle,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Home,
  MessageCircle,
  CreditCard,
  DollarSign,
} from "lucide-react";
import Loader from "@/components/web-components/Loader";

// Memoized error messages mapping
const ERROR_MESSAGES: Record<string, string> = {
  cc_rejected_insufficient_amount: "Fondos insuficientes en tu tarjeta",
  cc_rejected_bad_filled_security_code: "Código de seguridad incorrecto",
  cc_rejected_bad_filled_date: "Fecha de vencimiento incorrecta",
  cc_rejected_bad_filled_other: "Revisa los datos de tu tarjeta",
  cc_rejected_high_risk: "Pago rechazado por seguridad",
  cc_rejected_card_disabled: "Tarjeta deshabilitada",
  cc_rejected_card_error: "Error en la tarjeta",
  cc_rejected_duplicated_payment: "Pago duplicado",
  pending_contingency: "Pago pendiente de revisión",
  pending_review_manual: "Pago en revisión manual",
  default: "Hubo un problema procesando tu pago",
};

// Memoized solutions data
const SOLUTIONS = [
  {
    step: 1,
    icon: CreditCard,
    title: "Verifica los datos de tu tarjeta",
    description:
      "Asegúrate de que el número, fecha de vencimiento y código de seguridad sean correctos.",
  },
  {
    step: 2,
    icon: DollarSign,
    title: "Verifica tu saldo disponible",
    description:
      "Confirma que tienes fondos suficientes o límite de crédito disponible.",
  },
  {
    step: 3,
    icon: RefreshCw,
    title: "Prueba con otro método de pago",
    description: "Intenta con otra tarjeta o método de pago disponible.",
  },
] as const;

export default function CheckoutFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Memoized URL parameters
  const urlParams = useMemo(
    () => ({
      paymentId: searchParams.get("payment_id"),
      status: searchParams.get("status"),
      externalReference: searchParams.get("external_reference"),
      statusDetail: searchParams.get("status_detail"),
      merchantOrderId: searchParams.get("merchant_order_id"),
      preferenceId: searchParams.get("preference_id"),
    }),
    [searchParams]
  );

  // Memoized error message getter
  const getErrorMessage = useCallback(
    (status: string | null, statusDetail: string | null) => {
      if (
        status === "rejected" ||
        status === "cancelled" ||
        status === "failed"
      ) {
        return ERROR_MESSAGES[statusDetail || ""] || ERROR_MESSAGES.default;
      }
      if (status === "pending") {
        return "Tu pago está pendiente de confirmación";
      }
      if (status === "in_process") {
        return "Tu pago está siendo procesado";
      }
      return ERROR_MESSAGES.default;
    },
    []
  );

  // Initialize payment data
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentData({
        paymentId: urlParams.paymentId,
        status: urlParams.status,
        externalReference: urlParams.externalReference,
        statusDetail: urlParams.statusDetail,
        merchantOrderId: urlParams.merchantOrderId,
        preferenceId: urlParams.preferenceId,
        errorMessage: getErrorMessage(urlParams.status, urlParams.statusDetail),
        timestamp: new Date().toISOString(),
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [urlParams, getErrorMessage]);

  // Memoized navigation handlers
  const handleRetryCheckout = useCallback(() => {
    navigate("/checkout", { replace: true });
  }, [navigate]);

  const handleBackToCart = useCallback(() => {
    navigate("/carrito", { replace: true });
  }, [navigate]);

  const handleGoHome = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const handleContactSupport = useCallback(() => {
    navigate("/contacto", { replace: true });
  }, [navigate]);

  // Memoized status display
  const statusDisplay = useMemo(() => {
    if (!paymentData?.status) return null;

    const statusConfig = {
      rejected: {
        label: "Rechazado",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
      cancelled: {
        label: "Cancelado",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
      failed: {
        label: "Fallido",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
      pending: {
        label: "Pendiente",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      in_process: {
        label: "En proceso",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      default: {
        label: "Error",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      },
    };

    const config =
      statusConfig[paymentData.status as keyof typeof statusConfig] ||
      statusConfig.default;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  }, [paymentData?.status]);

  // Memoized error header
  const ErrorHeader = useMemo(
    () => (
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
          aria-hidden="true"
        >
          <XCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pago no procesado
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {paymentData?.errorMessage || ERROR_MESSAGES.default}
        </p>
      </div>
    ),
    [paymentData?.errorMessage]
  );

  // Memoized error details
  const ErrorDetails = useMemo(() => {
    if (!paymentData) return null;

    const details = [
      { label: "ID de Pago", value: paymentData.paymentId },
      { label: "Referencia", value: paymentData.externalReference },
      { label: "Orden de Venta", value: paymentData.merchantOrderId },
      { label: "Preferencia", value: paymentData.preferenceId },
      { label: "Código de error", value: paymentData.statusDetail },
    ].filter((detail) => detail.value);

    if (details.length === 0) return null;

    return (
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-red-200 dark:border-red-800 mb-8"
        role="region"
        aria-label="Detalles del error de pago"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle
              className="w-5 h-5 mr-2 text-red-600 dark:text-red-500"
              aria-hidden="true"
            />
            <h2 className="text-lg font-medium text-red-600 dark:text-red-500">
              Detalles del error
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Información técnica sobre el problema ocurrido
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
            <div role="listitem">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Estado
              </p>
              {statusDisplay}
            </div>
            {details.map((detail, index) => (
              <div key={index} role="listitem">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {detail.label}
                </p>
                <p
                  className="text-sm text-gray-900 dark:text-white font-mono break-all"
                  aria-label={`${detail.label}: ${detail.value}`}
                >
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }, [paymentData, statusDisplay]);

  // Memoized solutions section
  const SolutionsSection = useMemo(
    () => (
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8"
        role="region"
        aria-label="Soluciones sugeridas"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <RefreshCw
              className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500"
              aria-hidden="true"
            />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              ¿Qué puedes hacer?
            </h2>
          </div>

          <div className="space-y-4" role="list">
            {SOLUTIONS.map((solution) => (
              <div
                key={solution.step}
                className="flex items-start"
                role="listitem"
              >
                <div className="flex-shrink-0">
                  <div
                    className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {solution.step}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <solution.icon
                      className="w-4 h-4 mr-2"
                      aria-hidden="true"
                    />
                    {solution.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {solution.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    []
  );

  // Memoized action buttons
  const ActionButtons = useMemo(
    () => (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleRetryCheckout}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Intentar el pago nuevamente"
        >
          <RefreshCw className="mr-2 w-4 h-4" aria-hidden="true" />
          Intentar de nuevo
        </button>

        <button
          onClick={handleBackToCart}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          aria-label="Volver al carrito de compras"
        >
          <ArrowLeft className="mr-2 w-4 h-4" aria-hidden="true" />
          Volver al carrito
        </button>

        <button
          onClick={handleGoHome}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          aria-label="Ir a la página de inicio"
        >
          <Home className="mr-2 w-4 h-4" aria-hidden="true" />
          Ir al inicio
        </button>
      </div>
    ),
    [handleRetryCheckout, handleBackToCart, handleGoHome]
  );

  // Memoized support info
  const SupportInfo = useMemo(
    () => (
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ¿Sigues teniendo problemas?{" "}
          <button
            onClick={handleContactSupport}
            className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label="Contactar al soporte técnico"
          >
            <MessageCircle className="w-4 h-4 inline mr-1" aria-hidden="true" />
            Contáctanos para ayudarte
          </button>
        </p>
      </div>
    ),
    [handleContactSupport]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-950 py-24"
      role="main"
      aria-label="Página de error de pago"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {ErrorHeader}
        {ErrorDetails}
        {SolutionsSection}
        {ActionButtons}
        {SupportInfo}
      </div>
    </div>
  );
}
