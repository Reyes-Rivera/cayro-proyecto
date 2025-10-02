"use client";
import { useCallback, useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Info,
  Lock,
  AlertCircle,
  Shield,
} from "lucide-react";
import { AlertHelper } from "@/utils/alert.util";

const apiUrl = import.meta.env.VITE_REACT_APP_MERCADOPAGO_PUBLIC_KEY;

interface PaymentSectionProps {
  preferenceId: string;
  isLoadingPayment: boolean;
  paymentError: string;
  onPaymentError: (errorMessage: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  total: number;
  onBack: () => void;
}

// Memoized payment methods data
const PAYMENT_METHODS = [
  {
    id: "visa",
    name: "VISA",
    description: "Tarjetas de crédito/débito",
    color: "bg-blue-600",
    textColor: "text-white",
  },
  {
    id: "mastercard",
    name: "MC",
    description: "Mastercard",
    color: "bg-red-600",
    textColor: "text-white",
  },
  {
    id: "cash",
    name: "$",
    description: "Efectivo",
    color: "bg-green-600",
    textColor: "text-white",
  },
  {
    id: "spei",
    name: "SPEI",
    description: "Transferencia",
    color: "bg-purple-600",
    textColor: "text-white",
  },
] as const;

const INSTRUCTIONS = [
  "Al hacer clic serás redirigido a MercadoPago",
  "Completa tu pago en la plataforma segura de MercadoPago",
  "Serás redirigido de vuelta automáticamente",
];

export default function PaymentSection({
  preferenceId,
  isLoadingPayment,
  paymentError,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  total,
  onBack,
}: PaymentSectionProps) {
  const [redirecting, setRedirecting] = useState(false);

  // Memoized total display
  const totalDisplay = useMemo(() => total.toFixed(2), [total]);

  // Memoized checkout URL
  const checkoutUrl = useMemo(() => {
    if (!preferenceId) return null;

    const isProduction = !apiUrl?.startsWith("TEST-");
    const baseUrl = isProduction
      ? "https://www.mercadopago.com.mx"
      : "https://sandbox.mercadopago.com.mx";

    return `${baseUrl}/checkout/v1/redirect?pref_id=${preferenceId}`;
  }, [preferenceId]);

  // Memoized function to open MercadoPago
  const openMercadoPagoCheckout = useCallback(async () => {
    if (!preferenceId || !checkoutUrl) {
      const errorMessage = "No se pudo generar la preferencia de pago";
      onPaymentError(errorMessage);
      AlertHelper.error({
        title: "Error de pago",
        message: errorMessage,
        timer: 5000,
      });
      return;
    }

    setIsProcessing(true);
    setRedirecting(true);

    try {
      await AlertHelper.success({
        title: "Redirigiendo",
        message: "Serás redirigido a MercadoPago para completar tu pago",
        timer: 1500,
      });

      // Use window.location.replace for better UX (prevents back button issues)
      setTimeout(() => {
        window.location.replace(checkoutUrl);
      }, 100);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Error abriendo el checkout de MercadoPago";

      onPaymentError(errorMessage);
      setIsProcessing(false);
      setRedirecting(false);

      AlertHelper.error({
        title: "Error de pago",
        message: errorMessage,
        timer: 6000,
      });
    }
  }, [preferenceId, checkoutUrl, onPaymentError, setIsProcessing]);

  // Memoized loading state
  const LoadingState = useMemo(
    () => (
      <div
        className="flex justify-center items-center py-8"
        role="status"
        aria-label="Preparando el pago"
      >
        <div className="w-10 h-10 relative">
          <div
            className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"
            aria-hidden="true"
          ></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"
            aria-hidden="true"
          ></div>
        </div>
        <p className="ml-3 text-gray-600 dark:text-gray-400">
          Preparando el pago...
        </p>
      </div>
    ),
    []
  );

  // Memoized amount summary
  const AmountSummary = useMemo(
    () => (
      <div
        className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        role="region"
        aria-label="Resumen del monto"
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Total a pagar:
          </span>
          <span
            className="text-lg font-bold text-gray-900 dark:text-white"
            aria-live="polite"
          >
            ${totalDisplay} MXN
          </span>
        </div>
      </div>
    ),
    [totalDisplay]
  );

  // Memoized MercadoPago info
  const MercadoPagoInfo = useMemo(
    () => (
      <div
        className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50"
        role="region"
        aria-label="Información de MercadoPago"
      >
        <div className="flex items-center mb-3">
          <div
            className="bg-blue-100 dark:bg-blue-800/50 rounded-full p-2"
            aria-hidden="true"
          >
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="ml-3 text-base font-medium text-gray-900 dark:text-white">
            Pago con MercadoPago
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Serás redirigido a MercadoPago para completar tu pago de forma segura.
          Puedes pagar con tarjeta de crédito, débito, efectivo o transferencia
          bancaria.
        </p>
      </div>
    ),
    []
  );

  // Memoized payment button
  const PaymentButton = useMemo(
    () => (
      <div className="mb-6">
        <button
          onClick={openMercadoPagoCheckout}
          disabled={isProcessing || !preferenceId}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center text-lg shadow-lg hover:shadow-xl disabled:shadow-none"
          aria-label={`Pagar $${totalDisplay} MXN con MercadoPago`}
        >
          {isProcessing ? (
            <>
              <Loader2
                className="w-6 h-6 mr-3 animate-spin"
                aria-hidden="true"
              />
              <span>Redirigiendo a MercadoPago...</span>
            </>
          ) : (
            <>
              <Lock className="w-6 h-6 mr-3" aria-hidden="true" />
              <span>Pagar con MercadoPago - ${totalDisplay} MXN</span>
            </>
          )}
        </button>
      </div>
    ),
    [isProcessing, preferenceId, totalDisplay, openMercadoPagoCheckout]
  );

  // Memoized payment methods
  const PaymentMethods = useMemo(
    () => (
      <div
        className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        role="region"
        aria-label="Métodos de pago disponibles"
      >
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Métodos de pago disponibles:
        </h4>
        <div className="flex flex-wrap gap-2" role="list">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.id}
              className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
              role="listitem"
            >
              <div
                className={`w-8 h-5 ${method.color} rounded flex items-center justify-center shadow-sm`}
                aria-hidden="true"
              >
                <span className={`text-xs font-medium ${method.textColor}`}>
                  {method.name}
                </span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {method.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    []
  );

  // Memoized instructions
  const Instructions = useMemo(
    () => (
      <div
        className="text-sm text-gray-600 dark:text-gray-400 space-y-2"
        role="region"
        aria-label="Instrucciones de pago"
      >
        {INSTRUCTIONS.map((instruction, index) => (
          <p key={index} className="flex items-start">
            <span
              className="mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            >
              •
            </span>
            {instruction}
          </p>
        ))}
      </div>
    ),
    []
  );

  // Memoized error state
  const ErrorState = useMemo(
    () =>
      paymentError ? (
        <div
          className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4 mb-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex">
            <AlertCircle
              className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-sm text-red-600 dark:text-red-400">
                {paymentError}
              </p>
              <button
                type="button"
                onClick={onBack}
                className="mt-3 text-sm text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                Volver a la información de envío
              </button>
            </div>
          </div>
        </div>
      ) : null,
    [paymentError, onBack]
  );

  // Memoized initializing state
  const InitializingState = useMemo(
    () =>
      !preferenceId && !paymentError && !isLoadingPayment ? (
        <div
          className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 mb-4"
          role="status"
        >
          <div className="flex">
            <Info
              className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Inicializando MercadoPago...
            </p>
          </div>
        </div>
      ) : null,
    [preferenceId, paymentError, isLoadingPayment]
  );

  // Memoized navigation
  const Navigation = useMemo(
    () => (
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Volver a la sección anterior"
        >
          <ArrowLeft className="mr-2 w-5 h-5" aria-hidden="true" />
          Volver
        </button>
      </div>
    ),
    [onBack]
  );

  // Memoized security note
  const SecurityNote = useMemo(
    () => (
      <div
        className="mt-6 flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        role="region"
        aria-label="Información de seguridad"
      >
        <Shield
          className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Tus datos de pago están seguros. MercadoPago utiliza encriptación de
            256 bits y cumple con los estándares de seguridad PCI DSS.
          </p>
        </div>
      </div>
    ),
    []
  );

  // Main content renderer
  const renderContent = useMemo(() => {
    if (isLoadingPayment) {
      return LoadingState;
    }

    if (preferenceId) {
      return (
        <div className="space-y-4">
          {AmountSummary}
          {MercadoPagoInfo}
          {PaymentButton}
          {PaymentMethods}
          {Instructions}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {ErrorState}
        {InitializingState}
      </div>
    );
  }, [
    isLoadingPayment,
    preferenceId,
    LoadingState,
    AmountSummary,
    MercadoPagoInfo,
    PaymentButton,
    PaymentMethods,
    Instructions,
    ErrorState,
    InitializingState,
  ]);

  return (
    <div className="space-y-6">
      {/* Payment Content */}
      <div className="mb-6">{renderContent}</div>

      {/* Navigation */}
      {Navigation}

      {/* Security Note */}
      {SecurityNote}

      {/* Redirecting overlay */}
      {redirecting && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="status"
          aria-label="Redirigiendo a MercadoPago"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Redirigiendo a MercadoPago...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Por favor espera
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
