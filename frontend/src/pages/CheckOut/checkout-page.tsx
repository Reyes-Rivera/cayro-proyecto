"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartConrexr";
import { useAuth } from "@/context/AuthContextType";
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  Home,
  Building,
  Info,
  Lock,
  Plus,
  Edit2,
  Trash2,
  Globe,
  AlertCircle,
  X,
  CheckCircle2,
  Check,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const publickKey = import.meta.env.VITE_REACT_APP_STRIPE_PUBLICk_KEY;

const stripePromise = loadStripe(
  publickKey
);
// Interfaces
export interface Direction {
  street: string;
  city: string;
  country: string;
  neighborhood: string;
  references: string;
  id: number;
  isDefault?: boolean;
}

export interface UserInterface {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: Date;
  password: string;
  gender: string;
  direction?: Direction[];
  active?: boolean;
  role?: string;
  confirmPassword?: string;
  id?: string;
}

// Form validation types
type FormErrors = {
  street?: string;
  city?: string;
  country?: string;
  neighborhood?: string;
  references?: string;
};

// Importar las funciones de API necesarias
import {
  getUserAddresses,
  addAddressUser,
  updateAddressUser,
  deleteAddressUser,
} from "@/api/users"; // Ajusta la ruta de importación según tu estructura de proyecto

// Reemplazar la función addUserAddress
const addUserAddress = async (
  userId: string,
  address: Omit<Direction, "id">
): Promise<Direction> => {
  try {
    // Convertir el userId a número ya que la API espera un número
    const numericId = Number.parseInt(userId);
    const response = await addAddressUser(numericId, address);

    // Asumiendo que la respuesta tiene una estructura como { data: Direction }
    return response.data;
  } catch (error) {
    console.error("Error adding user address:", error);
    throw new Error("Error al añadir la dirección");
  }
};

// Reemplazar la función updateUserAddress
const updateUserAddress = async (
  userId: string,
  addressId: number,
  address: Partial<Direction>
): Promise<Direction> => {
  try {
    // Convertir el userId a número ya que la API espera un número
    const numericId = Number.parseInt(userId);
    const response = await updateAddressUser(numericId, addressId, address);

    // Asumiendo que la respuesta tiene una estructura como { data: Direction }
    return response.data;
  } catch (error) {
    console.error("Error updating user address:", error);
    throw new Error("Error al actualizar la dirección");
  }
};

// Reemplazar la función deleteUserAddress
const deleteUserAddress = async (
  userId: string,
  addressId: number
): Promise<void> => {
  try {
    // Convertir el userId a número ya que la API espera un número
    const numericId = Number.parseInt(userId);
    await deleteAddressUser(numericId, addressId);
  } catch (error) {
    console.error("Error deleting user address:", error);
    throw new Error("Error al eliminar la dirección");
  }
};

// Reemplazar la función updateDefaultAddress
// Como no hay una función específica para establecer una dirección como predeterminada,
// usaremos updateAddressUser para actualizar la dirección con isDefault = true
const updateDefaultAddress = async (
  userId: string,
  addressId: number
): Promise<void> => {
  try {
    // Convertir el userId a número ya que la API espera un número
    const numericId = Number.parseInt(userId);

    // Primero, obtenemos todas las direcciones para actualizar sus estados
    const response = await getUserAddresses(numericId);
    const addresses = response.data || [];

    // Para cada dirección, actualizamos su estado isDefault
    for (const address of addresses) {
      if (address.id === addressId) {
        // Establecer esta dirección como predeterminada
        await updateAddressUser(numericId, address.id, {
          ...address,
          isDefault: true,
        });
      } else if (address.isDefault) {
        // Quitar el estado predeterminado de otras direcciones
        await updateAddressUser(numericId, address.id, {
          ...address,
          isDefault: false,
        });
      }
    }
  } catch (error) {
    console.error("Error updating default address:", error);
    throw new Error("Error al establecer la dirección predeterminada");
  }
};

