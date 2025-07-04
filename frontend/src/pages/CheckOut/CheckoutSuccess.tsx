"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  ArrowRight,
  Home,
} from "lucide-react";
import Loader from "@/components/web-components/Loader";
const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Obtener parámetros del query string
  const paymentId = searchParams.get("payment_id");
  const externalReference = searchParams.get("external_reference");
  const merchantOrderId = searchParams.get("merchant_order_id");

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        if (!paymentId) return;

        const response = await fetch(
          `${apiUrl}/mercadopago/payment/${paymentId}`
        );

        if (!response.ok) {
          throw new Error(`Error al obtener el pago: ${response.status}`);
        }

        const data = await response.json();

        setPaymentData({
          paymentId: data.id,
          status: data.status,
          externalReference: data.external_reference,
          merchantOrderId,
          amount: data.transaction_amount,
          paymentType: data.payment_type_id || "Desconocido",
        });
      } catch (error: any) {
        console.error("Error al obtener detalles del pago:", error.message);
        setPaymentData({
          paymentId,
          status: "Error",
          externalReference,
          merchantOrderId,
          amount: "0",
          paymentType: "Error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId, merchantOrderId, externalReference]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Pago exitoso!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Tu pedido ha sido procesado correctamente
          </p>
        </div>

        {/* Payment details */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Detalles del pago
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  ID de Pago
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">
                  {paymentData?.paymentId || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Estado
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {paymentData?.status === "approved"
                    ? "Aprobado"
                    : paymentData?.status || "Procesado"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Referencia
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">
                  {paymentData?.externalReference || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Método de pago
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {paymentData?.paymentType || "MercadoPago"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                ¿Qué sigue?
              </h2>
            </div>

            <div className="space-y-4">
              {/* Paso 1 */}
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
                    Confirmación por email
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recibirás un email con los detalles de tu pedido.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
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
                    Preparación del pedido
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Comenzaremos a preparar tu pedido para el envío.
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Envío
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Te notificaremos cuando tu pedido esté en camino.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/pedidos")}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Ver mis pedidos
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Home className="mr-2 w-4 h-4" />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
