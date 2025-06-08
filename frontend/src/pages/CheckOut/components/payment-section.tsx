"use client";
import {
  ArrowLeft,
  Loader2,
  Info,
  Lock,
  AlertCircle,
} from "lucide-react";

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

 

  // Función para abrir MercadoPago
  const openMercadoPagoCheckout = () => {
    if (!preferenceId) {
      onPaymentError("No se pudo generar la preferencia de pago");
      return;
    }

    setIsProcessing(true);

    try {
      // Determinar si estamos en producción basado en la public key
      const isProduction = !apiUrl?.startsWith("TEST-");

      // Construir URL de MercadoPago
      const baseUrl = isProduction
        ? "https://www.mercadopago.com.mx"
        : "https://sandbox.mercadopago.com.mx";

      const checkoutUrl = `${baseUrl}/checkout/v1/redirect?pref_id=${preferenceId}`;

      // Abrir en la misma ventana para evitar problemas de popup blocker
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error opening MercadoPago checkout:", error);
      onPaymentError("Error abriendo el checkout de MercadoPago");
      setIsProcessing(false);
    }
  };



  return (
    <>
     

      {/* Payment Content */}
      <div className="mb-6">
        {isLoadingPayment ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"></div>
            </div>
            <p className="ml-3 text-gray-600 dark:text-gray-400">
              Preparando el pago...
            </p>
          </div>
        ) : preferenceId ? (
          <div>
            {/* Resumen del monto */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Total a pagar:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${total.toFixed(2)} MXN
                </span>
              </div>
            </div>

            {/* Información de MercadoPago */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full p-2">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="ml-3 text-base font-medium text-gray-900 dark:text-white">
                  Pago con MercadoPago
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Serás redirigido a MercadoPago para completar tu pago de forma
                segura. Puedes pagar con tarjeta de crédito, débito, efectivo o
                transferencia bancaria.
              </p>
            </div>

            {/* Botón principal de MercadoPago */}
            <div className="mb-6">
              <button
                onClick={openMercadoPagoCheckout}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Redirigiendo a MercadoPago...
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6 mr-3" />
                    Pagar con MercadoPago - ${total.toFixed(2)} MXN
                  </>
                )}
              </button>
            </div>

            {/* Métodos de pago disponibles */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Métodos de pago disponibles:
              </h4>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border">
                  <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-white">VISA</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Tarjetas de crédito/débito
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border">
                  <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-white">MC</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Mastercard
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border">
                  <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-white">$</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Efectivo
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border">
                  <div className="w-8 h-5 bg-purple-600 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-white">SPEI</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Transferencia
                  </span>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>• Al hacer clic serás redirigido a MercadoPago</p>
              <p>• Completa tu pago en la plataforma segura de MercadoPago</p>
              <p>• Serás redirigido de vuelta automáticamente</p>
            </div>
          </div>
        ) : paymentError ? (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4 mb-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {paymentError}
                </p>
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-3 text-sm text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Volver a la información de envío
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 mb-4">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Inicializando MercadoPago...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Volver
        </button>
      </div>

      {/* Security Note */}
      <div className="mt-6 flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Lock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tus datos de pago están seguros. MercadoPago utiliza encriptación de
            256 bits y cumple con los estándares de seguridad PCI DSS.
          </p>
        </div>
      </div>
    </>
  );
}
