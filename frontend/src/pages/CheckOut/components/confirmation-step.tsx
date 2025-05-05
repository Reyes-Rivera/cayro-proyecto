"use client";

import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

interface ConfirmationStepProps {
  paymentIntent: any;
  paymentMethod: "card" | "paypal";
  total: number;
}

export default function ConfirmationStep({
  paymentIntent,
  paymentMethod,
  total,
}: ConfirmationStepProps) {
  // Estado local para almacenar el total
  const [displayTotal, setDisplayTotal] = React.useState<number>(0);

  React.useEffect(() => {
    console.log("ConfirmationStep - Props total:", total);
    console.log("ConfirmationStep - PaymentIntent:", paymentIntent);

    // Determinar el total correcto
    let finalTotal = 0;

    // 1. Intentar usar el total de las props
    if (total && total > 0) {
      console.log("Usando total de props:", total);
      finalTotal = total;
    }
    // 2. Intentar usar el total del paymentIntent.orderDetails
    else if (paymentIntent?.orderDetails?.total) {
      console.log(
        "Usando total de paymentIntent.orderDetails:",
        paymentIntent.orderDetails.total
      );
      finalTotal = paymentIntent.orderDetails.total;
    }
    // 3. Intentar usar el total del paymentIntent
    else if (paymentIntent?.total) {
      console.log("Usando total de paymentIntent.total:", paymentIntent.total);
      finalTotal = paymentIntent.total;
    }
    // 4. Intentar usar el amount del paymentIntent (convertido de centavos)
    else if (paymentIntent?.amount) {
      const amountTotal = paymentIntent.amount / 100;
      console.log("Usando total de paymentIntent.amount:", amountTotal);
      finalTotal = amountTotal;
    }
    // 5. Finalmente intentar usar localStorage
    else {
      const storedTotal = localStorage.getItem("checkout_total");
      console.log("Usando total de localStorage:", storedTotal);
      finalTotal = storedTotal ? Number.parseFloat(storedTotal) : 0;
    }

    // Actualizar el estado
    setDisplayTotal(finalTotal);
  }, [total, paymentIntent]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ¡Pedido confirmado!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Tu pedido ha sido recibido y está siendo procesado. Te hemos enviado
            un correo electrónico con los detalles de tu compra.
          </p>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Resumen del pedido
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Número de pedido:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {paymentIntent?.id
                    ? `ORD-${paymentIntent.id.substring(3, 9)}`
                    : `ORD-${Math.floor(100000 + Math.random() * 900000)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${displayTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Método de pago:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {paymentMethod === "card" ? "Tarjeta de crédito" : "PayPal"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Ver mis pedidos
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