// Tipos para el componente CheckoutForm
interface CheckoutFormProps {
  clientSecret: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (errorMessage: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  total: number;
}

interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
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
          onPaymentSuccess(result.paymentIntent);
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
      setBillingDetails((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof BillingDetails] as Record<string, any>),
          [child]: value,
        },
      }));
    } else {
      setBillingDetails((prev) => ({
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



type CheckoutStep = "shipping" | "payment" | "confirmation";
export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  console.log(items);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [errors, setErrors] = useState<FormErrors>({});
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  // Eliminamos la variable no utilizada
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState<Direction[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState<Direction>({
    street: "",
    city: "",
    country: "México",
    neighborhood: "",
    references: "",
    id: 0,
    isDefault: false,
  });

  // Calculate order totals
  const shipping =
    shippingMethod === "standard" ? (subtotal > 100 ? 0 : 10) : 25;
  const total = subtotal + shipping;

  // Load user addresses from API
  useEffect(() => {
    const loadUserAddresses = async () => {
      if (!isAuthenticated || !user || !user.id) {
        setIsLoadingAddresses(false);
        return;
      }

      try {
        setIsLoadingAddresses(true);
        setAddressError(null);

        // Llamada a la API para obtener las direcciones
        const response = await getUserAddresses(+user.id);
        // Extraer las direcciones de la respuesta
        const userAddresses = response.data || [];

        setAddresses(userAddresses);

        // Set default address as selected
        const defaultAddress = userAddresses.find((addr:Direction) => addr.isDefault);
        if (defaultAddress && defaultAddress.id) {
          setSelectedAddressId(defaultAddress.id.toString());
        } else if (userAddresses.length > 0 && userAddresses[0].id) {
          setSelectedAddressId(userAddresses[0].id.toString());
        } else {
          // If no addresses, show the form
          setIsAddressFormVisible(true);
        }
      } catch (error) {
        console.error("Error loading user addresses:", error);
        setAddressError(
          "No se pudieron cargar las direcciones. Por favor, inténtalo de nuevo."
        );
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadUserAddresses();
  }, [isAuthenticated, user]);

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

  // Crear PaymentIntent cuando el usuario llega al paso de pago
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

          // Llamar a la API de NestJS para crear el PaymentIntent
          const response = await axios.post(
            "http://localhost:5000/stripe/create-payment-intent",
            { cart }
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
        } finally {
          setIsLoadingPaymentIntent(false);
        }
      }
    };

    createPaymentIntent();
  }, [currentStep, paymentMethod, items]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle form input changes for new address
  const handleAddressInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate address form
  const validateAddressForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newAddress.street.trim()) {
      newErrors.street = "La dirección es requerida";
    }

    if (!newAddress.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    if (!newAddress.country.trim()) {
      newErrors.country = "El país es requerido";
    }

    if (!newAddress.neighborhood.trim()) {
      newErrors.neighborhood = "La colonia es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle adding a new address
  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setEditingAddressId(null);
    setIsAddressFormVisible(true);
    setNewAddress({
      street: "",
      city: "",
      country: "México",
      neighborhood: "",
      references: "",
      id: 0,
      isDefault: false,
    });

    // Scroll to form
    setTimeout(() => {
      document
        .getElementById("address-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Handle editing an address
  const handleEditAddress = (address: Direction) => {
    if (!address.id) return;

    setIsAddingAddress(false);
    setEditingAddressId(address.id.toString());
    setIsAddressFormVisible(true);
    setNewAddress(address);

    // Scroll to form
    setTimeout(() => {
      document
        .getElementById("address-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Handle deleting an address
  const handleDeleteAddress = (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const numericId = Number.parseInt(id);
          setIsDeleting(id);

          // Call API to delete the address
          if (user && user.id) {
            await deleteUserAddress(user.id, numericId);
          }

          // Remove address from state
          setAddresses(addresses.filter((addr) => addr.id !== numericId));

          // If deleted address was selected, select another one
          if (selectedAddressId === id) {
            const defaultAddress = addresses.find(
              (addr) => addr.isDefault && addr.id !== numericId
            );
            if (defaultAddress && defaultAddress.id) {
              setSelectedAddressId(defaultAddress.id.toString());
            } else if (addresses.length > 1) {
              const newSelectedId = addresses.find(
                (addr) => addr.id !== numericId
              )?.id;
              if (newSelectedId) setSelectedAddressId(newSelectedId.toString());
            } else {
              setSelectedAddressId(null);
              setIsAddressFormVisible(true);
            }
          }

          Swal.fire({
            title: "¡Eliminada!",
            text: "La dirección ha sido eliminada.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting address:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la dirección. Por favor, inténtalo de nuevo.",
            icon: "error",
          });
        } finally {
          setIsDeleting(null);
        }
      }
    });
  };

  // Handle setting default address
  const handleSetDefaultAddress = async (id: string) => {
    try {
      const numericId = Number.parseInt(id);

      // Call API to update default address
      if (user && user.id) {
        await updateDefaultAddress(user.id, numericId);
      }

      // Update addresses in state
      setAddresses(
        addresses.map((address) => ({
          ...address,
          isDefault: address.id === numericId,
        }))
      );
      setSelectedAddressId(id);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "¡Dirección predeterminada actualizada!",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error setting default address:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la dirección predeterminada. Por favor, inténtalo de nuevo.",
        icon: "error",
      });
    }
  };

  // Handle saving a new address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateAddressForm()) {
      try {
        setIsSavingAddress(true);

        if (editingAddressId && user && user.id) {
          // Update existing address
          const editingIdNumber = Number.parseInt(editingAddressId);

          // Call API to update address
          const addressData = {
            street: newAddress.street,
            city: newAddress.city,
            country: newAddress.country,
            neighborhood: newAddress.neighborhood,
            references: newAddress.references,
            isDefault: newAddress.isDefault,
          };

          await updateUserAddress(user.id, editingIdNumber, addressData);

          setAddresses(
            addresses.map((addr) =>
              addr.id === editingIdNumber
                ? { ...newAddress, id: editingIdNumber }
                : addr
            )
          );

          if (newAddress.isDefault) {
            // If setting as default, update all other addresses
            await updateDefaultAddress(user.id, editingIdNumber);

            setAddresses((prev) =>
              prev.map((addr) => ({
                ...addr,
                isDefault: addr.id === editingIdNumber,
              }))
            );
            setSelectedAddressId(editingAddressId);
          }

          Swal.fire({
            icon: "success",
            title: "¡Dirección actualizada!",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false,
          });
        } else if (user && user.id) {
          // Add new address
          // Call API to add new address
          const addressData = {
            street: newAddress.street,
            city: newAddress.city,
            country: newAddress.country,
            neighborhood: newAddress.neighborhood,
            references: newAddress.references,
            isDefault: newAddress.isDefault || addresses.length === 0,
          };

          const addedAddress = await addUserAddress(user.id, addressData);

          if (newAddress.isDefault || addresses.length === 0) {
            // If this is default or the first address, update all addresses
            await updateDefaultAddress(user.id, addedAddress.id);

            setAddresses((prev) => [
              ...prev.map((addr) => ({ ...addr, isDefault: false })),
              { ...addedAddress, isDefault: true },
            ]);
            setSelectedAddressId(addedAddress.id.toString());
          } else {
            setAddresses([...addresses, addedAddress]);
            if (!selectedAddressId) {
              setSelectedAddressId(addedAddress.id.toString());
            }
          }

          Swal.fire({
            icon: "success",
            title: "¡Dirección agregada!",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false,
          });
        }

        setIsAddressFormVisible(false);
        setIsAddingAddress(false);
        setEditingAddressId(null);

        // Scroll back to address list
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error saving address:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo guardar la dirección. Por favor, inténtalo de nuevo.",
          icon: "error",
        });
      } finally {
        setIsSavingAddress(false);
      }
    }
  };

  // Handle canceling address form
  const handleCancelAddressForm = () => {
    setIsAddressFormVisible(false);
    setIsAddingAddress(false);
    setEditingAddressId(null);

    // If no addresses and canceling, show empty state
    if (addresses.length === 0) {
      setIsAddressFormVisible(true);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle shipping form submission
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      selectedAddressId ||
      (addresses.length === 0 && validateAddressForm())
    ) {
      try {
        // If adding a new address and no addresses exist, save it first
        if (addresses.length === 0 && isAddressFormVisible && user && user.id) {
          setIsSavingAddress(true);

          // Call API to add new address
          const addressData = {
            street: newAddress.street,
            city: newAddress.city,
            country: newAddress.country,
            neighborhood: newAddress.neighborhood,
            references: newAddress.references,
            isDefault: true,
          };

          const addedAddress = await addUserAddress(user.id, addressData);

          setAddresses([{ ...addedAddress, isDefault: true }]);
          setSelectedAddressId(addedAddress.id.toString());

          setIsSavingAddress(false);
        }

        setCurrentStep("payment");
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error saving address during checkout:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo guardar la dirección. Por favor, inténtalo de nuevo.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Selecciona una dirección",
        text: "Por favor selecciona una dirección de envío para continuar",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    setPaymentIntent(paymentIntent);
    setCurrentStep("confirmation");
    clearCart();
    window.scrollTo(0, 0);
  };

  // Manejar el error del pago
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

  // Handle payment submission (para PayPal)
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "paypal") {
      setIsProcessing(true);

      try {
        // Aquí iría la lógica para procesar el pago con PayPal
        // Simulamos un proceso de pago
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Success
        setCurrentStep("confirmation");
        clearCart();
        window.scrollTo(0, 0);
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema procesando tu pago. Por favor intenta nuevamente.",
          icon: "error",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Toggle order summary on mobile
  const toggleOrderSummary = () => {
    setOrderSummaryExpanded(!orderSummaryExpanded);
  };

  // Función para manejar errores de carga de imágenes
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/placeholder.svg?height=64&width=64";
  };

  // Función para obtener la URL de la imagen del producto
  const getProductImageUrl = (item: any) => {
    // Verificar si existe la propiedad variant con imageUrl
    if (item.variant && item.variant.imageUrl) {
      return item.variant.imageUrl;
    }
    // Verificar si existe la propiedad imageUrl directamente en el item
    else if (item.imageUrl) {
      return item.imageUrl;
    }
    // Verificar si existe la propiedad product con image
    else if (item.product && item.product.image) {
      return item.product.image;
    }
    // Devolver imagen de placeholder como último recurso
    return "/placeholder.svg?height=64&width=64";
  };

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
              Tu pedido ha sido recibido y está siendo procesado. Te hemos
              enviado un correo electrónico con los detalles de tu compra.
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
                  <span className="text-gray-600 dark:text-gray-400">
                    Fecha:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${total.toFixed(2)}
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/cart"
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
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ["shipping", "payment", "confirmation"].includes(
                      currentStep
                    )
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  1
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Envío
                </span>
              </div>
              <div
                className={`w-12 h-1 ${
                  ["payment", "confirmation"].includes(currentStep)
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ["payment", "confirmation"].includes(currentStep)
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  2
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Pago
                </span>
              </div>
              <div
                className={`w-12 h-1 ${
                  ["confirmation"].includes(currentStep)
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ["confirmation"].includes(currentStep)
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  3
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Confirmación
                </span>
              </div>
            </div>
          </div>
        </div>

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

                  {/* User info summary */}
                  {user && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-100 dark:border-blue-800/50">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full p-2">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="ml-3 text-base font-medium text-gray-900 dark:text-white">
                          Información personal
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Nombre:
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name} {user.surname}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Email:
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Teléfono:
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address selection */}
                  <form onSubmit={handleShippingSubmit}>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500" />
                          Dirección de envío
                        </h3>
                        {addresses.length > 0 && !isAddressFormVisible && (
                          <button
                            type="button"
                            onClick={handleAddAddress}
                            className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Añadir nueva dirección
                          </button>
                        )}
                      </div>

                      {/* Loading state for addresses */}
                      {isLoadingAddresses && (
                        <div className="flex justify-center items-center py-8">
                          <div className="w-10 h-10 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"></div>
                          </div>
                          <p className="ml-3 text-gray-600 dark:text-gray-400">
                            Cargando direcciones...
                          </p>
                        </div>
                      )}

                      {/* Error state for addresses */}
                      {addressError && !isLoadingAddresses && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4 mb-4">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {addressError}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddAddress}
                            className="mt-3 text-sm text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Añadir nueva dirección manualmente
                          </button>
                        </div>
                      )}

                      {/* Address list */}
                      {!isLoadingAddresses &&
                        addresses.length > 0 &&
                        !isAddressFormVisible && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {addresses.map((address) => (
                              <div
                                key={address.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                  selectedAddressId === address.id.toString()
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                                }`}
                                onClick={() =>
                                  setSelectedAddressId(address.id.toString())
                                }
                              >
                                <div className="flex justify-between mb-2">
                                  <div className="flex items-center">
                                    <input
                                      type="radio"
                                      id={`address-${address.id}`}
                                      name="selectedAddress"
                                      checked={
                                        selectedAddressId ===
                                        address.id.toString()
                                      }
                                      onChange={() =>
                                        setSelectedAddressId(
                                          address.id.toString()
                                        )
                                      }
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label
                                      htmlFor={`address-${address.id}`}
                                      className="ml-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                                    >
                                      {address.street}
                                    </label>
                                    {address.isDefault && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        Predeterminada
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditAddress(address);
                                      }}
                                      className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-500"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAddress(
                                          address.id.toString()
                                        );
                                      }}
                                      className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-500"
                                    >
                                      {isDeleting === address.id.toString() ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                <div className="pl-6 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                  <p>{address.neighborhood}</p>
                                  <p>
                                    {address.city}, {address.country}
                                  </p>
                                  {address.references && (
                                    <p>Ref: {address.references}</p>
                                  )}
                                </div>
                                {!address.isDefault &&
                                  selectedAddressId ===
                                    address.id.toString() && (
                                    <div className="mt-3 pl-6">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSetDefaultAddress(
                                            address.id.toString()
                                          );
                                        }}
                                        className="text-xs text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
                                      >
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Establecer como predeterminada
                                      </button>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Address form */}
                      {isAddressFormVisible && (
                        <div
                          id="address-form"
                          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">
                              {isAddingAddress
                                ? "Nueva dirección"
                                : "Editar dirección"}
                            </h3>
                            {addresses.length > 0 && (
                              <button
                                type="button"
                                onClick={handleCancelAddressForm}
                                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 flex items-center"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancelar
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Calle */}
                            <div className="space-y-2">
                              <label
                                htmlFor="street"
                                className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                              >
                                <Home className="w-4 h-4 mr-2 text-blue-600" />
                                Calle y número
                              </label>
                              <div className="relative group">
                                <input
                                  type="text"
                                  id="street"
                                  name="street"
                                  placeholder="Ej. Av. Constitución 123"
                                  value={newAddress.street}
                                  onChange={handleAddressInputChange}
                                  className={`block w-full rounded-lg border ${
                                    errors.street
                                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                      : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                                />
                                {errors.street && (
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  </div>
                                )}
                              </div>
                              {errors.street && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.street}
                                </p>
                              )}
                            </div>

                            {/* Colonia/Barrio */}
                            <div className="space-y-2">
                              <label
                                htmlFor="neighborhood"
                                className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                              >
                                <Building className="w-4 h-4 mr-2 text-blue-600" />
                                Colonia
                              </label>
                              <div className="relative group">
                                <input
                                  type="text"
                                  id="neighborhood"
                                  name="neighborhood"
                                  placeholder="Ej. Centro"
                                  value={newAddress.neighborhood}
                                  onChange={handleAddressInputChange}
                                  className={`block w-full rounded-lg border ${
                                    errors.neighborhood
                                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                      : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                                />
                                {errors.neighborhood && (
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  </div>
                                )}
                              </div>
                              {errors.neighborhood && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.neighborhood}
                                </p>
                              )}
                            </div>

                            {/* Ciudad */}
                            <div className="space-y-2">
                              <label
                                htmlFor="city"
                                className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                              >
                                <Building className="w-4 h-4 mr-2 text-blue-600" />
                                Ciudad
                              </label>
                              <div className="relative group">
                                <input
                                  type="text"
                                  id="city"
                                  name="city"
                                  placeholder="Ej. Monterrey"
                                  value={newAddress.city}
                                  onChange={handleAddressInputChange}
                                  className={`block w-full rounded-lg border ${
                                    errors.city
                                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                      : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                                />
                                {errors.city && (
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  </div>
                                )}
                              </div>
                              {errors.city && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.city}
                                </p>
                              )}
                            </div>

                            {/* País */}
                            <div className="space-y-2">
                              <label
                                htmlFor="country"
                                className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                              >
                                <Globe className="w-4 h-4 mr-2 text-blue-600" />
                                País
                              </label>
                              <div className="relative group">
                                <select
                                  id="country"
                                  name="country"
                                  value={newAddress.country}
                                  onChange={handleAddressInputChange}
                                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400 appearance-none"
                                >
                                  <option value="México">México</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                  <ChevronDown className="h-5 w-5" />
                                </div>
                              </div>
                            </div>

                            {/* Referencias */}
                            <div className="md:col-span-2 space-y-2">
                              <label
                                htmlFor="references"
                                className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                              >
                                <Info className="w-4 h-4 mr-2 text-blue-600" />
                                Referencias (opcional)
                              </label>
                              <div className="relative group">
                                <textarea
                                  id="references"
                                  name="references"
                                  placeholder="Ej. Casa blanca con rejas negras, frente a la farmacia"
                                  value={newAddress.references}
                                  onChange={handleAddressInputChange}
                                  rows={2}
                                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400"
                                />
                              </div>
                            </div>
                          </div>

                          {(isAddingAddress || !newAddress.isDefault) && (
                            <div className="flex items-center mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-800 dark:text-blue-300 py-3 rounded-xl px-4">
                              <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={newAddress.isDefault}
                                onChange={(e) =>
                                  setNewAddress({
                                    ...newAddress,
                                    isDefault: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor="isDefault"
                                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-500" />
                                Establecer como dirección predeterminada
                              </label>
                            </div>
                          )}

                          <div className="flex justify-end gap-3 mt-6">
                            {addresses.length > 0 && (
                              <button
                                type="button"
                                onClick={handleCancelAddressForm}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium flex items-center"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={handleSaveAddress}
                              disabled={isSavingAddress}
                              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium flex items-center disabled:opacity-70"
                            >
                              {isSavingAddress ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  {isAddingAddress
                                    ? "Guardando..."
                                    : "Actualizando..."}
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  {isAddingAddress
                                    ? "Guardar dirección"
                                    : "Actualizar dirección"}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Empty state */}
                      {!isLoadingAddresses &&
                        addresses.length === 0 &&
                        !isAddressFormVisible && (
                          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                              No tienes direcciones guardadas
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Añade una dirección para continuar con tu compra
                            </p>
                            <button
                              type="button"
                              onClick={handleAddAddress}
                              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium flex items-center mx-auto"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Añadir dirección
                            </button>
                          </div>
                        )}
                    </div>

                    {/* Shipping Methods */}
                    <div className="mb-6">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                        Método de envío
                      </h3>

                      <div className="space-y-3">
                        <label
                          className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                            shippingMethod === "standard"
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="standard"
                            checked={shippingMethod === "standard"}
                            onChange={() => setShippingMethod("standard")}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Envío estándar
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {subtotal > 100 ? "Gratis" : "$10.00"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Entrega en 3-5 días hábiles
                            </p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                            shippingMethod === "express"
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={() => setShippingMethod("express")}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Envío express
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                $25.00
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Entrega en 1-2 días hábiles
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSavingAddress}
                        className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70"
                      >
                        {isSavingAddress ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            Continuar al pago
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
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
                                <span className="text-xs font-medium">
                                  VISA
                                </span>
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
                              <span className="text-xs font-medium">
                                PayPal
                              </span>
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
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
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
                            onClick={() => setCurrentStep("shipping")}
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
                          Al hacer clic en "Continuar con PayPal", serás
                          redirigido a la página de PayPal para completar tu
                          pago de forma segura.
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep("shipping")}
                          className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <ArrowLeft className="mr-2 w-5 h-5" />
                          Volver
                        </button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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
                        </motion.button>
                      </div>
                    </form>
                  )}

                  {/* Security Note */}
                  <div className="mt-6 flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Lock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tus datos de pago están seguros. Utilizamos encriptación
                        de 256 bits y no almacenamos los detalles de tu tarjeta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-20">
              {/* Mobile Header with Toggle */}
              <div className="lg:hidden p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-base font-medium text-gray-900 dark:text-white">
                  Resumen del pedido
                </h2>
                <button
                  onClick={toggleOrderSummary}
                  className="text-gray-500 dark:text-gray-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {orderSummaryExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Main Content - Collapsible on Mobile */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  orderSummaryExpanded
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0 lg:max-h-[1000px] lg:opacity-100 overflow-hidden"
                }`}
              >
                <div className="p-4 lg:p-6">
                  {/* Desktop Header */}
                  <h2 className="hidden lg:block text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Resumen del pedido
                  </h2>

                  {/* Items */}
                  <div className="mb-4">
                    <div className="max-h-64 overflow-y-auto pr-2">
                      {items.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <img
                              src={
                                getProductImageUrl(item) || "/placeholder.svg"
                              }
                              alt={
                                item.product?.name || item.name || "Producto"
                              }
                              className="h-full w-full object-cover object-center"
                              onError={handleImageError}
                            />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                                <h3 className="line-clamp-1">
                                  {item.product?.name ||
                                    item.name ||
                                    "Producto"}
                                </h3>
                                <p className="ml-4">
                                  $
                                  {(
                                    (item.variant?.price || item.price) *
                                    item.quantity
                                  ).toFixed(2)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {(item.variant?.color?.name ||
                                  item.color?.name) &&
                                  `${
                                    item.variant?.color?.name ||
                                    item.color?.name
                                  } · `}
                                {item.variant?.size?.name || item.size?.name}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <p className="text-gray-500 dark:text-gray-400">
                                Cant. {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Subtotal ({itemCount}{" "}
                        {itemCount === 1 ? "producto" : "productos"})
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Envío
                      </span>
                      {shipping === 0 ? (
                        <span className="text-green-500">Gratis</span>
                      ) : (
                        <span className="text-gray-900 dark:text-white">
                          ${shipping.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-gray-900 dark:text-white text-lg">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Impuestos incluidos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-start">
                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        Información de envío
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {shippingMethod === "standard"
                          ? "Envío estándar: 3-5 días hábiles"
                          : "Envío express: 1-2 días hábiles"}
                      </p>
                      {subtotal > 100 && shippingMethod === "standard" && (
                        <p className="text-sm text-green-500 mt-1">
                          ¡Envío gratis en compras mayores a $100!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Footer - Always visible */}
              <div className="lg:hidden p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Total
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    ${total.toFixed(2)}
                  </div>
                </div>
                {currentStep === "shipping" ? (
                  <button
                    onClick={handleShippingSubmit}
                    disabled={isSavingAddress}
                    className="py-2.5 px-4 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70"
                  >
                    {isSavingAddress ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        Continuar
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing || paymentMethod === "card"}
                    className="py-2.5 px-4 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Pagar
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
