"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Trash,
  Check,
  Edit,
  User,
  AlertCircle,
  DollarSign,
  Mail,
  ChevronRight,
  Shield,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type PaymentMethodType = "credit" | "debit" | "paypal";

type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  cardNumber?: string;
  cardHolder?: string;
  paypalEmail?: string;
  isDefault: boolean;
};

export default function PaymentMethodsView() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      cardNumber: "4111 1111 1111 1111",
      cardHolder: "Juan Pérez",
      isDefault: true,
    },
    {
      id: "2",
      type: "debit",
      cardNumber: "5555 5555 5555 4444",
      cardHolder: "Juan Pérez",
      isDefault: false,
    },
    {
      id: "3",
      type: "paypal",
      paypalEmail: "juan@example.com",
      isDefault: false,
    },
  ]);

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentMethodType>("credit");
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<PaymentMethod, "id">>({
    type: "credit",
    cardNumber: "",
    cardHolder: "",
    isDefault: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      // Activate animations after loading screen disappears
      setTimeout(() => {
        setAnimateContent(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name === "type") {
      setPaymentType(value as PaymentMethodType);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddCard = () => {
    setIsAddingCard(true);
    setEditingCardId(null);
    setPaymentType("credit");
    setFormData({
      type: "credit",
      cardNumber: "",
      cardHolder: "",
      isDefault: false,
    });
    setFormErrors({});
  };

  const handleEditCard = (card: PaymentMethod) => {
    setIsAddingCard(false);
    setEditingCardId(card.id);
    setPaymentType(card.type);
    setFormData({
      type: card.type,
      cardNumber: card.cardNumber || "",
      cardHolder: card.cardHolder || "",
      paypalEmail: card.paypalEmail || "",
      isDefault: card.isDefault,
    });
    setFormErrors({});
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter((card) => card.id !== id));
  };

  const handleSetDefaultCard = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((card) => ({
        ...card,
        isDefault: card.id === id,
      }))
    );
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (paymentType === "credit" || paymentType === "debit") {
      if (!formData.cardNumber?.trim()) {
        errors.cardNumber = "El número de tarjeta es requerido";
      } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
        errors.cardNumber =
          "Formato inválido. Usa el formato: XXXX XXXX XXXX XXXX";
      }

      if (!formData.cardHolder?.trim()) {
        errors.cardHolder = "El nombre del titular es requerido";
      }
    } else if (paymentType === "paypal") {
      if (!formData.paypalEmail?.trim()) {
        errors.paypalEmail = "El correo electrónico de PayPal es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) {
        errors.paypalEmail = "Correo electrónico inválido";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    if (formData.isDefault) {
      // If the new/edited card is default, update all other cards
      setPaymentMethods(
        paymentMethods.map((card) => ({
          ...card,
          isDefault: false,
        }))
      );
    }

    setTimeout(() => {
      if (editingCardId) {
        // Update existing card
        setPaymentMethods(
          paymentMethods.map((card) =>
            card.id === editingCardId ? { ...card, ...formData } : card
          )
        );
      } else {
        // Add new card
        const newCard: PaymentMethod = {
          id: Date.now().toString(),
          ...formData,
        };
        setPaymentMethods([...paymentMethods, newCard]);
      }

      // Reset form
      setIsAddingCard(false);
      setEditingCardId(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    setIsAddingCard(false);
    setEditingCardId(null);
    setFormErrors({});
  };

  // Format card number to show only last 4 digits
  const formatCardNumber = (cardNumber: string) => {
    const lastFourDigits = cardNumber.replace(/\s/g, "").slice(-4);
    return `•••• •••• •••• ${lastFourDigits}`;
  };

  const getPaymentMethodIcon = (type: PaymentMethodType) => {
    switch (type) {
      case "credit":
      case "debit":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case "paypal":
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPaymentMethodName = (type: PaymentMethodType) => {
    switch (type) {
      case "credit":
        return "Tarjeta de Crédito";
      case "debit":
        return "Tarjeta de Débito";
      case "paypal":
        return "PayPal";
      default:
        return "Método de Pago";
    }
  };

  return (
    <div className="relative">
      {/* Loading Screen */}
      {pageLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <CreditCard className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-blue-500 mt-4 font-medium">
            Cargando métodos de pago...
          </p>
        </div>
      )}

      {!pageLoading && (
        <div className="p-6 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
            }
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <div className="mb-2 inline-flex items-center justify-center rounded-full bg-blue-100 px-4 py-1.5">
                <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  MÉTODOS DE PAGO
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Formas de{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600">Pago</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded"></span>
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona tus métodos de pago para compras futuras
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddCard}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center bg-blue-600 hover:bg-blue-700 text-white transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir método de pago
            </motion.button>
          </motion.div>

          {/* Card Form */}
          <AnimatePresence>
            {(isAddingCard || editingCardId) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden mb-8"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                      {editingCardId
                        ? "Editar método de pago"
                        : "Añadir nuevo método de pago"}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={handleCancel}
                      className="px-2 py-2 rounded-lg text-sm font-medium flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <form onSubmit={handleSubmit} className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {/* Payment Type */}
                      <div className="space-y-2">
                        <label
                          htmlFor="type"
                          className="flex items-center text-gray-600 text-sm font-medium"
                        >
                          <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                          Tipo de método de pago
                        </label>
                        <div className="relative group">
                          <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="block w-full rounded-lg border appearance-none border-blue-200 focus:ring-blue-300 focus:border-blue-300 bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300"
                          >
                            <option value="credit">Tarjeta de Crédito</option>
                            <option value="debit">Tarjeta de Débito</option>
                            <option value="paypal">PayPal</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
                          </div>
                        </div>
                      </div>

                      {(paymentType === "credit" ||
                        paymentType === "debit") && (
                        <>
                          {/* Card Number */}
                          <div className="space-y-2">
                            <label
                              htmlFor="cardNumber"
                              className="flex items-center text-gray-600 text-sm font-medium"
                            >
                              <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                              Número de tarjeta
                            </label>
                            <div className="relative group">
                              <input
                                id="cardNumber"
                                name="cardNumber"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className={`block w-full rounded-lg border ${
                                  formErrors.cardNumber
                                    ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                    : "border-blue-200 focus:ring-blue-300 focus:border-blue-300"
                                } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300`}
                              />
                              {formErrors.cardNumber && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                              )}
                            </div>
                            {formErrors.cardNumber && (
                              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                {formErrors.cardNumber}
                              </p>
                            )}
                          </div>

                          {/* Card Holder */}
                          <div className="space-y-2">
                            <label
                              htmlFor="cardHolder"
                              className="flex items-center text-gray-600 text-sm font-medium"
                            >
                              <User className="w-4 h-4 mr-2 text-blue-500" />
                              Titular de la tarjeta
                            </label>
                            <div className="relative group">
                              <input
                                id="cardHolder"
                                name="cardHolder"
                                type="text"
                                placeholder="Nombre como aparece en la tarjeta"
                                value={formData.cardHolder}
                                onChange={handleChange}
                                className={`block w-full rounded-lg border ${
                                  formErrors.cardHolder
                                    ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                    : "border-blue-200 focus:ring-blue-300 focus:border-blue-300"
                                } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300`}
                              />
                              {formErrors.cardHolder && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                              )}
                            </div>
                            {formErrors.cardHolder && (
                              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                {formErrors.cardHolder}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {paymentType === "paypal" && (
                        <div className="space-y-2 md:col-span-2">
                          <label
                            htmlFor="paypalEmail"
                            className="flex items-center text-gray-600 text-sm font-medium"
                          >
                            <Mail className="w-4 h-4 mr-2 text-blue-500" />
                            Correo electrónico de PayPal
                          </label>
                          <div className="relative group">
                            <input
                              id="paypalEmail"
                              name="paypalEmail"
                              type="email"
                              placeholder="tu@email.com"
                              value={formData.paypalEmail}
                              onChange={handleChange}
                              className={`block w-full rounded-lg border ${
                                formErrors.paypalEmail
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-blue-200 focus:ring-blue-300 focus:border-blue-300"
                              } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300`}
                            />
                            {formErrors.paypalEmail && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            )}
                          </div>
                          {formErrors.paypalEmail && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {formErrors.paypalEmail}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Default Payment Method */}
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <input
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="isDefault"
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            Establecer como método de pago predeterminado
                          </label>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Guardar Método</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Methods List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Mis Métodos de Pago
                </h2>
              </div>

              {paymentMethods.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
                        method.isDefault
                          ? "border-blue-500"
                          : "border-gray-100 hover:border-gray-200"
                      } hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="p-5 relative">
                        {method.isDefault && (
                          <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-bold">
                            Predeterminado
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-blue-100">
                              {getPaymentMethodIcon(method.type)}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {getPaymentMethodName(method.type)}
                            </h3>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditCard(method)}
                              className="p-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all"
                              aria-label="Editar método de pago"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCard(method.id)}
                              className="p-1.5 bg-gray-100 text-red-600 rounded-full hover:bg-red-100 transition-all"
                              aria-label="Eliminar método de pago"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-gray-700">
                          {method.type === "paypal" ? (
                            <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <p className="font-medium">
                                {method.paypalEmail}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-lg shadow-md mb-3">
                              <p className="font-mono text-lg mb-2">
                                {formatCardNumber(method.cardNumber || "")}
                              </p>
                              <p className="text-sm">{method.cardHolder}</p>
                            </div>
                          )}
                        </div>

                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefaultCard(method.id)}
                            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
                          >
                            <Check className="w-4 h-4" />
                            Establecer como predeterminado
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="bg-blue-50 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <CreditCard className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No tienes métodos de pago guardados
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Añade un método de pago para agilizar tus compras futuras.
                  </p>
                  <Button
                    onClick={handleAddCard}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir método de pago</span>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Security Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Información de seguridad
                </h3>
              </div>

              <Alert className="bg-blue-50 border border-blue-100 text-gray-700 py-3 rounded-lg">
                <Shield className="h-5 w-5 text-blue-500" />
                <AlertDescription className="text-sm">
                  Tus datos de pago están protegidos con los más altos
                  estándares de seguridad. Nunca compartimos tu información con
                  terceros.
                </AlertDescription>
              </Alert>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
