"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Trash,
  Check,
  Edit,
  Calendar,
  User,
  AlertCircle,
  CreditCardIcon,
  DollarSign,
  Mail,
  ChevronRight,
  Shield,
} from "lucide-react";

type PaymentMethodType = "credit" | "debit" | "paypal";

type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  paypalEmail?: string;
  isDefault: boolean;
};

const PaymentMethodsView = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      cardNumber: "4111 1111 1111 1111",
      cardHolder: "Juan Pérez",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "debit",
      cardNumber: "5555 5555 5555 4444",
      cardHolder: "Juan Pérez",
      expiryDate: "10/26",
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

  const [formData, setFormData] = useState<Omit<PaymentMethod, "id">>({
    type: "credit",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    isDefault: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
      expiryDate: "",
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
      expiryDate: card.expiryDate || "",
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

      if (!formData.expiryDate?.trim()) {
        errors.expiryDate = "La fecha de expiración es requerida";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        errors.expiryDate = "Formato inválido. Usa el formato: MM/YY";
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

    if (!validateForm()) {
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
        return (
          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      case "paypal":
        return (
          <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      default:
        return (
          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      {/* Mejorar el diseño del encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-md">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Métodos de Pago
            </h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>Mi Cuenta</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-blue-600 dark:text-blue-400">
                Métodos de Pago
              </span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAddCard}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <Plus className="w-4 h-4" />
          <span>Añadir método de pago</span>
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg mr-3 shadow-md">
                  <CreditCardIcon className="w-5 h-5 text-white" />
                </div>
                {editingCardId
                  ? "Editar método de pago"
                  : "Añadir nuevo método de pago"}
              </h2>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="type"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <CreditCardIcon className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Tipo de método de pago
                    </label>
                    <div className="relative">
                      <select
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none"
                      >
                        <option value="credit">Tarjeta de Crédito</option>
                        <option value="debit">Tarjeta de Débito</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                  </div>

                  {(paymentType === "credit" || paymentType === "debit") && (
                    <>
                      <div className="space-y-2">
                        <label
                          htmlFor="cardNumber"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <CreditCard className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Número de tarjeta
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardNumber"
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className={`block w-full rounded-xl border ${
                              formErrors.cardNumber
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                          />
                          {formErrors.cardNumber && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {formErrors.cardNumber && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="cardHolder"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Titular de la tarjeta
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardHolder"
                            id="cardHolder"
                            placeholder="Nombre como aparece en la tarjeta"
                            value={formData.cardHolder}
                            onChange={handleChange}
                            className={`block w-full rounded-xl border ${
                              formErrors.cardHolder
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                          />
                          {formErrors.cardHolder && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {formErrors.cardHolder && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.cardHolder}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="expiryDate"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Fecha de expiración
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="expiryDate"
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className={`block w-full rounded-xl border ${
                              formErrors.expiryDate
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                          />
                          {formErrors.expiryDate && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {formErrors.expiryDate && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.expiryDate}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {paymentType === "paypal" && (
                    <div className="space-y-2">
                      <label
                        htmlFor="paypalEmail"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Mail className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Correo electrónico de PayPal
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="paypalEmail"
                          id="paypalEmail"
                          placeholder="tu@email.com"
                          value={formData.paypalEmail}
                          onChange={handleChange}
                          className={`block w-full rounded-xl border ${
                            formErrors.paypalEmail
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                        />
                        {formErrors.paypalEmail && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {formErrors.paypalEmail && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {formErrors.paypalEmail}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="isDefault"
                      className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Establecer como método de pago predeterminado
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-colors relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <Check className="w-4 h-4" />
                    <span>Guardar método de pago</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 ${
              method.isDefault
                ? "border-blue-500 dark:border-blue-600"
                : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            } hover:shadow-xl transition-all duration-300`}
          >
            <div className="p-6 relative overflow-hidden">
              {method.isDefault && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 transform rotate-45 translate-x-2 translate-y-3 text-xs font-bold shadow-md">
                  Predeterminado
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    {getPaymentMethodIcon(method.type)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getPaymentMethodName(method.type)}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditCard(method)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                    aria-label="Editar método de pago"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteCard(method.id)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-300"
                    aria-label="Eliminar método de pago"
                  >
                    <Trash className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                {method.type === "paypal" ? (
                  <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="font-medium">{method.paypalEmail}</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-lg shadow-md mb-3">
                      <p className="font-mono text-lg mb-2">
                        {formatCardNumber(method.cardNumber || "")}
                      </p>
                      <div className="flex justify-between">
                        <p className="text-sm">{method.cardHolder}</p>
                        <p className="text-sm">Exp: {method.expiryDate}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!method.isDefault && (
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSetDefaultCard(method.id)}
                  className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 hover:underline transition-all duration-300"
                >
                  <Check className="w-4 h-4" />
                  Establecer como predeterminado
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {paymentMethods.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CreditCard className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tienes métodos de pago guardados
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Añade un método de pago para agilizar tus compras futuras.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddCard}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-colors mx-auto relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <Plus className="w-4 h-4" />
            <span>Añadir método de pago</span>
          </motion.button>

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start">
              <Shield className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
              <span>
                Añadir métodos de pago te permitirá completar tus compras más
                rápido y de forma segura.
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentMethodsView;
