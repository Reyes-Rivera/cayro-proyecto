"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContextType";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

import AddressSection from "./components/address-section";
import PaymentSection from "./components/payment-section";
import OrderSummary from "./components/order-summary";
import CheckoutProgress from "./components/checkout-progress";
import type { ShippingDetailsFormData } from "@/types/checkout";

type CheckoutStep = "shipping" | "shipping-details" | "payment";

export default function CheckoutPage() {
  const { items, subtotal, itemCount, shipping, total } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const [preferenceId, setPreferenceId] = useState("");
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [shippingDetails, setShippingDetails] =
    useState<ShippingDetailsFormData | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [addresses, setAddresses] = useState<any[]>([]);

  // Usar refs para mantener los valores originales incluso después de limpiar el carrito
  const subtotalRef = useRef(subtotal);
  const shippingRef = useRef(shipping);
  const totalRef = useRef(total);

  // Actualizar las refs cuando cambian los valores
  useEffect(() => {
    subtotalRef.current = subtotal;
    shippingRef.current = shipping;
    totalRef.current = total;
  }, [subtotal, shipping, total]);

  // Global error handler
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection in checkout:", event.reason);

      // Prevent the default browser behavior
      event.preventDefault();

      // Show user-friendly error message
      Swal.fire({
        title: "Error inesperado",
        text: "Ocurrió un error inesperado. Por favor, recarga la página e intenta de nuevo.",
        icon: "error",
        confirmButtonText: "Recargar página",
        confirmButtonColor: "#3B82F6",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          const result = await Swal.fire({
            title: "Iniciar sesión",
            text: "Debes iniciar sesión para continuar con el pago",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Iniciar sesión",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#6B7280",
          });

          if (result.isConfirmed) {
            navigate("/login?redirect=/checkout");
          } else {
            navigate("/carrito");
          }
          return;
        }

        // Verificar que hay items en el carrito
        if (items.length === 0) {
          navigate("/carrito");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error in checkAuth:", error);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      checkAuth().catch((error) => {
        console.error("Error in checkAuth timeout:", error);
        setIsLoading(false);
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, items.length]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Toggle order summary on mobile
  const toggleOrderSummary = () => {
    setOrderSummaryExpanded(!orderSummaryExpanded);
  };

 
  const handlePaymentError = (errorMessage: string) => {
    try {
      setPaymentError(errorMessage);
      Swal.fire({
        title: "Error en el pago",
        text:
          errorMessage ||
          "Hubo un problema procesando tu pago. Por favor intenta nuevamente.",
        icon: "error",
      }).catch((error) => {
        console.error("Error showing payment error dialog:", error);
      });
    } catch (error) {
      console.error("Error in handlePaymentError:", error);
    }
  };

  const handleShippingSubmit = (details: ShippingDetailsFormData) => {
    try {
      setShippingDetails(details);
      setCurrentStep("payment");
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error in handleShippingSubmit:", error);
    }
  };

  // Función wrapper para el botón de continuar en OrderSummary
  const handleContinueToShippingDetails = () => {
    if (!selectedAddressId && addresses?.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Selecciona una dirección",
        text: "Por favor selecciona una dirección de envío para continuar",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    if (addresses.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Agrega una dirección",
        text: "Por favor agrega una dirección de envío para continuar",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    setCurrentStep("shipping-details");
    window.scrollTo(0, 0);
  };

  // Crear preferencia de Mercado Pago
  useEffect(() => {
    const createMercadoPagoPreference = async () => {
      if (
        currentStep === "payment" &&
        items.length > 0 &&
        user &&
        shippingDetails
      ) {
        try {
          setIsLoadingPayment(true);
          setPaymentError("");
          setPreferenceId(""); // Limpiar preferencia anterior

          console.log("=== CREATING MERCADOPAGO PREFERENCE ===");
          console.log("User:", user);
          console.log("Items:", items);
          console.log("Total:", total);
          console.log("Shipping Details:", shippingDetails);

          // Preparar datos del carrito
          const cart = items.map((item: any) => ({
            productId: item.product?.id || item.productId,
            variantId: item.variant?.id || item.variantId,
            name:
              item.product?.name || item.name || `Producto ${item.productId}`,
            price: Number(item.variant?.price || item.price),
            quantity: Number(item.quantity),
          }));

          // Preparar datos del usuario
          const userData = {
            id: user.id?.toString() || "unknown",
            email: user.email || "test@test.com",
            name: `${user.name || "Usuario"} ${user.surname || ""}`.trim(),
          };

          // Preparar payload completo con detalles de envío
          const requestData = {
            cart,
            total: Number(total),
            subtotal: Number(subtotal),
            shippingCost: Number(shipping),
            user: userData,
            shippingDetails,
          };

          console.log("Request data:", JSON.stringify(requestData, null, 2));

          // Validar datos antes de enviar
          if (!requestData.cart || requestData.cart.length === 0) {
            throw new Error("El carrito está vacío");
          }

          if (!requestData.total || requestData.total <= 0) {
            throw new Error("El total debe ser mayor a 0");
          }

          if (!requestData.user.email) {
            throw new Error("Email del usuario requerido");
          }

          if (!requestData.shippingDetails) {
            throw new Error("Detalles de envío requeridos");
          }

          console.log("Sending request to backend...");

          const response = await axios.post(
            "http://localhost:5000/mercadopago/create-preference",
            requestData,
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 15000, // 15 segundos de timeout
            }
          );

          console.log("=== BACKEND RESPONSE ===");
          console.log("Full response:", response);
          console.log("Response data:", JSON.stringify(response.data, null, 2));

          if (response.data.success && response.data.preferenceId) {
            console.log(
              "✅ Preference created successfully:",
              response.data.preferenceId
            );
            setPreferenceId(response.data.preferenceId);
            setPaymentError("");

            // Verificar que la preferencia sea válida
            if (!response.data.preferenceId.includes("-")) {
              console.warn(
                "⚠️ Preference ID format seems unusual:",
                response.data.preferenceId
              );
            }

            // Log URLs que se van a usar
            const sandboxUrl = `https://sandbox.mercadopago.com.mx/checkout/v1/redirect?pref_id=${response.data.preferenceId}`;
            const prodUrl = `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${response.data.preferenceId}`;

            console.log("Sandbox URL:", sandboxUrl);
            console.log("Production URL:", prodUrl);
            console.log("Init Point:", response.data.initPoint);
            console.log("Sandbox Init Point:", response.data.sandboxInitPoint);
          } else {
            console.error("❌ Invalid response from backend:", response.data);
            throw new Error(
              response.data.message || "No se pudo crear la preferencia de pago"
            );
          }
        } catch (error) {
          console.error("=== ERROR CREATING PREFERENCE ===");
          console.error("Error object:", error);

          let errorMessage =
            "No se pudo inicializar el pago. Por favor, intenta de nuevo.";

          if (axios.isAxiosError(error)) {
            console.error("Axios error details:");
            console.error("- Status:", error.response?.status);
            console.error("- Data:", error.response?.data);
            console.error("- Headers:", error.response?.headers);
            console.error("- Config:", error.config);

            if (error.code === "ECONNABORTED") {
              errorMessage =
                "Timeout: El servidor tardó demasiado en responder. Intenta de nuevo.";
            } else if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.response?.status === 400) {
              errorMessage =
                "Datos inválidos. Verifica la información del carrito.";
            } else if (error.response?.status === 404) {
              errorMessage =
                "Endpoint no encontrado. Verifica que el servidor esté corriendo.";
            } else if (error.response && error.response.status >= 500) {
              errorMessage =
                "Error del servidor. Por favor, intenta más tarde.";
            } else if (error.message) {
              errorMessage = `Error de conexión: ${error.message}`;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          console.error("Final error message:", errorMessage);
          setPaymentError(errorMessage);
        } finally {
          setIsLoadingPayment(false);
        }
      }
    };

    createMercadoPagoPreference().catch((error) => {
      console.error("Error in createMercadoPagoPreference effect:", error);
      setIsLoadingPayment(false);
      setPaymentError("Error inesperado al inicializar el pago.");
    });
  }, [currentStep, items, total, subtotal, shipping, user, shippingDetails]);

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <CheckoutProgress currentStep={currentStep} />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {(currentStep === "shipping" ||
              currentStep === "shipping-details") && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Información de envío
                  </h2>
                  <AddressSection
                    user={user}
                    onAddressSelected={handleShippingSubmit}
                    selectedAddressId={selectedAddressId}
                    setSelectedAddressId={setSelectedAddressId}
                    addresses={addresses}
                    setAddresses={setAddresses}
                  />
                </div>
              </div>
            )}

            {currentStep === "payment" && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Información de pago
                  </h2>
                  <PaymentSection
                    preferenceId={preferenceId}
                    isLoadingPayment={isLoadingPayment}
                    paymentError={paymentError}
                    onPaymentError={handlePaymentError}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                    total={total}
                    onBack={() => setCurrentStep("shipping")}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3">
            <OrderSummary
              items={items}
              itemCount={itemCount}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              expanded={orderSummaryExpanded}
              toggleExpanded={toggleOrderSummary}
              currentStep={currentStep}
              onContinue={handleContinueToShippingDetails}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
