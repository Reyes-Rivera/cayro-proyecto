"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Clock,
  AlertCircle,
  ArrowRight,
  Home,
  RefreshCw,
  Mail,
  Banknote,
  Building,
} from "lucide-react";
import Loader from "@/components/web-components/Loader";

// Memoized payment type configurations
const PAYMENT_TYPES = {
  ticket: {
    name: "Efectivo",
    message:
      "Tu pago está pendiente. Puedes pagarlo en efectivo en los puntos de pago habilitados.",
    icon: Banknote,
    color: "text-green-600 dark:text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  bank_transfer: {
    name: "Transferencia bancaria",
    message:
      "Tu pago está pendiente. La transferencia bancaria puede tardar hasta 3 días hábiles en procesarse.",
    icon: Building,
    color: "text-blue-600 dark:text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  atm: {
    name: "Cajero automático",
    message:
      "Tu pago está pendiente. Puedes completarlo en cajeros automáticos habilitados.",
    icon: Banknote,
    color: "text-purple-600 dark:text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
  default: {
    name: "Otro método",
    message:
      "Tu pago está siendo procesado. Te notificaremos cuando se complete.",
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
  },
} as const;

// Memoized instructions for each payment type
const PAYMENT_INSTRUCTIONS = {
  ticket: [
    {
      step: 1,
      icon: Mail,
      title: "Guarda el comprobante",
      description:
        "Recibirás un email con el comprobante para pagar en efectivo.",
    },
    {
      step: 2,
      icon: Banknote,
      title: "Realiza el pago",
      description:
        "Dirígete a cualquier punto de pago habilitado (OXXO, 7-Eleven, etc.) y presenta el comprobante.",
    },
  ],
  bank_transfer: [
    {
      step: 1,
      icon: Clock,
      title: "Espera la confirmación",
      description:
        "La transferencia puede tardar hasta 3 días hábiles en procesarse.",
    },
  ],
  atm: [
    {
      step: 1,
      icon: Banknote,
      title: "Completa el pago en cajero",
      description:
        "Dirígete a un cajero automático habilitado y sigue las instrucciones para completar tu pago.",
    },
  ],
  default: [
    {
      step: 1,
      icon: Clock,
      title: "Espera la confirmación",
      description:
        "Tu pago está siendo procesado. Te notificaremos cuando se complete.",
    },
  ],
} as const;

const COMMON_INSTRUCTION = {
  step: "✓",
  icon: CheckCircle,
  title: "Confirmación automática",
  description:
    "Una vez procesado el pago, recibirás una confirmación y comenzaremos a preparar tu pedido.",
};

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function CheckoutPending() {
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
      paymentType: searchParams.get("payment_type_id"),
      merchantOrderId: searchParams.get("merchant_order_id"),
      preferenceId: searchParams.get("preference_id"),
    }),
    [searchParams]
  );

  // Memoized payment type configuration
  const paymentConfig = useMemo(() => {
    return (
      PAYMENT_TYPES[urlParams.paymentType as keyof typeof PAYMENT_TYPES] ||
      PAYMENT_TYPES.default
    );
  }, [urlParams.paymentType]);

  // Initialize payment data
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentData({
        paymentId: urlParams.paymentId,
        status: urlParams.status,
        externalReference: urlParams.externalReference,
        paymentType: urlParams.paymentType,
        merchantOrderId: urlParams.merchantOrderId,
        preferenceId: urlParams.preferenceId,
        message: paymentConfig.message,
        paymentTypeName: paymentConfig.name,
        timestamp: new Date().toISOString(),
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [urlParams, paymentConfig]);

  // Memoized navigation handlers
  const handleViewOrders = useCallback(() => {
    navigate("/pedidos", { replace: true });
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleGoHome = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const handleContactSupport = useCallback(() => {
    navigate("/contacto", { replace: true });
  }, [navigate]);

  // Memoized instructions based on payment type
  const instructions = useMemo(() => {
    const typeInstructions =
      PAYMENT_INSTRUCTIONS[
        urlParams.paymentType as keyof typeof PAYMENT_INSTRUCTIONS
      ] || PAYMENT_INSTRUCTIONS.default;
    return [...typeInstructions, COMMON_INSTRUCTION];
  }, [urlParams.paymentType]);

  // Memoized header section
  const HeaderSection = useMemo(
    () => (
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
          aria-hidden="true"
        >
          <Clock className="w-12 h-12 text-yellow-600 dark:text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pago pendiente
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {paymentData?.message || PAYMENT_TYPES.default.message}
        </p>
      </div>
    ),
    [paymentData?.message]
  );

  // Memoized payment details
  const PaymentDetails = useMemo(() => {
    if (!paymentData) return null;

    const details = [
      { label: "ID de Pago", value: paymentData.paymentId },
      { label: "Referencia", value: paymentData.externalReference },
      { label: "Orden de Venta", value: paymentData.merchantOrderId },
      { label: "Preferencia", value: paymentData.preferenceId },
    ].filter((detail) => detail.value);

    return (
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-800 mb-8"
        role="region"
        aria-label="Detalles del pago pendiente"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle
              className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-500"
              aria-hidden="true"
            />
            <h2 className="text-lg font-medium text-yellow-600 dark:text-yellow-500">
              Detalles del pago
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Información de tu transacción pendiente
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
            <div role="listitem">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Estado
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Pendiente
              </span>
            </div>
            <div role="listitem">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Método de pago
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {paymentData.paymentTypeName}
              </p>
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
  }, [paymentData]);

  // Memoized instructions section
  const InstructionsSection = useMemo(
    () => (
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8"
        role="region"
        aria-label="Instrucciones para completar el pago"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Clock
              className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500"
              aria-hidden="true"
            />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              ¿Qué hacer ahora?
            </h2>
          </div>

          <div className="space-y-4" role="list">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start" role="listitem">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 ${
                      instruction.step === "✓"
                        ? "bg-green-100 dark:bg-green-900/20"
                        : "bg-blue-100 dark:bg-blue-900/20"
                    } rounded-full flex items-center justify-center`}
                    aria-hidden="true"
                  >
                    <span
                      className={`text-sm font-medium ${
                        instruction.step === "✓"
                          ? "text-green-600 dark:text-green-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {instruction.step}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <instruction.icon
                      className="w-4 h-4 mr-2"
                      aria-hidden="true"
                    />
                    {instruction.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {instruction.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    [instructions]
  );

  // Memoized action buttons
  const ActionButtons = useMemo(
    () => (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleViewOrders}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Ver el estado de mis pedidos"
        >
          Ver estado del pedido
          <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
        </button>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          aria-label="Actualizar el estado del pago"
        >
          <RefreshCw className="mr-2 w-4 h-4" aria-hidden="true" />
          Actualizar estado
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
    [handleViewOrders, handleRefresh, handleGoHome]
  );

  // Memoized support info
  const SupportInfo = useMemo(
    () => (
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ¿Tienes dudas sobre tu pago?{" "}
          <button
            onClick={handleContactSupport}
            className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label="Contactar al soporte técnico"
          >
            Contáctanos
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
      aria-label="Página de pago pendiente"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {HeaderSection}
        {PaymentDetails}
        {InstructionsSection}
        {ActionButtons}
        {SupportInfo}
      </div>
    </div>
  );
}
