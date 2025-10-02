"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useCallback } from "react";
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

// Animation variants fuera del componente
const dropdownVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.95 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Items per page options
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

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
  // Memoized statistics
  const stats = useMemo(
    () => ({
      total: filteredAndSortedItems.length,
      active: filteredAndSortedItems.filter((emp) => emp.active).length,
      inactive: filteredAndSortedItems.filter((emp) => !emp.active).length,
      showingText: searchTerm
        ? `Mostrando resultados para: "${searchTerm}"`
        : "Mostrando todos los empleados",
      employeeText:
        filteredAndSortedItems.length === 1 ? "empleado" : "empleados",
    }),
    [filteredAndSortedItems, searchTerm]
  );

  // Memoized pagination info
  const paginationInfo = useMemo(
    () => ({
      showingStart: indexOfFirstItem + 1,
      showingEnd: Math.min(indexOfLastItem, filteredAndSortedItems.length),
      total: filteredAndSortedItems.length,
    }),
    [indexOfFirstItem, indexOfLastItem, filteredAndSortedItems.length]
  );

  // Memoized handlers
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [setSearchTerm, setCurrentPage]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    [setSearchTerm, setCurrentPage]
  );

  const handleItemsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    },
    [setItemsPerPage, setCurrentPage]
  );

  const handlePageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const page = Number.parseInt(e.target.value);
      if (!isNaN(page) && page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages, setCurrentPage]
  );

  const paginate = useCallback(
    (pageNumber: number) => {
      setCurrentPage(pageNumber);
    },
    [setCurrentPage]
  );

  const toggleSortOptions = useCallback(() => {
    setShowSortOptions(!showSortOptions);
  }, [showSortOptions, setShowSortOptions]);

  const handleSortSelect = useCallback(
    (option: SortOption) => {
      setSortBy(option);
      setShowSortOptions(false);
    },
    [setSortBy, setShowSortOptions]
  );

  // Componente de tarjeta de empleado
  const EmployeeCard = useCallback(
    ({ employee, index }: { employee: Employee; index: number }) => {
      const roleText = employee.role === "ADMIN" ? "Administrador" : "Empleado";

      return (
        <motion.div
          key={employee.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
          role="article"
          aria-label={`Empleado: ${employee.name} ${employee.surname}`}
        >
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div
              className="bg-blue-500 text-white p-2 sm:p-3 rounded-lg shadow-md"
              aria-hidden="true"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span
                  className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                  aria-label={`ID: ${employee.id}`}
                >
                  #{employee.id}
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {employee.name} {employee.surname}
                </h3>

                {/* Estado del empleado */}
                {employee.active ? (
                  <div
                    className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-xs font-medium"
                    role="status"
                    aria-label="Empleado activo"
                  >
                    <CheckCircle className="w-3 h-3" aria-hidden="true" />
                    <span>Activo</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full text-xs font-medium"
                    role="status"
                    aria-label="Empleado inactivo"
                  >
                    <XCircle className="w-3 h-3" aria-hidden="true" />
                    <span>Inactivo</span>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {roleText} | {employee.email} | {employee.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleViewDetails(employee)}
              className="bg-blue-100 dark:bg-blue-900/30 p-1.5 sm:p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700"
              aria-label={`Ver detalles de ${employee.name} ${employee.surname}`}
              title="Ver detalles"
            >
              <Eye
                size={16}
                className="sm:w-[18px] sm:h-[18px]"
                aria-hidden="true"
              />
            </button>
            <button
              onClick={() => handleEdit(employee)}
              className="bg-amber-100 dark:bg-amber-900/30 p-1.5 sm:p-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700"
              aria-label={`Editar ${employee.name} ${employee.surname}`}
              title="Editar empleado"
            >
              <Edit
                size={16}
                className="sm:w-[18px] sm:h-[18px]"
                aria-hidden="true"
              />
            </button>
            <button
              onClick={() => handleDelete(employee)}
              className="bg-red-100 dark:bg-red-900/30 p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700"
              aria-label={`Eliminar ${employee.name} ${employee.surname}`}
              title="Eliminar empleado"
            >
              <Trash
                size={16}
                className="sm:w-[18px] sm:h-[18px]"
                aria-hidden="true"
              />
            </button>
          </div>
        </motion.div>
      );
    },
    [handleViewDetails, handleEdit, handleDelete]
  );

  // Empty state component
  const EmptyState = useCallback(
    () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6 text-center"
        role="status"
        aria-live="polite"
      >
        <div
          className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-full mb-4"
          aria-hidden="true"
        >
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
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm flex items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            aria-label="Limpiar búsqueda"
          >
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            Limpiar búsqueda
          </button>
        ) : (
          <button
            onClick={openAddForm}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            aria-label="Añadir nuevo empleado"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            Añadir Empleado
          </button>
        )}
      </motion.div>
    ),
    [searchTerm, clearSearch, openAddForm]
  );

  // Loading state component
  const LoadingState = useCallback(
    () => (
      <div
        className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20"
        role="status"
        aria-label="Cargando empleados"
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
          <div
            className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30 opacity-25"
            aria-hidden="true"
          ></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"
            aria-hidden="true"
          ></div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-4">
          Cargando empleados...
        </p>
      </div>
    ),
    []
  );

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      role="region"
      aria-label="Lista de empleados"
    >
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        {/* Search bar */}
        <div className="relative flex-grow max-w-full md:max-w-md">
          <div className="flex">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Buscar empleados..."
                className="pl-12 pr-10 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Buscar empleados"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  onClick={() => setSearchTerm("")}
                  aria-label="Limpiar búsqueda"
                >
                  <XCircle className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>
            <button
              className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Filter and sort buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Sort button */}
          <div className="relative">
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              onClick={toggleSortOptions}
              aria-expanded={showSortOptions}
              aria-haspopup="true"
              aria-label="Ordenar empleados"
            >
              <ArrowUpDown className="w-4 h-4" aria-hidden="true" />
              <span>Ordenar</span>
              {showSortOptions ? (
                <ChevronUp className="w-4 h-4 ml-1" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
              )}
            </button>

            <AnimatePresence>
              {showSortOptions && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-40"
                  role="menu"
                  aria-label="Opciones de ordenamiento"
                >
                  <div className="p-2">
                    {sortOptions.map((option) => (
                      <button
                        key={`${option.value}-${option.direction}`}
                        onClick={() => handleSortSelect(option)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          sortBy.value === option.value &&
                          sortBy.direction === option.direction
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                        role="menuitem"
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
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            disabled={isRefreshing}
            aria-label="Actualizar lista de empleados"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-800/50 p-1.5 rounded-lg">
            <Users
              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
          </div>
          <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
            {stats.total} {stats.employeeText} en total
          </span>
        </div>

        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4">
          <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
            {stats.showingText}
          </div>

          {/* Estadísticas de activos/inactivos */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800/50 px-2 py-0.5 rounded-full"
              aria-label={`${stats.active} empleados activos`}
            >
              <CheckCircle className="w-3 h-3" aria-hidden="true" />
              <span>{stats.active} activos</span>
            </div>
            <div
              className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800/50 px-2 py-0.5 rounded-full"
              aria-label={`${stats.inactive} empleados inactivos`}
            >
              <XCircle className="w-3 h-3" aria-hidden="true" />
              <span>{stats.inactive} inactivos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {isInitialLoading ? (
          <LoadingState />
        ) : (
          <div className="min-h-[300px] sm:min-h-[400px]">
            {currentItems.length > 0 ? (
              <div
                className="grid gap-3 sm:gap-4 p-3 sm:p-4 md:p-6"
                role="list"
                aria-label="Lista de empleados"
              >
                <AnimatePresence>
                  {currentItems.map((item, index) => (
                    <EmployeeCard key={item.id} employee={item} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState />
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
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              aria-label="Elementos por página"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              por página
            </span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {paginationInfo.showingStart} a{" "}
            {paginationInfo.showingEnd} de {paginationInfo.total} empleados
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              aria-label="Página anterior"
            >
              Anterior
            </button>

            <div className="flex items-center">
              <input
                type="text"
                className="w-12 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={currentPage}
                onChange={handlePageInputChange}
                aria-label="Número de página"
              />
              <span className="mx-1 text-gray-500 dark:text-gray-400">de</span>
              <span className="text-gray-700 dark:text-gray-300">
                {totalPages}
              </span>
            </div>

            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
