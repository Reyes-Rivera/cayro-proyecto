"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Edit,
  Trash,
  MoreHorizontal,
  Plus,
  XCircle,
  Eye,
} from "lucide-react";
import type { Employee } from "../types/employee";
import Pagination from "./pagination";
import SearchAndFilters from "./search-and-filters";
import type { SortOption } from "../types/employee";

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
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Search and Filters Component */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showSortOptions={showSortOptions}
        setShowSortOptions={setShowSortOptions}
        refreshData={refreshData}
        isRefreshing={isRefreshing}
      />

      {/* Estadísticas */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-800/50 p-1.5 rounded-lg">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
            {filteredAndSortedItems.length}{" "}
            {filteredAndSortedItems.length === 1 ? "empleado" : "empleados"} en
            total
          </span>
        </div>

        <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
          {searchTerm
            ? `Mostrando resultados para: "${searchTerm}"`
            : "Mostrando todos los empleados"}
        </div>
      </div>

      {/* Tabla de datos */}
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
                        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-md">
                          <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                              #{item.id}
                            </span>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                              {item.name} {item.surname}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.role} | {item.email} | {item.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewDetails(item)}
                          className="bg-blue-100 dark:bg-blue-900/30 p-1.5 sm:p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(item)}
                          className="bg-amber-100 dark:bg-amber-900/30 p-1.5 sm:p-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                          title="Editar empleado"
                        >
                          <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(item)}
                          className="bg-red-100 dark:bg-red-900/30 p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          title="Eliminar empleado"
                        >
                          <Trash
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gray-100 dark:bg-gray-700 p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Más opciones"
                        >
                          <MoreHorizontal
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </motion.button>
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSearch}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm flex items-center gap-2 text-sm"
                  >
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Limpiar búsqueda
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openAddForm}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg sm:rounded-xl shadow-md transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Añadir Empleado
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Paginación */}
      {filteredAndSortedItems.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          paginate={paginate}
          totalItems={filteredAndSortedItems.length}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
        />
      )}
    </motion.div>
  );
};

export default EmployeeTable;
