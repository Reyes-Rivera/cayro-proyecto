"use client";

import type React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  UserIcon,
  MapPin,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Package,
  XCircle,
} from "lucide-react";

// Interfaces
interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  colony: string;
}
export interface Color {
  id: number;
  name: string;
  hexValue: string;
}
interface UserAddress {
  id: number;
  userId: number;
  addressId: number;
  isDefault: boolean;
  address: Address;
}

interface SaleUser {
  name: string;
  surname: string;
  email: string;
  phone: string;
  userAddresses: UserAddress[];
}

interface Product {
  name: string;
}

interface Size {
  name: string;
}
export interface Image {
  id: number;
  url: string;
  angle: string; // Puede ser "front", "side", "back", etc.
}
interface ProductVariant {
  barcode: string;
  price: number;
  product: Product;
  color: Color;
  size: Size;
  images: Image[];
}

interface SaleDetail {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productVariant: ProductVariant;
}

interface Sale {
  id: number;
  userId: number;
  addressId: number;
  employeeId: number;
  subtotalAmount: string;
  shippingCost: string;
  totalAmount: string;
  saleReference: string;
  references: string;
  betweenStreetOne: string;
  betweenStreetTwo: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  user: SaleUser;
  saleDetails: SaleDetail[];
  address: Address;
}

interface SaleDetailsProps {
  sale: Sale;
  onBack: () => void;
}

