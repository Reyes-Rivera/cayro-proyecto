"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContextType";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import type { ShippingDetailsFormData } from "@/types/checkout";
import CheckoutProgress from "./components/checkout-progress";
import AddressSection from "./components/address-section";
import PaymentSection from "./components/payment-section";
import OrderSummary from "./components/order-summary";
import { AlertHelper } from "@/utils/alert.util";

const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

type CheckoutStep = "shipping" | "shipping-details" | "payment";

const calculateShippingCost = (cart: any[]): number => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems <= 5) return 200;
  if (totalItems <= 10) return 250;
  if (totalItems <= 15) return 300;
  if (totalItems <= 20) return 350;
  if (totalItems <= 25) return 400;
  const extraGroups = Math.ceil((totalItems - 25) / 5);
  return 400 + extraGroups * 50;
};

export default function CheckoutPage() {
  const { items, subtotal, itemCount } = useCart();
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

  // Shipping calculation states
  const [shipping, setShipping] = useState(0);

  // Calculate total with shipping
  const total = subtotal + shipping;

  const subtotalRef = useRef(subtotal);
  const shippingRef = useRef(shipping);
  const totalRef = useRef(total);

  useEffect(() => {
    subtotalRef.current = subtotal;
    shippingRef.current = shipping;
    totalRef.current = total;
  }, [subtotal, shipping, total]);

  const calculateShippingCostLocal = () => {
    if (items.length === 0) {
      setShipping(0);
      return;
    }

    try {
      // Calculate shipping cost using the local function
      const shippingCost = calculateShippingCost(items);
      setShipping(shippingCost);
    } catch (err) {
      console.error("Failed to calculate shipping:", err);
      AlertHelper.error({
        title: "Error de envío",
        message:
          "Error al calcular el costo de envío. Se usará un costo estimado.",
        timer: 4000,
        animation: "slideIn",
      });
      // Fallback to a default shipping cost
      setShipping(200);
    }
  };

  useEffect(() => {
    if (currentStep === "shipping-details" || currentStep === "payment") {
      calculateShippingCostLocal();
    }
  }, [items, subtotal, currentStep]);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      AlertHelper.confirm({
        title: "Error inesperado",
        message:
          "Ocurrió un error inesperado. Por favor, recarga la página e intenta de nuevo.",
        confirmText: "Recargar página",
        cancelText: "Cancelar",
        type: "info",
        animation: "bounce",
      }).then((confirmed) => {
        if (confirmed) {
          window.location.reload();
        }
      });
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          const confirmed = await AlertHelper.confirm({
            title: "Iniciar sesión",
            message: "Debes iniciar sesión para continuar con el pago",
            confirmText: "Iniciar sesión",
            cancelText: "Cancelar",
            type: "info",
            animation: "slideIn",
          });
          if (confirmed) {
            navigate("/login?redirect=/checkout");
          } else {
            navigate("/carrito");
          }
          return;
        }
        if (items.length === 0) {
          navigate("/carrito");
          return;
        }
        setIsLoading(false);
      } catch (error: any) {
        AlertHelper.error({
          title: "Error",
          message:
            error.response.data.message ||
            "Ocurrió un error al verificar la autenticación",
          timer: 4000,
        });
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      checkAuth();
    }, 800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, items.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleOrderSummary = () => {
    setOrderSummaryExpanded(!orderSummaryExpanded);
  };

  const handlePaymentError = (errorMessage: string) => {
    setPaymentError(errorMessage);
    AlertHelper.error({
      title: "Error en el pago",
      message:
        errorMessage ||
        "Hubo un problema procesando tu pago. Por favor intenta nuevamente.",
      timer: 6000,
      animation: "slideIn",
    });
  };

  const handleShippingSubmit = (details: ShippingDetailsFormData) => {
    try {
      setShippingDetails(details);
      setCurrentStep("payment");
      window.scrollTo(0, 0);
    } catch (error: any) {
      AlertHelper.error({
        title: "Error",
        message:
          "Ocurrió un error al procesar la información de envío" +
          error.data.message,
        timer: 4000,
      });
    }
  };

  const handleContinueToShippingDetails = () => {
    if (!selectedAddressId && addresses?.length > 0) {
      AlertHelper.warning({
        title: "Selecciona una dirección",
        message: "Por favor selecciona una dirección de envío para continuar",
        timer: 4000,
        animation: "slideIn",
      });
      return;
    }
    if (addresses.length === 0) {
      AlertHelper.warning({
        title: "Agrega una dirección",
        message: "Por favor agrega una dirección de envío para continuar",
        timer: 4000,
        animation: "slideIn",
      });
      return;
    }
    setCurrentStep("shipping-details");
    window.scrollTo(0, 0);
  };

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
          setPreferenceId("");
          const cart = items.map((item: any) => ({
            productId: item.product?.id || item.productId,
            variantId: item.variant?.id || item.variantId,
            name:
              item.product?.name || item.name || `Producto ${item.productId}`,
            price: Number(item.variant?.price || item.price),
            quantity: Number(item.quantity),
          }));

          const userData = {
            id: user.id?.toString() || "unknown",
            email: user.email || "test@test.com",
            name: `${user.name || "Usuario"} ${user.surname || ""}`.trim(),
          };

          const requestData = {
            cart,
            total: Number(total),
            subtotal: Number(subtotal),
            shippingCost: Number(shipping),
            user: userData,
            shippingDetails,
          };

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

          const response = await axios.post(
            `${apiUrl}/mercadopago/create-preference`,
            requestData,
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 15000,
            }
          );

          if (response.data.success && response.data.preferenceId) {
            setPreferenceId(response.data.preferenceId);
            setPaymentError("");
            AlertHelper.success({
              title: "Pago listo",
              message: "Redirigiendo a Mercado Pago...",
              timer: 2000,
            });
          } else {
            throw new Error(
              response.data.message || "No se pudo crear la preferencia de pago"
            );
          }
        } catch (error) {
          let errorMessage =
            "No se pudo inicializar el pago. Por favor, intenta de nuevo.";
          if (axios.isAxiosError(error)) {
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

          setPaymentError(errorMessage);
          AlertHelper.error({
            title: "Error al inicializar el pago",
            message: errorMessage,
            timer: 6000,
            animation: "slideIn",
          });
        } finally {
          setIsLoadingPayment(false);
        }
      }
    };

    createMercadoPagoPreference().catch(() => {
      setIsLoadingPayment(false);
      setPaymentError("Error inesperado al inicializar el pago.");
      AlertHelper.error({
        title: "Error inesperado",
        message:
          "Error inesperado al inicializar el pago. Por favor, intenta de nuevo.",
        timer: 5000,
        animation: "slideIn",
      });
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
