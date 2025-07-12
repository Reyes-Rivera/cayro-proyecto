"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  XCircle,
  ChevronDown,
  ChevronUp,
  X,
  ShoppingCart,
  Eye,
  MapPin,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  Building,
  Hash,
  Mail,
  User,
  FileText,
} from "lucide-react";
import { getSales } from "@/api/sales"; // Ajusta la ruta según tu estructura
import ReportsModal from "./components/ReportsModal";
import SaleDetails from "./components/SaleDetails";
import Loader from "@/components/web-components/Loader";
import { AlertHelper } from "@/utils/alert.util";

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  colony: string;
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
export interface Color {
  id: number;
  name: string;
  hexValue: string;
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

// Filtros actualizados para la API
interface ApiFilters {
  startDate?: string;
  endDate?: string;
  employeeId?: number;
  userId?: number;
  productName?: string;
  minTotal?: number;
  maxTotal?: number;
  reference?: string;
  clientName?: string;
  clientEmail?: string;
  city?: string;
  state?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Opciones de filtro por estado
const statusOptions = [
  { value: "", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);

  // Estados de filtros básicos
  const [statusFilter, setStatusFilter] = useState("DELIVERED");

  // Estados de filtros avanzados
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [reference, setReference] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Estados de UI
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [currentView, setCurrentView] = useState<"list" | "details">("list");
  const [selectedSaleForDetails, setSelectedSaleForDetails] =
    useState<Sale | null>(null);

  // Función para obtener las ventas de la API
  const fetchSales = async (
    filters: ApiFilters
  ): Promise<{ sales: Sale[]; total: number }> => {
    try {
      const queryParams = new URLSearchParams();

      // Agregar todos los filtros a los query parameters
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.employeeId)
        queryParams.append("employeeId", filters.employeeId.toString());
      if (filters.userId)
        queryParams.append("userId", filters.userId.toString());
      if (filters.productName)
        queryParams.append("productName", filters.productName);
      if (filters.minTotal !== undefined)
        queryParams.append("minTotal", filters.minTotal.toString());
      if (filters.maxTotal !== undefined)
        queryParams.append("maxTotal", filters.maxTotal.toString());
      if (filters.reference) queryParams.append("reference", filters.reference);
      if (filters.clientName)
        queryParams.append("clientName", filters.clientName);
      if (filters.clientEmail)
        queryParams.append("clientEmail", filters.clientEmail);
      if (filters.city) queryParams.append("city", filters.city);
      if (filters.state) queryParams.append("state", filters.state);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.limit) queryParams.append("limit", filters.limit.toString());

      const response = await getSales(queryParams.toString());
      const data = response.data;

      return {
        sales: Array.isArray(data) ? data : data.sales || data.data || [],
        total: data.total || data.count || data.length || 0,
      };
    } catch (error: any) {
      AlertHelper.error({
        title: "Error al obtener la información",
        message:
          error.response?.data?.message || "No se pudieron obtener las ventas.",
        timer: 4000,
        animation: "slideIn",
      });
      return {
        sales: [],
        total: 0,
      };
    }
  };

  // Función para construir los filtros de la API
  const buildApiFilters = useCallback((): ApiFilters => {
    const filters: ApiFilters = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (statusFilter) filters.status = statusFilter;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (minTotal && !isNaN(Number(minTotal)))
      filters.minTotal = Number(minTotal);
    if (maxTotal && !isNaN(Number(maxTotal)))
      filters.maxTotal = Number(maxTotal);
    if (reference.trim()) filters.reference = reference.trim();
    if (clientName.trim()) filters.clientName = clientName.trim();
    if (clientEmail.trim()) filters.clientEmail = clientEmail.trim();
    if (city.trim()) filters.city = city.trim();
    if (state.trim()) filters.state = state.trim();

    return filters;
  }, [
    currentPage,
    itemsPerPage,
    statusFilter,
    startDate,
    endDate,
    minTotal,
    maxTotal,
    reference,
    clientName,
    clientEmail,
    city,
    state,
  ]);

