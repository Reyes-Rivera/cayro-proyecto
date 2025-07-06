"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  ShoppingCart,
  Loader2,
  Edit3,
  Truck,
  CreditCard,
  LocateIcon as LocationIcon,
  Hash,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Send,
} from "lucide-react";
import { getSaleById } from "@/api/sales";
import Swal from "sweetalert2";
import type { Order, StatusUpdateData } from "../Orders";
import Loader from "@/components/web-components/Loader";

interface OrderDetailsProps {
  order: { id: number };
  onBack: () => void;
  onUpdateStatus: (statusData: StatusUpdateData) => Promise<boolean>;
}

const statusConfig = {
  PENDING: {
    label: "Pendiente",
    color: "bg-gradient-to-r from-yellow-400 to-orange-400",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    icon: Clock,
  },
  PROCESSING: {
    label: "Procesando",
    color: "bg-gradient-to-r from-blue-400 to-blue-600",
    textColor: "text-blue-800",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    icon: AlertCircle,
  },
  PACKED: {
    label: "Empacado",
    color: "bg-gradient-to-r from-purple-400 to-purple-600",
    textColor: "text-purple-800",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    icon: Package,
  },
  SHIPPED: {
    label: "Enviado",
    color: "bg-gradient-to-r from-indigo-400 to-indigo-600",
    textColor: "text-indigo-800",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    icon: Truck,
  },
  DELIVERED: {
    label: "Entregado",
    color: "bg-gradient-to-r from-green-400 to-green-600",
    textColor: "text-green-800",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelado",
    color: "bg-gradient-to-r from-red-400 to-red-600",
    textColor: "text-red-800",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    icon: X,
  },
};

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order: orderProp,
  onBack,
  onUpdateStatus,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCompany, setShippingCompany] = useState("");
  const [showTrackingFields, setShowTrackingFields] = useState(false);

  const formatCurrency = (amount: string | number) => {
    const numAmount =
      typeof amount === "string" ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadOrderDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getSaleById(orderProp.id);
      if (response && response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los detalles del pedido.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusSelection = (status: string) => {
    setSelectedStatus(status);
    if (status === "SHIPPED") {
      setShowTrackingFields(true);
    } else {
      setShowTrackingFields(false);
      setTrackingNumber("");
      setShippingCompany("");
    }
  };

  const handleStatusChange = async () => {
    if (!order || !selectedStatus) return;

    // Validate tracking fields if status is SHIPPED
    if (
      selectedStatus === "SHIPPED" &&
      (!trackingNumber.trim() || !shippingCompany.trim())
    ) {
      Swal.fire({
        title: "Campos requeridos",
        text: "Por favor ingresa el número de rastreo y la empresa de envío.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setUpdatingStatus(true);
    try {
      const statusData: StatusUpdateData = {
        id: +order.id,
        status: selectedStatus,
        userId: order.userId,
      };

      // Add tracking info if status is SHIPPED
      if (selectedStatus === "SHIPPED") {
        statusData.trackingNumber = trackingNumber.trim();
        statusData.shippingCompany = shippingCompany.trim();
      }

      // Call the parent function to update status
      const success = await onUpdateStatus(statusData);
      if (success) {
        // Reload order details to get updated data
        await loadOrderDetails();
        closeModal();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const closeModal = () => {
    setShowStatusModal(false);
    setSelectedStatus("");
    setTrackingNumber("");
    setShippingCompany("");
    setShowTrackingFields(false);
  };

  useEffect(() => {
    loadOrderDetails();
  }, [orderProp.id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!order) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-500 dark:text-gray-400">
          No se pudo cargar el pedido
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  const currentStatus =
    statusConfig[order.status as keyof typeof statusConfig] ||
    statusConfig.PENDING;
  const StatusIcon = currentStatus.icon;
  const defaultAddress = order.user.userAddresses.find((ua) => ua.isDefault);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with gradient background */}
      <div className="bg-blue-500 dark:bg-blue-600 rounded-2xl shadow-xl p-4 sm:p-6 text-white mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBack}
              className="flex items-center text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-2 rounded-lg backdrop-blur-sm text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Volver a la lista
            </button>
            <div
              className={`px-3 sm:px-4 py-2 rounded-full ${currentStatus.color} text-white font-medium flex items-center  justify-center shadow-lg text-sm sm:text-base`}
            >
              <StatusIcon className="w-4 h-4 mr-2" />
              {currentStatus.label}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setShowStatusModal(true)}
              className="bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-2 rounded-lg backdrop-blur-sm transition-colors flex items-center text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Cambiar Estado
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Pedido #{order.id}
            </h1>
            <div className="flex items-center text-white/80 mb-2 text-sm sm:text-base">
              <Hash className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="break-all">
                Referencia: {order.saleReference}
              </span>
            </div>
            <div className="flex items-center text-white/80 text-sm sm:text-base">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Creado el {formatDate(order.createdAt)}</span>
            </div>
          </div>
          <div className="text-left lg:text-right">
            <div className="text-3xl sm:text-4xl font-bold mb-2">
              {formatCurrency(order.totalAmount)}
            </div>
            <div className="text-white/80 text-sm sm:text-base">
              Total del pedido
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Customer Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Información del Cliente
            </h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl">
              <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Nombre completo
              </label>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">
                {order.user.name} {order.user.surname}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl">
              <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                Email
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium break-all">
                {order.user.email}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl">
              <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                Teléfono
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                {order.user.phone || "No proporcionado"}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Información de Envío
            </h2>
          </div>
          {defaultAddress ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl">
                <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <LocationIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  Dirección
                </label>
                <div className="space-y-1 text-sm sm:text-base">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {defaultAddress.address.street}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    Colonia: {defaultAddress.address.colony}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {defaultAddress.address.city},{" "}
                    {defaultAddress.address.state}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    CP: {defaultAddress.address.postalCode},{" "}
                    {defaultAddress.address.country}
                  </p>
                </div>
              </div>
              {order.references && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    Referencias
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {order.references}
                  </p>
                </div>
              )}
              {(order.betweenStreetOne || order.betweenStreetTwo) && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    Entre calles
                  </label>
                  <div className="space-y-1 text-sm sm:text-base">
                    {order.betweenStreetOne && (
                      <p className="text-gray-900 dark:text-white">
                        {order.betweenStreetOne}
                      </p>
                    )}
                    {order.betweenStreetTwo && (
                      <p className="text-gray-900 dark:text-white">
                        {order.betweenStreetTwo}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              No se encontró dirección de envío
            </p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Productos del Pedido
          </h2>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {order.saleDetails.map((detail, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 break-words">
                    {detail.productVariant.product.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Color: {detail.productVariant.color.name}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Talla: {detail.productVariant.size.name}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium break-all">
                      Código: {detail.productVariant.barcode}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Cantidad
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                      {detail.quantity}
                    </div>
                  </div>
                  <div className="text-center bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Precio unit.
                    </div>
                    <div className="text-xs sm:text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(detail.unitPrice)}
                    </div>
                  </div>
                  <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 sm:p-3 rounded-lg shadow-sm">
                    <div className="text-xs font-medium opacity-90">Total</div>
                    <div className="text-xs sm:text-lg font-bold">
                      {formatCurrency(detail.totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 sm:p-6 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Subtotal
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(order.subtotalAmount)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Envío
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(order.shippingCost)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-blue-500">
                    Total
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>
            </div>
            <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {order.saleDetails.length}{" "}
              {order.saleDetails.length === 1 ? "producto" : "productos"} •{" "}
              {order.saleDetails.reduce(
                (sum, detail) => sum + detail.quantity,
                0
              )}{" "}
              unidades totales
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Cambiar Estado del Pedido
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Selecciona el nuevo estado para el pedido #{order.id}
              </p>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const StatusIcon = config.icon;
                  const isSelected = selectedStatus === status;
                  const isCurrent = order.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusSelection(status)}
                      disabled={updatingStatus || isCurrent}
                      className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : isCurrent
                          ? `${config.bgColor} ${config.borderColor} ${config.textColor}`
                          : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                      } ${
                        updatingStatus
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center">
                        <StatusIcon
                          className={`w-4 h-4 sm:w-5 sm:h-5 mr-3 flex-shrink-0 ${
                            isSelected
                              ? "text-blue-600"
                              : isCurrent
                              ? config.textColor
                              : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`font-medium text-sm sm:text-base ${
                            isSelected
                              ? "text-blue-700 dark:text-blue-400"
                              : isCurrent
                              ? config.textColor
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {config.label}
                        </span>
                        {isCurrent && (
                          <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full flex-shrink-0">
                            Actual
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tracking fields for SHIPPED status */}
              {showTrackingFields && (
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <h4 className="font-semibold text-sm sm:text-base text-indigo-800 dark:text-indigo-400 flex items-center">
                    <Truck className="w-4 h-4 mr-2 flex-shrink-0" />
                    Información de Envío
                  </h4>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número de Rastreo *
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Ej: 1234567890"
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={updatingStatus}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Empresa de Envío *
                    </label>
                    <select
                      value={shippingCompany}
                      onChange={(e) => setShippingCompany(e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={updatingStatus}
                    >
                      <option value="">Seleccionar empresa</option>
                      <option value="DHL">DHL</option>
                      <option value="FedEx">FedEx</option>
                      <option value="UPS">UPS</option>
                      <option value="Estafeta">Estafeta</option>
                      <option value="Paquetexpress">Paquetexpress</option>
                      <option value="Redpack">Redpack</option>
                      <option value="Correos de México">
                        Correos de México
                      </option>
                    </select>
                  </div>
                  <div className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 flex items-start">
                    <Send className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Se enviará un correo automático al cliente con la
                      información de rastreo
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={closeModal}
                  disabled={updatingStatus}
                  className="px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={
                    updatingStatus ||
                    !selectedStatus ||
                    selectedStatus === order.status
                  }
                  className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base order-1 sm:order-2"
                >
                  {updatingStatus ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Actualizando...
                    </>
                  ) : (
                    "Actualizar Estado"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