const SaleDetails: React.FC<SaleDetailsProps> = ({ sale, onBack }) => {
  // Función para obtener el color del estado
  console.log(sale);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "CONFIRMED":
        return "Confirmado";
      case "SHIPPED":
        return "Enviado";
      case "DELIVERED":
        return "Entregado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  // Función para obtener el icono del estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-3 h-3" />;
      case "CONFIRMED":
        return <AlertCircle className="w-3 h-3" />;
      case "SHIPPED":
        return <Truck className="w-3 h-3" />;
      case "DELIVERED":
        return <CheckCircle className="w-3 h-3" />;
      case "CANCELLED":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para formatear precio
  const formatPrice = (price: string | number) => {
    const numPrice =
      typeof price === "string" ? Number.parseFloat(price) : price;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(numPrice);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0 pb-20 sm:pb-6">
      {/* Header de la página */}
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

        <div className="relative">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 sm:p-4 lg:p-6 pb-4 sm:pb-6 rounded-b-[1.5rem] sm:rounded-b-[2.5rem]">
            {/* Mobile Layout */}
            <div className="block lg:hidden">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="bg-white/20 hover:bg-white/30 transition-colors text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium flex items-center"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Volver
                </button>
                <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full text-white font-medium">
                  ID: #{sale.id}
                </span>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-white/20 p-2 sm:p-2.5 rounded-full flex-shrink-0 mt-0.5 sm:mt-1">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-tight mb-2 sm:mb-3 break-words">
                    Venta #{sale.saleReference}
                  </h2>
                  <div className="flex items-start">
                    <UserIcon className="w-3 h-3 text-white/80 flex-shrink-0 mt-0.5 mr-1.5" />
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed break-words">
                      {sale?.user?.name} {sale?.user?.surname}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="flex justify-between items-start">
                <div className="flex items-center flex-1 min-w-0 mr-4">
                  <div className="bg-white/20 p-3 rounded-full mr-4 flex-shrink-0">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-bold text-white truncate">
                        Venta #{sale.saleReference}
                      </h2>
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full text-white flex-shrink-0">
                        ID: #{sale.id}
                      </span>
                    </div>
                    <p className="text-white/80 flex items-center">
                      <UserIcon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      {sale.user.name} {sale.user.surname}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onBack}
                  className="bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </button>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute -bottom-3 sm:-bottom-5 left-0 right-0 flex justify-center">
            <div className="bg-white dark:bg-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center">
              <span
                className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${getStatusColor(
                  sale.status
                )}`}
              >
                {getStatusIcon(sale.status)}
                <span className="ml-1.5 sm:ml-2">
                  {getStatusText(sale.status)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6 pt-8 sm:pt-12">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3 lg:p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-500 dark:text-blue-400 mb-1 sm:mb-2" />
              <span className="text-sm sm:text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatPrice(sale.totalAmount)}
              </span>
              <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                Total
              </span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 sm:p-3 lg:p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-500 dark:text-purple-400 mb-1 sm:mb-2" />
              <span className="text-sm sm:text-xl lg:text-2xl font-bold text-purple-700 dark:text-purple-300">
                {sale.saleDetails.length}
              </span>
              <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                Productos
              </span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 sm:p-3 lg:p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-500 dark:text-green-400 mb-1 sm:mb-2" />
              <span className="text-sm sm:text-xl lg:text-2xl font-bold text-green-700 dark:text-green-300">
                {formatPrice(sale.shippingCost)}
              </span>
              <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                Envío
              </span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 sm:p-3 lg:p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-500 dark:text-amber-400 mb-1 sm:mb-2" />
              <span className="text-sm sm:text-xl lg:text-2xl font-bold text-amber-700 dark:text-amber-300">
                {new Date(sale.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
              <span className="text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                Fecha
              </span>
            </div>
          </div>

          {/* Información detallada */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Información de la venta */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center text-gray-900 dark:text-white">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500 dark:text-blue-400" />
                Información de la Venta
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Referencia
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white break-all">
                    {sale.saleReference}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Fecha de creación
                  </p>
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                    {formatDate(sale.createdAt)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Última actualización
                  </p>
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                    {formatDate(sale.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center text-gray-900 dark:text-white">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500 dark:text-green-400" />
                Información del Cliente
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Nombre completo
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white break-words">
                    {sale.user.name} {sale.user.surname}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </p>
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-all">
                    {sale.user.email}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Teléfono
                  </p>
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                    {sale.user.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dirección de entrega */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center text-gray-900 dark:text-white mb-3 sm:mb-4">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500 dark:text-purple-400" />
              Dirección de Entrega
            </h3>
            {sale.user.userAddresses.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                <div className="space-y-2 sm:space-y-3">
                  <p className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg break-words">
                    {sale.user.userAddresses[0].address.street}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">
                    {sale.user.userAddresses[0].address.colony}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">
                    {sale.user.userAddresses[0].address.city},{" "}
                    {sale.user.userAddresses[0].address.state}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">
                    {sale.user.userAddresses[0].address.postalCode},{" "}
                    {sale.user.userAddresses[0].address.country}
                  </p>
                  {sale.references && (
                    <div className="mt-3 sm:mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm break-words">
                        <strong>Referencias:</strong> {sale.references}
                      </p>
                    </div>
                  )}
                  {(sale.betweenStreetOne || sale.betweenStreetTwo) && (
                    <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                      <p className="text-purple-800 dark:text-purple-200 text-xs sm:text-sm break-words">
                        <strong>Entre calles:</strong> {sale.betweenStreetOne} y{" "}
                        {sale.betweenStreetTwo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Resumen de costos */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center text-gray-900 dark:text-white mb-3 sm:mb-4">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500 dark:text-yellow-400" />
              Resumen de Costos
            </h3>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 sm:p-6 border border-yellow-200 dark:border-yellow-800">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Subtotal:
                  </span>
                  <span className="font-semibold text-sm sm:text-lg text-gray-900 dark:text-white">
                    {formatPrice(sale.subtotalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center">
                    <Truck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Envío:
                  </span>
                  <span className="font-semibold text-sm sm:text-lg text-gray-900 dark:text-white">
                    {formatPrice(sale.shippingCost)}
                  </span>
                </div>
                <div className="border-t border-yellow-300 dark:border-yellow-700 pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatPrice(sale.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos con diseño mejorado */}
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

        <div className="relative">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 sm:p-4 text-white flex items-center justify-between rounded-b-[1.5rem] sm:rounded-b-[2rem]">
            <div className="flex items-center">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-xl font-bold">
                Productos Vendidos
              </h3>
            </div>
            <span className="bg-white/20 text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
              {sale.saleDetails.length} productos
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-6 pt-4 sm:pt-8">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/20">
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Color/Talla
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Cantidad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Precio Unit.
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Código
                  </th>
                </tr>
              </thead>
              <tbody>
                {sale.saleDetails.map((detail, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-blue-50/30 dark:bg-blue-900/10"
                    } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mr-4 flex-shrink-0">
                          {detail.productVariant.images &&
                          detail.productVariant.images.length > 0 ? (
                            <img
                              src={
                                detail.productVariant.images[0].url ||
                                "/placeholder.svg"
                              }
                              alt={detail.productVariant.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "/placeholder.svg?height=64&width=64";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                              <Package className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {detail.productVariant.product?.name}
                          </div>
                          
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <div style={{ backgroundColor: detail.productVariant.color.hexValue }} className={`w-4 h-4 rounded-full mr-2 border border-gray-200 dark:border-gray-700 bg-[${detail.productVariant.color.hexValue}]`}></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {detail.productVariant.color?.name}
                          </span>
                        </div>
                        <div>
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">
                            {detail.productVariant.size?.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold px-3 py-1 rounded-full">
                        {detail.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(detail.unitPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatPrice(detail.totalPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300">
                        {detail.productVariant.barcode}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {sale.saleDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  {/* Product Image */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                    {detail.productVariant.images &&
                    detail.productVariant.images.length > 0 ? (
                      <img
                        src={
                          detail.productVariant.images[0].url ||
                          "/placeholder.svg"
                        }
                        alt={detail.productVariant.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=64&width=64";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <Package className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1 break-words">
                      {detail.productVariant.product?.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">
                        {detail.productVariant.color.name}
                      </span>
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs font-medium px-2 py-1 rounded-full">
                        {detail.productVariant.size.name}
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold px-2 py-1 rounded-full">
                        Qty: {detail.quantity}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Precio unitario
                        </p>
                        <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                          {formatPrice(detail.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total
                        </p>
                        <p className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                          {formatPrice(detail.totalPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Código de barras
                      </p>
                      <p className="font-mono text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-all">
                        {detail.productVariant.barcode}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Botón de volver flotante para móviles */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sr-only">Volver</span>
        </button>
      </div>
    </div>
  );
};

export default SaleDetails;
