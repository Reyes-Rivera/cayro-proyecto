"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContextType";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

import AddressSection from "./components/address-section";
import ShippingMethodSection from "./components/shipping-method-section";
import PaymentSection from "./components/payment-section";
import OrderSummary from "./components/order-summary";
import ConfirmationStep from "./components/confirmation-step";
import CheckoutProgress from "./components/checkout-progress";

const publickKey = import.meta.env.VITE_REACT_APP_STRIPE_PUBLICK_KEY;
const stripePromise = loadStripe(publickKey);

type CheckoutStep = "shipping" | "payment" | "confirmation";

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);

  // Usar refs para mantener los valores originales incluso después de limpiar el carrito
  const subtotalRef = useRef(subtotal);
  const shippingRef = useRef(0);
  const totalRef = useRef(0);

  // Calculate order totals
  const shipping =
    shippingMethod === "standard" ? (subtotal > 100 ? 0 : 10) : 25;
  const total = subtotal + shipping;

  console.log(
    `Subtotal: ${subtotal} Shipping: ${shipping} Total calculado: ${total}`,
    new Error().stack?.split("\n")[1]
  );

  // Actualizar las refs cuando cambian los valores
  useEffect(() => {
    subtotalRef.current = subtotal;
    shippingRef.current = shipping;
    totalRef.current = total;
  }, [subtotal, shipping, total]);

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        Swal.fire({
          title: "Iniciar sesión",
          text: "Debes iniciar sesión para continuar con el pago",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Iniciar sesión",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3B82F6",
          cancelButtonColor: "#6B7280",
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to login page with return URL
            navigate("/login?redirect=/checkout");
          } else {
            // Go back to cart
            navigate("/cart");
          }
        });
        return;
      }

      setIsLoading(false);
    };

    // Short timeout to simulate loading and check auth
    const timer = setTimeout(() => {
      checkAuth();
    }, 800);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Toggle order summary on mobile
  const toggleOrderSummary = () => {
    setOrderSummaryExpanded(!orderSummaryExpanded);
  };

  function handlePaymentSuccess(paymentIntent: any) {
    // Guardar los valores actuales antes de limpiar el carrito
    const currentSubtotal = subtotalRef.current;
    const currentShipping = shippingRef.current;
    const currentTotal = totalRef.current;

    console.log(`Total a guardar en localStorage: ${currentTotal}`);

    // Guardar el total actual en localStorage antes de cambiar de paso
    localStorage.setItem("checkout_total", currentTotal.toString());
    localStorage.setItem("checkout_subtotal", currentSubtotal.toString());
    localStorage.setItem("checkout_shipping", currentShipping.toString());

    // Añadir los valores al paymentIntent para pasarlos al componente de confirmación
    const enhancedPaymentIntent = {
      ...paymentIntent,
      orderDetails: {
        subtotal: currentSubtotal,
        shipping: currentShipping,
        total: currentTotal,
      },
    };

    setPaymentIntent(enhancedPaymentIntent);
    setCurrentStep("confirmation");

    // Limpiar el carrito después de guardar todos los valores necesarios
    clearCart();

    window.scrollTo(0, 0);
  }

  const handlePaymentError = (errorMessage: string) => {
    setPaymentError(errorMessage);
    Swal.fire({
      title: "Error en el pago",
      text:
        errorMessage ||
        "Hubo un problema procesando tu pago. Por favor intenta nuevamente.",
      icon: "error",
    });
  };

  const handleShippingSubmit = () => {
    setCurrentStep("payment");
    window.scrollTo(0, 0);
  };

  // Añadir un useEffect para crear el PaymentIntent
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (
        currentStep === "payment" &&
        paymentMethod === "card" &&
        items.length > 0
      ) {
        try {
          setIsLoadingPaymentIntent(true);
          setPaymentError("");

          // Preparar el carrito para enviarlo a la API
          const cart = items.map((item: any) => ({
            productId: item.product?.id || item.productId,
            variantId: item.variant?.id || item.variantId,
            name: item.product?.name || item.name,
            price: item.variant?.price || item.price,
            quantity: item.quantity,
          }));

          console.log(
            "Enviando solicitud a la API para crear PaymentIntent",
            cart
          );

          // Llamar a la API para crear el PaymentIntent
          try {
            const response = await axios.post(
              "http://localhost:5000/stripe/create-payment-intent",
              {
                cart,
                amount: total * 100, // Asegurarse de enviar el monto total correcto
              }
            );
            console.log("Respuesta de la API:", response.data);

            if (response.data.clientSecret) {
              setClientSecret(response.data.clientSecret);
            } else if (response.data.error) {
              setPaymentError(response.data.error);
            }
          } catch (error) {
            console.error("Error creating payment intent:", error);
            setPaymentError(
              "No se pudo inicializar el pago. Por favor, intenta de nuevo."
            );
          }
        } catch (error) {
          console.error("Error creating payment intent:", error);
          setPaymentError(
            "No se pudo inicializar el pago. Por favor, intenta de nuevo."
          );
        } finally {
          setIsLoadingPaymentIntent(false);
        }
      }
    };

    createPaymentIntent();
  }, [currentStep, paymentMethod, items, total]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex items-center justify-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"></div>
        </div>
      </div>
    );
  }

  // Render confirmation step
  if (currentStep === "confirmation") {
    return (
      <ConfirmationStep
        paymentIntent={paymentIntent}
        paymentMethod={paymentMethod}
        total={totalRef.current}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/carrito"
            className="flex items-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-sm">Volver al carrito</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            Finalizar compra
          </h1>
        </div>

        {/* Progress Steps */}
        <CheckoutProgress currentStep={currentStep} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Información de envío
                  </h2>

                  <AddressSection
                    user={user}
                    onAddressSelected={handleShippingSubmit}
                  />

                  <ShippingMethodSection
                    shippingMethod={shippingMethod}
                    setShippingMethod={setShippingMethod}
                    subtotal={subtotal}
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleShippingSubmit}
                      className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                      Continuar al pago
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Información de pago
                  </h2>

                  <PaymentSection
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    clientSecret={clientSecret}
                    isLoadingPaymentIntent={isLoadingPaymentIntent}
                    paymentError={paymentError}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                    total={total}
                    onBack={() => setCurrentStep("shipping")}
                    stripePromise={stripePromise}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <OrderSummary
              items={items}
              itemCount={itemCount}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              shippingMethod={shippingMethod}
              expanded={orderSummaryExpanded}
              toggleExpanded={toggleOrderSummary}
              currentStep={currentStep}
              onContinue={handleShippingSubmit}
              isProcessing={isProcessing}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
