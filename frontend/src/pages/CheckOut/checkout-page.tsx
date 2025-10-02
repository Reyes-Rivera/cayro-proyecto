"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

// Memoized shipping cost calculation
const calculateShippingCost = (cart: any[]): number => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems === 0) return 0;
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
  const [shipping, setShipping] = useState(0);

  // Refs for stable values
  const itemsRef = useRef(items);
  const userRef = useRef(user);
  const shippingDetailsRef = useRef(shippingDetails);

  // Update refs when dependencies change
  useEffect(() => {
    itemsRef.current = items;
    userRef.current = user;
    shippingDetailsRef.current = shippingDetails;
  }, [items, user, shippingDetails]);

  // Memoized totals
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  // Memoized shipping calculation
  const calculateShippingCostLocal = useCallback(() => {
    if (items.length === 0) {
      setShipping(0);
      return;
    }

    try {
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
      setShipping(200);
    }
  }, [items]);

  // Effect for shipping calculation
  useEffect(() => {
    if (currentStep === "shipping-details" || currentStep === "payment") {
      calculateShippingCostLocal();
    }
  }, [currentStep, calculateShippingCostLocal]);

  // Error boundary for unhandled rejections
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

  // Authentication and cart validation
  const checkAuth = useCallback(async () => {
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
          navigate("/login?redirect=/checkout", { replace: true });
        } else {
          navigate("/carrito", { replace: true });
        }
        return;
      }
      if (items.length === 0) {
        navigate("/carrito", { replace: true });
        return;
      }
      setIsLoading(false);
    } catch (error: any) {
      AlertHelper.error({
        title: "Error",
        message:
          error.response?.data?.message ||
          "Ocurrió un error al verificar la autenticación",
        timer: 4000,
      });
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate, items.length]);

  // Initial load effect
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 500);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  // Scroll to top on step change
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [currentStep]);

  // Memoized event handlers
  const toggleOrderSummary = useCallback(() => {
    setOrderSummaryExpanded((prev) => !prev);
  }, []);

  const handlePaymentError = useCallback((errorMessage: string) => {
    setPaymentError(errorMessage);
    AlertHelper.error({
      title: "Error en el pago",
      message:
        errorMessage ||
        "Hubo un problema procesando tu pago. Por favor intenta nuevamente.",
      timer: 6000,
      animation: "slideIn",
    });
  }, []);

  const handleShippingSubmit = useCallback(
    (details: ShippingDetailsFormData) => {
      try {
        setShippingDetails(details);
        setCurrentStep("payment");
      } catch (error: any) {
        AlertHelper.error({
          title: "Error",
          message:
            "Ocurrió un error al procesar la información de envío" +
            error.data?.message,
          timer: 4000,
        });
      }
    },
    []
  );

  const handleContinueToShippingDetails = useCallback(() => {
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
  }, [selectedAddressId, addresses.length]);

  const handleBackToShipping = useCallback(() => {
    setCurrentStep("shipping");
  }, []);

  // Memoized MercadoPago preference creation
  const createMercadoPagoPreference = useCallback(async () => {
    const currentItems = itemsRef.current;
    const currentUser = userRef.current;
    const currentShippingDetails = shippingDetailsRef.current;

    if (!currentItems.length || !currentUser || !currentShippingDetails) {
      return;
    }

    try {
      setIsLoadingPayment(true);
      setPaymentError("");
      setPreferenceId("");

      const cart = currentItems.map((item: any) => ({
        productId: item.product?.id || item.productId,
        variantId: item.variant?.id || item.variantId,
        name: item.product?.name || item.name || `Producto ${item.productId}`,
        price: Number(item.variant?.price || item.price),
        quantity: Number(item.quantity),
      }));

      const userData = {
        id: currentUser.id?.toString() || "unknown",
        email: currentUser.email || "test@test.com",
        name: `${currentUser.name || "Usuario"} ${
          currentUser.surname || ""
        }`.trim(),
      };

      const requestData = {
        cart,
        total: Number(total),
        subtotal: Number(subtotal),
        shippingCost: Number(shipping),
        user: userData,
        shippingDetails: currentShippingDetails,
      };

      // Validation
      if (!requestData.cart.length) {
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
      } else {
        throw new Error(
          response.data.message || "No se pudo crear la preferencia de pago"
        );
      }
    } catch (error) {
      let errorMessage =
        "No se pudo inicializar el pago. Por favor, intenta de nuevo.";

      if (axios.isAxiosError(error)) {
        // Handle timeout and connection errors
        if (error.code === "ECONNABORTED" || error.code === "TIMEOUT") {
          errorMessage =
            "Timeout: El servidor tardó demasiado en responder. Intenta de nuevo.";
        }
        // Handle response errors with proper null checking
        else if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          if (data?.message) {
            errorMessage = data.message;
          } else if (status === 400) {
            errorMessage =
              "Datos inválidos. Verifica la información del carrito.";
          } else if (status === 404) {
            errorMessage =
              "Endpoint no encontrado. Verifica que el servidor esté corriendo.";
          } else if (status >= 500) {
            errorMessage = "Error del servidor. Por favor, intenta más tarde.";
          } else {
            errorMessage = `Error del servidor (${status}). Por favor, intenta de nuevo.`;
          }
        }
        // Handle network errors without response
        else if (error.message) {
          errorMessage = `Error de conexión: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setPaymentError(errorMessage);
    } finally {
      setIsLoadingPayment(false);
    }
  }, [total, subtotal, shipping]);

  // Effect for MercadoPago preference creation
  useEffect(() => {
    if (
      currentStep === "payment" &&
      items.length > 0 &&
      user &&
      shippingDetails
    ) {
      createMercadoPagoPreference();
    }
  }, [
    currentStep,
    items.length,
    user,
    shippingDetails,
    createMercadoPagoPreference,
  ]);

  // Memoized loading component
  const LoadingComponent = useMemo(
    () => (
      <div
        className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex items-center justify-center"
        role="status"
        aria-label="Cargando checkout"
      >
        <div className="w-16 h-16 relative">
          <div
            className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"
            aria-hidden="true"
          ></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"
            aria-hidden="true"
          ></div>
        </div>
        <span className="sr-only">Cargando página de checkout...</span>
      </div>
    ),
    []
  );

  // Memoized header section
  const HeaderSection = useMemo(
    () => (
      <div className="flex items-center mb-8">
        <Link
          to="/carrito"
          className="flex items-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 mr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
          aria-label="Volver al carrito de compras"
        >
          <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          <span className="text-sm">Volver al carrito</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          Finalizar compra
        </h1>
      </div>
    ),
    []
  );

  // Memoized main content based on current step
  const MainContent = useMemo(() => {
    const commonCardClasses =
      "bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden";

    if (currentStep === "shipping" || currentStep === "shipping-details") {
      return (
        <div className={commonCardClasses}>
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
      );
    }

    if (currentStep === "payment") {
      return (
        <div className={commonCardClasses}>
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
              onBack={handleBackToShipping}
            />
          </div>
        </div>
      );
    }

    return null;
  }, [
    currentStep,
    user,
    selectedAddressId,
    addresses,
    preferenceId,
    isLoadingPayment,
    paymentError,
    isProcessing,
    total,
    handleShippingSubmit,
    handlePaymentError,
    handleBackToShipping,
  ]);

  // Memoized order summary
  const OrderSummarySection = useMemo(
    () => (
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
    ),
    [
      items,
      itemCount,
      subtotal,
      orderSummaryExpanded,
      currentStep,
      isProcessing,
      toggleOrderSummary,
      handleContinueToShippingDetails,
    ]
  );

  if (isLoading) {
    return LoadingComponent;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {HeaderSection}

        <CheckoutProgress currentStep={currentStep} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">{MainContent}</div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">{OrderSummarySection}</div>
        </div>
      </div>
    </div>
  );
}
