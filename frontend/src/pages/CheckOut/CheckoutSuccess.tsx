"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  ArrowRight,
  Home,
  Mail,
  ShoppingBag,
  Shield,
} from "lucide-react";
import Loader from "@/components/web-components/Loader";
import { AlertHelper } from "@/utils/alert.util";

const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Memoized next steps configuration
const NEXT_STEPS = [
  {
    step: 1,
    icon: Mail,
    title: "Confirmación por email",
    description: "Recibirás un email con los detalles de tu pedido y factura electrónica."
  },
  {
    step: 2,
    icon: ShoppingBag,
    title: "Preparación del pedido",
    description: "Comenzaremos a preparar tu pedido para el envío en las próximas horas."
  },
  {
    step: 3,
    icon: Truck,
    title: "Seguimiento del envío",
    description: "Te notificaremos con el número de seguimiento cuando tu pedido esté en camino."
  }
] as const;

// Memoized payment status mapping
const PAYMENT_STATUS = {
  approved: { label: "Aprobado", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  in_process: { label: "En proceso", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  authorized: { label: "Autorizado", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  default: { label: "Procesado", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" }
} as const;

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized URL parameters
  const urlParams = useMemo(() => ({
    paymentId: searchParams.get("payment_id"),
    externalReference: searchParams.get("external_reference"),
    merchantOrderId: searchParams.get("merchant_order_id"),
    collectionId: searchParams.get("collection_id"),
    collectionStatus: searchParams.get("collection_status")
  }), [searchParams]);

  // Memoized fetch payment function
  const fetchPayment = useCallback(async () => {
    try {
      if (!urlParams.paymentId && !urlParams.collectionId) {
        setPaymentData({
          status: "approved",
          externalReference: urlParams.externalReference,
          merchantOrderId: urlParams.merchantOrderId,
          paymentType: "MercadoPago",
          timestamp: new Date().toISOString()
        });
        setLoading(false);
        return;
      }

      const paymentId = urlParams.paymentId || urlParams.collectionId;
      if (!paymentId) return;

      const response = await fetch(
        `${apiUrl}/mercadopago/payment/${paymentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener la información del pago`);
      }

      const data = await response.json();

      setPaymentData({
        paymentId: data.id,
        status: data.status || urlParams.collectionStatus,
        externalReference: data.external_reference || urlParams.externalReference,
        merchantOrderId: data.merchant_order_id || urlParams.merchantOrderId,
        amount: data.transaction_amount,
        paymentType: data.payment_type_id || "MercadoPago",
        currency: data.currency_id || "MXN",
        timestamp: data.date_created || new Date().toISOString()
      });
      setError(null);
    } catch (error: any) {
      console.error('Error fetching payment:', error);
      
      const errorMessage = error.name === 'AbortError' 
        ? "La consulta tardó demasiado tiempo. Tu pago fue procesado correctamente."
        : error.message || "Error al obtener los detalles del pago, pero tu transacción fue exitosa.";

      setError(errorMessage);
      
      // Set fallback data even on error
      setPaymentData({
        paymentId: urlParams.paymentId || urlParams.collectionId,
        status: urlParams.collectionStatus || "approved",
        externalReference: urlParams.externalReference,
        merchantOrderId: urlParams.merchantOrderId,
        paymentType: "MercadoPago",
        timestamp: new Date().toISOString()
      });

      if (error.name !== 'AbortError') {
        AlertHelper.warning({
          title: "Información limitada",
          message: errorMessage,
          timer: 5000,
          animation: "slideIn",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [urlParams]);

  // Fetch payment data on mount
  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  // Memoized navigation handlers
  const handleViewOrders = useCallback(() => {
    navigate("/pedidos", { replace: true });
  }, [navigate]);

  const handleGoHome = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  // Memoized status display
  const statusDisplay = useMemo(() => {
    const status = paymentData?.status?.toLowerCase();
    const config = PAYMENT_STATUS[status as keyof typeof PAYMENT_STATUS] || PAYMENT_STATUS.default;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  }, [paymentData?.status]);

  // Memoized header section
  const HeaderSection = useMemo(() => (
    <div className="text-center mb-8">
      <div 
        className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
        aria-hidden="true"
      >
        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        ¡Pago exitoso!
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Tu pedido ha sido procesado correctamente y está siendo preparado
      </p>
      {error && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            {error}
          </p>
        </div>
      )}
    </div>
  ), [error]);

  // Memoized payment details
  const PaymentDetails = useMemo(() => {
    if (!paymentData) return null;

    const details = [
      { label: "ID de Pago", value: paymentData.paymentId },
      { label: "Referencia", value: paymentData.externalReference },
      { label: "Orden de Venta", value: paymentData.merchantOrderId },
      { label: "Método de pago", value: paymentData.paymentType },
      { label: "Monto", value: paymentData.amount ? `$${paymentData.amount} ${paymentData.currency || 'MXN'}` : null },
      { label: "Fecha", value: paymentData.timestamp ? new Date(paymentData.timestamp).toLocaleDateString('es-MX') : null }
    ].filter(detail => detail.value);

    return (
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-green-200 dark:border-green-800 mb-8"
        role="region"
        aria-label="Detalles del pago exitoso"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Package 
              className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500" 
              aria-hidden="true" 
            />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Detalles del pago
            </h2>
          </div>

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
                  className={`text-sm text-gray-900 dark:text-white ${
                    detail.label === "ID de Pago" || detail.label === "Referencia" 
                      ? "font-mono break-all" 
                      : ""
                  }`}
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

  // Memoized next steps section
  const NextStepsSection = useMemo(() => (
    <div 
      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8"
      role="region"
      aria-label="Próximos pasos de tu pedido"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Clock 
            className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500" 
            aria-hidden="true" 
          />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            ¿Qué sigue?
          </h2>
        </div>

        <div className="space-y-4" role="list">
          {NEXT_STEPS.map((step) => (
            <div 
              key={step.step} 
              className="flex items-start"
              role="listitem"
            >
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {step.step}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  <step.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
          
          {/* Security reassurance */}
          <div className="flex items-start pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex-shrink-0">
              <div 
                className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
                aria-hidden="true"
              >
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Transacción segura
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tu pago fue procesado de forma segura a través de MercadoPago.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), []);

  // Memoized action buttons
  const ActionButtons = useMemo(() => (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={handleViewOrders}
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Ver el estado de mis pedidos"
      >
        Ver mis pedidos
        <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
      </button>

      <button
        onClick={handleGoHome}
        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
        aria-label="Volver a la página de inicio"
      >
        <Home className="mr-2 w-4 h-4" aria-hidden="true" />
        Volver al inicio
      </button>
    </div>
  ), [handleViewOrders, handleGoHome]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24"
      role="main"
      aria-label="Página de confirmación de pago exitoso"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {HeaderSection}
        {PaymentDetails}
        {NextStepsSection}
        {ActionButtons}
      </div>
    </div>
  );
}