  // Función para cargar las ventas
  const loadSales = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setIsInitialLoading(true);
      }

      try {
        const filters = buildApiFilters();
        const { sales: salesData, total } = await fetchSales(filters);
        setSales(salesData);
        setTotalItems(total);
      } catch (error: any) {
        AlertHelper.error({
          title: "Error al cargar ventas",
          message:
            error.response?.data?.message ||
            "No se pudieron cargar las ventas. Inténtalo de nuevo.",
          timer: 3000,
          animation: "slideIn",
        });

      } finally {
        if (showLoading) {
          setIsInitialLoading(false);
        }
      }
    },
    [buildApiFilters]
  );

  // Función para refrescar datos
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadSales();
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
    } catch (error:any) {
      AlertHelper.error({
        title: "Error al refrescar datos",
        message:
          error.response?.data?.message ||
          "No se pudieron refrescar los datos. Inténtalo de nuevo.",
        timer: 3000,
        animation: "slideIn",
      });
      setIsRefreshing(false);
    }
  };

  const handleViewDetails = (sale: Sale) => {
    setSelectedSaleForDetails(sale);
    setCurrentView("details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedSaleForDetails(null);
  };

 const handleGenerateReport = async (
  format: "excel" | "pdf"
) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    AlertHelper.success({
      title: "Reporte generado",
      message: `El reporte en formato ${format.toUpperCase()} se ha generado exitosamente.`,
      timer: 3000,
      animation: "slideIn",
    });
  } catch (error: any) {
    AlertHelper.error({
      title: "Error al generar el reporte",
      message:
        error.response?.data?.message ||
        "No se pudo generar el reporte. Inténtalo de nuevo.",
      timer: 3000,
      animation: "slideIn",
    });
  }
};


  // Función para aplicar filtros avanzados
  const applyAdvancedFilters = async () => {
    setCurrentPage(1);
    await loadSales();
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setStatusFilter("DELIVERED");
    setStartDate("");
    setEndDate("");
    setMinTotal("");
    setMaxTotal("");
    setReference("");
    setClientName("");
    setClientEmail("");
    setCity("");
    setState("");
    setCurrentPage(1);
  };

  // Función para obtener el color del estado
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

  // Cargar datos iniciales
  useEffect(() => {
    loadSales(true);
  }, []);

  // Recargar cuando cambien la paginación
  useEffect(() => {
    if (!isInitialLoading) {
      loadSales();
    }
  }, [currentPage, itemsPerPage, loadSales, isInitialLoading]);

  // Manejar Enter en el campo de búsqueda
  // const handleSearchKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault()
  //     handleSearch()
  //   }
  // }

  const hasActiveFilters =
    statusFilter !== "DELIVERED" ||
    startDate ||
    endDate ||
    minTotal ||
    maxTotal ||
    reference ||
    clientName ||
    clientEmail ||
    city ||
    state;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {currentView === "list" && (
        <>
          {/* Header section */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl overflow-hidden relative mb-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
            </div>
            <div className="p-4 sm:p-6 relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2.5 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Gestión de Ventas
                    </h2>
                    <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                      <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline" />
                      {totalItems} {totalItems === 1 ? "venta" : "ventas"}{" "}
                      encontradas
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-white/80 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Total:{" "}
                    {formatPrice(
                      sales.reduce(
                        (sum, sale) =>
                          sum + Number.parseFloat(sale.totalAmount),
                        0
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            {/* Toolbar */}
            <div className="space-y-4 mb-6">
              {/* Primera fila: Búsqueda y acciones principales */}
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                  {/* Status filter */}
                  <select
                    className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* Filtros avanzados toggle */}
                  <button
                    className="flex items-center justify-center gap-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filtros</span>
                    {showAdvancedFilters ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </button>

                  <button
                    onClick={refreshData}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={`w-5 m-auto h-5 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => setShowReportsModal(true)}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="hidden sm:inline">Reportes</span>
                  </button>
                </div>
              </div>

              {/* Filtros avanzados */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Filter className="w-5 h-5 mr-2" />
                      Filtros Avanzados
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {/* Fechas */}
                      <div>
                        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Fecha inicio
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Fecha fin
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>

                      {/* Montos */}
                      <div>
                        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Monto mínimo
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          value={minTotal}
                          onChange={(e) => setMinTotal(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Monto máximo
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          value={maxTotal}
                          onChange={(e) => setMaxTotal(e.target.value)}
                        />
                      </div>

                      {/* Producto y referencia */}
                      <div>
                        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Hash className="w-4 h-4 mr-1" />
                          Referencia
                        </label>
                        <input
                          type="text"
                          placeholder="Referencia de venta"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                        />
                      </div>

                      {/* Cliente */}
                      <div>
                        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Nombre cliente
                        </label>
                        <input
                          type="text"
                          placeholder="Nombre del cliente"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          Email cliente
                        </label>
                        <input
                          type="email"
                          placeholder="email@ejemplo.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                        />
                      </div>

                      {/* Ubicación */}
                      <div>
                        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          Ciudad
                        </label>
                        <input
                          type="text"
                          placeholder="Ciudad"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          Estado
                        </label>
                        <input
                          type="text"
                          placeholder="Estado"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Limpiar filtros
                      </button>
                      <button
                        onClick={applyAdvancedFilters}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <Filter className="w-4 h-4 mr-1" />
                        Aplicar filtros
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active filters chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                  <Filter className="w-4 h-4 mr-1" />
                  Filtros activos:
                </span>
                {statusFilter && statusFilter !== "DELIVERED" && (
                  <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full px-3 py-1 flex items-center">
                    <span>Estado: {getStatusText(statusFilter)}</span>
                    <button
                      className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
                      onClick={() => setStatusFilter("DELIVERED")}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {/* Agregar más chips para otros filtros activos */}
                {startDate && (
                  <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full px-3 py-1 flex items-center">
                    <span>Desde: {startDate}</span>
                    <button
                      className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
                      onClick={() => setStartDate("")}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {endDate && (
                  <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full px-3 py-1 flex items-center">
                    <span>Hasta: {endDate}</span>
                    <button
                      className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
                      onClick={() => setEndDate("")}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sales table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              {isInitialLoading ? (
                <Loader />
              ) : (
                <>
                  {/* Table header - visible only on tablet and above */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 text-blue-700 dark:text-white py-4 px-6 hidden lg:">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2 font-semibold">Referencia</div>
                      <div className="col-span-2 font-semibold">Cliente</div>
                      <div className="col-span-2 font-semibold">Estado</div>
                      <div className="col-span-2 font-semibold">Total</div>
                      <div className="col-span-2 font-semibold">Fecha</div>
                      <div className="col-span-2 text-right font-semibold">
                        Acciones
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {sales.length > 0 ? (
                      sales.map((sale, index) => (
                        <motion.div
                          key={sale.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
                        >
                          {/* Desktop/Tablet View */}
                          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                            <div className="col-span-2">
                              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {sale.saleReference}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {sale.id}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {sale.user.name} {sale.user.surname}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {sale.user.email}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  sale.status
                                )}`}
                              >
                                {getStatusIcon(sale.status)}
                                <span className="ml-1.5">
                                  {getStatusText(sale.status)}
                                </span>
                              </span>
                            </div>
                            <div className="col-span-2">
                              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {formatPrice(sale.totalAmount)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Subtotal: {formatPrice(sale.subtotalAmount)}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {formatDate(sale.createdAt)}
                              </div>
                            </div>
                            <div className="col-span-2 flex items-center justify-end">
                              <button
                                onClick={() => handleViewDetails(sale)}
                                className="p-2.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all duration-200 hover:scale-105"
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          {/* Mobile/Tablet View */}
                          <div className="lg:hidden flex flex-col space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {sale.saleReference}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {sale.user.name} {sale.user.surname}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  sale.status
                                )}`}
                              >
                                {getStatusIcon(sale.status)}
                                <span className="ml-1.5">
                                  {getStatusText(sale.status)}
                                </span>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {formatPrice(sale.totalAmount)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(sale.createdAt)}
                                </div>
                              </div>
                              <button
                                onClick={() => handleViewDetails(sale)}
                                className="p-2.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all duration-200 hover:scale-105"
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4">
                          <ShoppingCart className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          No se encontraron ventas
                        </h3>
                        <p className="text-sm mb-6 text-gray-500 dark:text-gray-400 max-w-md">
                          No hay ventas que coincidan con los filtros aplicados.
                          Intenta ajustar los criterios de búsqueda.
                        </p>
                        <button
                          onClick={clearAllFilters}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Limpiar todos los filtros
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Mostrar
                        </span>
                        <select
                          className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          por página
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                        {Math.min(currentPage * itemsPerPage, totalItems)} de{" "}
                        {totalItems} ventas
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={currentPage === 1}
                          onClick={() => paginate(currentPage - 1)}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center">
                          <input
                            type="text"
                            className="w-12 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            value={currentPage}
                            onChange={(e) => {
                              const page = Number.parseInt(e.target.value);
                              if (
                                !isNaN(page) &&
                                page > 0 &&
                                page <= totalPages
                              ) {
                                setCurrentPage(page);
                              }
                            }}
                          />
                          <span className="mx-2 text-gray-500 dark:text-gray-400">
                            de
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {totalPages}
                          </span>
                        </div>
                        <button
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={currentPage === totalPages}
                          onClick={() => paginate(currentPage + 1)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
      {currentView === "details" && selectedSaleForDetails && (
        <SaleDetails sale={selectedSaleForDetails} onBack={handleBackToList} />
      )}
      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        onGenerateReport={handleGenerateReport}
      />
    </div>
  );
};

export default SalesPage;
