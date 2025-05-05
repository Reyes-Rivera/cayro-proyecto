"use client";

import type React from "react";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Info,
  Lock,
  AlertCircle,
} from "lucide-react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { BillingDetails, CheckoutFormProps } from "@/types/checkout";

interface PaymentSectionProps {
  paymentMethod: "card" | "paypal";
  setPaymentMethod: (method: "card" | "paypal") => void;
  clientSecret: string;
  isLoadingPaymentIntent: boolean;
  paymentError: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (errorMessage: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  total: number;
  onBack: () => void;
  stripePromise: Promise<any>;
}

// Componente de formulario de pago con Stripe
const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  total,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "MX",
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js no ha sido cargado aún
      return;
    }

    if (!cardComplete) {
      setCardError("Por favor, completa los datos de tu tarjeta");
      return;
    }

    setIsProcessing(true);
    setCardError("");

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("No se pudo encontrar el elemento de tarjeta");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      });

      if (result.error) {
        setCardError(result.error.message || "Error al procesar el pago");
        onPaymentError(result.error.message || "Error al procesar el pago");
      } else {
        if (
          result.paymentIntent &&
          result.paymentIntent.status === "succeeded"
        ) {
          // Guardar el total en el paymentIntent para asegurar que se pase correctamente
          const paymentIntentWithTotal = {
            ...result.paymentIntent,
            amount: total * 100, // Convertir a centavos como lo hace Stripe
            total: total, // Añadir el total como propiedad adicional
          };
          onPaymentSuccess(paymentIntentWithTotal);
        } else {
          setCardError(
            "El pago no pudo ser completado. Por favor, intenta de nuevo."
          );
          onPaymentError("El pago no pudo ser completado");
        }
      }
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      setCardError("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      onPaymentError("Error inesperado");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : "");
  };

  const handleBillingDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBillingDetails((prev:any) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof BillingDetails] as Record<string, any>),
          [child]: value,
        },
      }));
    } else {
      setBillingDetails((prev:any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 space-y-4">
        {/* Nombre del titular */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nombre del titular
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={billingDetails.name}
            onChange={handleBillingDetailsChange}
            className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="JUAN PEREZ"
            required
          />
        </div>

        {/* Tarjeta de crédito */}
        <div>
          <label
            htmlFor="card"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Información de la tarjeta
          </label>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
            <CardElement
              id="card"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: "antialiased",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                    padding: "10px 12px",
                  },
                  invalid: {
                    color: "#9e2146",
                    iconColor: "#9e2146",
                  },
                },
                hidePostalCode: true,
              }}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {cardError}
            </p>
          )}
        </div>
      </div>

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

      {/* Botón de pago */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!stripe || isProcessing || !cardComplete}
          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Procesando pago...
            </>
          ) : (
            <>
              Pagar ${total.toFixed(2)} MXN
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  clientSecret,
  isLoadingPaymentIntent,
  paymentError,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  total,
  onBack,
  stripePromise,
}: PaymentSectionProps) {
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "paypal") {
      setIsProcessing(true);

      try {
        // Aquí iría la lógica para procesar el pago con PayPal
        // Simulamos un proceso de pago
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Success
        onPaymentSuccess({
          id: `PP-${Math.random().toString(36).substr(2, 9)}`,
        });
      } catch (error) {
        console.log(error);
        onPaymentError(
          "Hubo un problema procesando tu pago. Por favor intenta nuevamente."
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <>
      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
          Método de pago
        </h3>

        <div className="space-y-3">
          <label
            className={`flex items-center p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "card"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
            />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Tarjeta de crédito/débito
                </span>
                <div className="flex space-x-2">
                  <div className="w-8 h-5 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-medium">VISA</span>
                  </div>
                  <div className="w-8 h-5 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-medium">MC</span>
                  </div>
                </div>
              </div>
            </div>
          </label>

          <label
            className={`flex items-center p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "paypal"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
            />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  PayPal
                </span>
                <div className="w-16 h-5 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-xs font-medium">PayPal</span>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Stripe Payment Form */}
      {paymentMethod === "card" && (
        <div className="mb-6">
          {isLoadingPaymentIntent ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"></div>
              </div>
              <p className="ml-3 text-gray-600 dark:text-gray-400">
                Preparando el pago...
              </p>
            </div>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#0070f3",
                    colorBackground: "#ffffff",
                    colorText: "#30313d",
                    colorDanger: "#df1b41",
                    fontFamily:
                      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    spacingUnit: "4px",
                    borderRadius: "4px",
                  },
                },
              }}
            >
              <CheckoutForm
                clientSecret={clientSecret}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                total={total}
              />
            </Elements>
          ) : paymentError ? (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {paymentError ||
                    "Error al inicializar el pago. Por favor, intenta de nuevo."}
                </p>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="mt-3 text-sm text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver a la información de envío
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 mb-4">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Inicializando el formulario de pago...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PayPal Payment Form */}
      {paymentMethod === "paypal" && (
        <form onSubmit={handlePaymentSubmit}>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full p-2">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="ml-3 text-base font-medium text-gray-900 dark:text-white">
                Pago con PayPal
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Al hacer clic en "Continuar con PayPal", serás redirigido a la
              página de PayPal para completar tu pago de forma segura.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Volver
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Continuar con PayPal
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Security Note */}
      <div className="mt-6 flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Lock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tus datos de pago están seguros. Utilizamos encriptación de 256 bits
            y no almacenamos los detalles de tu tarjeta.
          </p>
        </div>
      </div>
    </>
  );
}
