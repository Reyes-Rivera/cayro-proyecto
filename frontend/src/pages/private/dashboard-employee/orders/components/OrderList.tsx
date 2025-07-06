"use client";

import type React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Loader2,
  Eye,
  Package,
  Calendar,
  DollarSign,
  X,
} from "lucide-react";
import type { Order } from "../Orders";

interface OrderListProps {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  onView: (id: number) => void;
  onFilterChange: (filterParams: string) => void;
  isTableLoading?: boolean;
}

type SortOption = {
  label: string;
  value: string;
  direction: "asc" | "desc";
};

const sortOptions: SortOption[] = [
  { label: "Más recientes", value: "createdAt", direction: "desc" },
  { label: "Más antiguos", value: "createdAt", direction: "asc" },
  { label: "ID (ascendente)", value: "id", direction: "asc" },
  { label: "ID (descendente)", value: "id", direction: "desc" },
  { label: "Monto (mayor a menor)", value: "totalAmount", direction: "desc" },
  { label: "Monto (menor a mayor)", value: "totalAmount", direction: "asc" },
];

const statusOptions = [
  {
    value: "PENDING",
    label: "Pendiente",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    value: "PROCESSING",
    label: "Procesando",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    value: "PACKED",
    label: "Empacado",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    value: "SHIPPED",
    label: "Enviado",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    value: "DELIVERED",
    label: "Entregado",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    value: "CANCELLED",
    label: "Cancelado",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
];

const OrderList: React.FC<OrderListProps> = ({
  orders,
  totalOrders,
  totalPages,
  onView,
  onFilterChange,
  isTableLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const sortPanelRef = useRef<HTMLDivElement>(null);

  const initialFilters = {
    status: [] as string[],
    dateRange: null as { start: string; end: string } | null,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const getStatusInfo = (status: string) => {
    return (
      statusOptions.find((s) => s.value === status) || {
        value: status,
        label: status,
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      }
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleSearch = () => {
    const filterParams = buildFilterParams(
      filters,
      searchTerm,
      currentPage,
      itemsPerPage
    );
    onFilterChange(filterParams);
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters((prev) => {
      const currentStatuses = prev.status;
      return {
        ...prev,
        status: currentStatuses.includes(status)
          ? currentStatuses.filter((s) => s !== status)
          : [...currentStatuses, status],
      };
    });
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
    setCurrentPage(1);
    const filterParams = buildFilterParams(initialFilters, "", 1, itemsPerPage);
    onFilterChange(filterParams);
  };

  const buildFilterParams = (
    filters: typeof initialFilters,
    search: string,
    page: number,
    limit: number
  ) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (filters.status.length > 0)
      params.append("status", filters.status.join(","));
    if (sortBy) {
      params.append("sortBy", sortBy.value);
      params.append("sortDirection", sortBy.direction);
    }
    return params.toString();
  };

  const applyFilters = () => {
    const filterParams = buildFilterParams(
      filters,
      searchTerm,
      currentPage,
      itemsPerPage
    );
    onFilterChange(filterParams);
    setShowFilters(false);
  };

  const hasActiveFilters = useMemo(() => {
    return filters.status.length > 0 || searchTerm !== "";
  }, [filters, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-filter-button="true"]')
      ) {
        setShowFilters(false);
      }

      if (
        sortPanelRef.current &&
        !sortPanelRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-sort-button="true"]')
      ) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-blue-500 rounded-xl shadow-xl overflow-hidden relative">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-full mr-3 sm:mr-4">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Gestión de Pedidos
                </h2>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline" />
                  {totalOrders} {totalOrders === 1 ? "pedido" : "pedidos"}{" "}
                  activos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
          {/* Search bar with button */}
          <div className="relative flex-grow max-w-full md:max-w-md">
            <div className="flex">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar pedidos por ID, cliente..."
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSearchTerm("");
                      const filterParams = buildFilterParams(
                        filters,
                        "",
                        currentPage,
                        itemsPerPage
                      );
                      onFilterChange(filterParams);
                    }}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter and sort buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Filter button */}
            <div className="relative">
              <button
                data-filter-button="true"
                className={`w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-3 border rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                <span>Filtrar</span>
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
                {hasActiveFilters && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {filters.status.length + (searchTerm ? 1 : 0)}
                  </span>
                )}
              </button>

              {showFilters && (
                <div
                  ref={filterPanelRef}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                >
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Filtrar por Estado
                    </h3>
                    <div className="space-y-2">
                      {statusOptions.map((status) => (
                        <label
                          key={status.value}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.status.includes(status.value)}
                            onChange={() =>
                              handleStatusFilterChange(status.value)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        clearAllFilters();
                        setShowFilters(false);
                      }}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={applyFilters}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                    >
                      Aplicar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sort button */}
            <div className="relative">
              <button
                data-sort-button="true"
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Ordenar</span>
                {showSortOptions ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>

              {showSortOptions && (
                <div
                  ref={sortPanelRef}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={`${option.value}-${option.direction}`}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          sortBy.value === option.value &&
                          sortBy.direction === option.direction
                            ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } transition-colors`}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortOptions(false);
                          const filterParams = buildFilterParams(
                            filters,
                            searchTerm,
                            currentPage,
                            itemsPerPage
                          );
                          onFilterChange(filterParams);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active filters chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Filtros activos:
            </span>

            {searchTerm && (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-3 py-1 flex items-center">
                <span>Búsqueda: {searchTerm}</span>
                <button
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  onClick={() => {
                    setSearchTerm("");
                    const filterParams = buildFilterParams(
                      filters,
                      "",
                      currentPage,
                      itemsPerPage
                    );
                    onFilterChange(filterParams);
                  }}
                  aria-label="Eliminar filtro de búsqueda"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.status.map((status) => {
              const statusInfo = getStatusInfo(status);
              return (
                <div
                  key={status}
                  className={`text-xs rounded-full px-3 py-1 flex items-center ${statusInfo.color}`}
                >
                  <span>Estado: {statusInfo.label}</span>
                  <button
                    className="ml-2 hover:opacity-70 transition-opacity"
                    onClick={() => handleStatusFilterChange(status)}
                    aria-label="Eliminar filtro de estado"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            <button
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline ml-auto transition-colors"
              onClick={clearAllFilters}
            >
              Limpiar todos
            </button>
          </div>
        )}

        {/* Orders table/cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {/* Table header - visible only on tablet and above */}
          <div className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-white py-4 px-6 hidden lg:block">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1 font-medium">ID</div>
              <div className="col-span-3 font-medium">Cliente</div>
              <div className="col-span-2 font-medium">Estado</div>
              <div className="col-span-2 font-medium">Fecha</div>
              <div className="col-span-2 font-medium">Total</div>
              <div className="col-span-2 text-right font-medium">Acciones</div>
            </div>
          </div>

          {/* Loading state for the table only */}
          {isTableLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Cargando pedidos...
              </p>
            </div>
          ) : orders.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  {/* Desktop/Tablet View */}
                  <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                    <div className="col-span-1">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm">
                        {order.id}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {order.user.name} {order.user.surname}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          getStatusInfo(order.status).color
                        }`}
                      >
                        {getStatusInfo(order.status).label}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center font-medium text-gray-900 dark:text-white">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatCurrency(+order.totalAmount || 0)}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(order.id)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile/Tablet View */}
                  <div className="lg:hidden flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm">
                          {order.id}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {order.user.name} {order.user.surname}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.user.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          getStatusInfo(order.status).color
                        }`}
                      >
                        {getStatusInfo(order.status).label}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex items-center font-medium text-gray-900 dark:text-white">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatCurrency(+order.totalAmount || 0)}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => onView(order.id)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Ver detalles"
                        aria-label="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No se encontraron pedidos
              </p>
              <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
                {hasActiveFilters
                  ? "No hay pedidos que coincidan con los filtros aplicados"
                  : "No hay pedidos activos en este momento"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Mostrar
              </span>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                value={itemsPerPage}
                onChange={(e) => {
                  const newItemsPerPage = Number(e.target.value);
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1);
                  const filterParams = buildFilterParams(
                    filters,
                    searchTerm,
                    1,
                    newItemsPerPage
                  );
                  onFilterChange(filterParams);
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
              Mostrando{" "}
              {totalOrders > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} a{" "}
              {Math.min(currentPage * itemsPerPage, totalOrders)} de{" "}
              {totalOrders} pedidos
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === 1}
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);
                  const filterParams = buildFilterParams(
                    filters,
                    searchTerm,
                    newPage,
                    itemsPerPage
                  );
                  onFilterChange(filterParams);
                }}
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center">
                <input
                  type="text"
                  className="w-12 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  value={currentPage}
                  onChange={(e) => {
                    const page = Number.parseInt(e.target.value);
                    if (!isNaN(page) && page > 0 && page <= totalPages) {
                      setCurrentPage(page);
                      const filterParams = buildFilterParams(
                        filters,
                        searchTerm,
                        page,
                        itemsPerPage
                      );
                      onFilterChange(filterParams);
                    }
                  }}
                  aria-label="Número de página"
                />
                <span className="mx-1 text-gray-500 dark:text-gray-400">
                  de
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {totalPages || 1}
                </span>
              </div>

              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => {
                  const newPage = Math.min(currentPage + 1, totalPages);
                  setCurrentPage(newPage);
                  const filterParams = buildFilterParams(
                    filters,
                    searchTerm,
                    newPage,
                    itemsPerPage
                  );
                  onFilterChange(filterParams);
                }}
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
