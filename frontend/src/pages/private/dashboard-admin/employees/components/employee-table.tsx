"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Edit,
  Trash,
  Plus,
  XCircle,
  Eye,
  Users,
  Search,
  RefreshCw,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import type { Employee, SortOption } from "../types/employee";
import { sortOptions } from "../constants/employee-constants";

interface EmployeeTableProps {
  items: Employee[];
  filteredAndSortedItems: Employee[];
  currentItems: Employee[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  showSortOptions: boolean;
  setShowSortOptions: (show: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  handleEdit: (employee: Employee) => void;
  handleDelete: (employee: Employee) => void;
  handleViewDetails: (employee: Employee) => void;
  refreshData: () => void;
  openAddForm: () => void;
}

const EmployeeTable = ({
  filteredAndSortedItems,
  currentItems,
  isInitialLoading,
  isRefreshing,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  showSortOptions,
  setShowSortOptions,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  handleEdit,
  handleDelete,
  handleViewDetails,
  refreshData,
  openAddForm,
}: EmployeeTableProps) => {
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        {/* Search bar */}
        <div className="relative flex-grow max-w-full md:max-w-md">
          <div className="flex">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar empleados..."
                className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => {}} // La búsqueda es en tiempo real
              className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and sort buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Sort button */}
          <div className="relative" data-sort-dropdown="true">
            <button
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

            <AnimatePresence>
              {showSortOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-40"
                >
                  <div className="p-2">
                    {sortOptions.map((option) => (
                      <button
                        key={`${option.value}-${option.direction}`}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortOptions(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          sortBy.value === option.value &&
                          sortBy.direction === option.direction
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={refreshData}
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-800/50 p-1.5 rounded-lg">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
            {filteredAndSortedItems.length}{" "}
            {filteredAndSortedItems.length === 1 ? "empleado" : "empleados"} en
            total
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
            {searchTerm
              ? `Mostrando resultados para: "${searchTerm}"`
              : "Mostrando todos los empleados"}
          </div>

          {/* Estadísticas de activos/inactivos */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800/50 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              <span>
                {filteredAndSortedItems.filter((emp) => emp.active).length}{" "}
                activos
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800/50 px-2 py-0.5 rounded-full">
              <XCircle className="w-3 h-3" />
              <span>
                {filteredAndSortedItems.filter((emp) => !emp.active).length}{" "}
                inactivos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30 opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-4">
              Cargando empleados...
            </p>
          </div>
        ) : (
          <div className="min-h-[300px] sm:min-h-[400px]">
            {currentItems.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
                <AnimatePresence>
                  {currentItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="bg-blue-500 text-white p-2 sm:p-3 rounded-lg shadow-md">
                          <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                              #{item.id}
                            </span>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                              {item.name} {item.surname}
                            </h3>

                            {/* Estado del empleado */}
                            {item.active ? (
                              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                <span>Activo</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full text-xs font-medium">
                                <XCircle className="w-3 h-3" />
                                <span>Inactivo</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.role === "ADMIN" ? "Administrador" : "Empleado"} | {item.email} | {item.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="bg-blue-100 dark:bg-blue-900/30 p-1.5 sm:p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-amber-100 dark:bg-amber-900/30 p-1.5 sm:p-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                          title="Editar empleado"
                        >
                          <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="bg-red-100 dark:bg-red-900/30 p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          title="Eliminar empleado"
                        >
                          <Trash
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6 text-center"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-full mb-4">
                  <User className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 dark:text-blue-300" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {searchTerm
                    ? `No se encontraron resultados para "${searchTerm}"`
                    : "No hay empleados disponibles"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md">
                  {searchTerm
                    ? "Intenta con otro término de búsqueda o limpia los filtros para ver todos los empleados"
                    : "Añade empleados para comenzar a gestionar tu equipo"}
                </p>

                {searchTerm ? (
                  <button
                    onClick={clearSearch}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm flex items-center gap-2 text-sm"
                  >
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Limpiar búsqueda
                  </button>
                ) : (
                  <button
                    onClick={openAddForm}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Añadir Empleado
                  </button>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredAndSortedItems.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Mostrar
            </span>
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
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
            Mostrando {indexOfFirstItem + 1} a{" "}
            {Math.min(indexOfLastItem, filteredAndSortedItems.length)} de{" "}
            {filteredAndSortedItems.length} empleados
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              aria-label="Página anterior"
            >
              Anterior
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
                  }
                }}
                aria-label="Número de página"
              />
              <span className="mx-1 text-gray-500 dark:text-gray-400">de</span>
              <span className="text-gray-700 dark:text-gray-300">
                {totalPages}
              </span>
            </div>

            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
              aria-label="Página siguiente"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
